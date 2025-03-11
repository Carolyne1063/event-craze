import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './src/routes/userRoutes';
import dotenv from 'dotenv';
import eventRoutes from './src/routes/eventRoutes';
import bookingRoutes from './src/routes/bookingRoutes';
import ticketRoutes from './src/routes/ticketRoutes';
import reviewRoutes from './src/routes/reviewRoutes';
import notificationRoutes from './src/routes/notificationRoutes';
import PaymentService from './src/services/paymentService';
import { PrismaClient, Prisma } from '@prisma/client';
import paymentRoutes from './src/routes/paymentRoutes';
dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Mount your routes
app.use('/api/auth', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/reviews', reviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);



// Test endpoint for MPESA STK Push
app.post('/stk', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { phone, amount } = req.body;
  try {
    const paymentResponse = await PaymentService.initiateSTKPush(phone, amount);
    res.status(200).json(paymentResponse);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// MPESA Callback endpoint to save transaction details
// MPESA Callback endpoint to save transaction details
app.post('/callback', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log("MPESA Response:", req.body);
  res.status(200).send("Received");
  try {
    // Log the complete callback payload for debugging
    console.log('--- Callback Payload Start ---');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('--- Callback Payload End ---');

    const callbackData = req.body;

    // Check if CallbackMetadata exists
    if (!callbackData.Body?.stkCallback?.CallbackMetadata) {
      console.log('No CallbackMetadata found, transaction may have been cancelled or failed.');
      res.json('ok');
      return;
    }

    // Extract details from the callback metadata
    const metadataItems = callbackData.Body.stkCallback.CallbackMetadata.Item;
    const amount = metadataItems.find((item: { Name: string }) => item.Name === 'Amount')?.Value;
    const trnxId = metadataItems.find((item: { Name: string }) => item.Name === 'MpesaReceiptNumber')?.Value;
    const phone = metadataItems.find((item: { Name: string }) => item.Name === 'PhoneNumber')?.Value;

    console.log('Extracted Values:');
    console.log('Amount:', amount);
    console.log('Transaction ID (MpesaReceiptNumber):', trnxId);
    console.log('Phone Number:', phone);
    // For this example, assume the payment is successful if CallbackMetadata exists.
    const status = 'SUCCESSFUL';

    // Check if a payment with this transaction ID already exists
    const existingPayment = await prisma.payment.findFirst({
      where: { trnxId }
    });
    if (existingPayment) {
      console.log(`Payment with transaction id ${trnxId} already exists. Skipping creation.`);
      res.json({ message: 'Payment already recorded', payment: existingPayment });
      return;
    }

    // Create a new payment record with the extracted data
    const payment = await prisma.payment.create({
      data: {
        phoneNo: phone.toString(),
        trnxId: trnxId,
        amount: new Prisma.Decimal(amount),
        status: status,
      }
    });

    console.log('New Payment Record Created:');
    console.log(payment);

    res.status(200).json({ message: 'Payment saved', payment });
  } catch (error: any) {
    console.error('Error in callback endpoint:', error);
    res.status(500).json({ message: 'Error saving payment', error: error.message });
  }
});


app.listen(3000, () => console.log('Server running on port 3000'));