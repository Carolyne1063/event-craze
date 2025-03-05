import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './src/routes/userRoutes';
import dotenv from 'dotenv';
import eventRoutes from './src/routes/eventRoutes';
import bookingRoutes from './src/routes/bookingRoutes';
import ticketRoutes from './src/routes/ticketRoutes';
import reviewRoutes from './src/routes/reviewRoutes';
import PaymentService from './src/services/paymentService';
import { PrismaClient, Prisma } from '@prisma/client';
import paymentRoutes from './src/routes/paymentRoutes';
dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Mount your routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/reviews', reviewRoutes);
app.use("/api/payments", paymentRoutes);


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
app.post('/callback', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const callbackData = req.body;
  console.log('MPESA Callback Data:', callbackData.Body);

  // If CallbackMetadata is missing, the transaction might have failed or been cancelled.
  if (!callbackData.Body.stkCallback.CallbackMetadata) {
    console.log('No CallbackMetadata found, transaction may have been cancelled or failed.');
    res.json('ok');
    return;
  }

  // Extract details from the callback metadata
  const metadataItems = callbackData.Body.stkCallback.CallbackMetadata.Item;
  const amount = metadataItems.find((item: { Name: string }) => item.Name === 'Amount')?.Value;
  const trnxId = metadataItems.find((item: { Name: string }) => item.Name === 'MpesaReceiptNumber')?.Value;
  const phone = metadataItems.find((item: { Name: string }) => item.Name === 'PhoneNumber')?.Value;

  // For this example, assume the payment is successful if CallbackMetadata exists.
  const status = 'SUCCESSFUL';

  try {
    const payment = await prisma.payment.create({
      data: {
        // Ensure your field names here match your Prisma schema exactly.
        phoneNo: phone.toString(),
        trnxId: trnxId,
        amount: new Prisma.Decimal(amount),
        status: status,
        // Optionally, add bookingId if you can correlate this payment with a booking.
      }
    });

    console.log('Payment saved:', payment);
    res.status(200).json({ message: 'Payment saved', payment });
  } catch (error: any) {
    console.error('Error saving payment:', error);
    res.status(500).json({ message: 'Error saving payment', error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
