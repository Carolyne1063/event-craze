"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./src/routes/userRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const eventRoutes_1 = __importDefault(require("./src/routes/eventRoutes"));
const bookingRoutes_1 = __importDefault(require("./src/routes/bookingRoutes"));
const ticketRoutes_1 = __importDefault(require("./src/routes/ticketRoutes"));
const reviewRoutes_1 = __importDefault(require("./src/routes/reviewRoutes"));
const paymentService_1 = __importDefault(require("./src/services/paymentService"));
const client_1 = require("@prisma/client");
const paymentRoutes_1 = __importDefault(require("./src/routes/paymentRoutes"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Mount your routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/events', eventRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/tickets', ticketRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use("/api/payments", paymentRoutes_1.default);
// Test endpoint for MPESA STK Push
app.post('/stk', async (req, res, next) => {
    const { phone, amount } = req.body;
    try {
        const paymentResponse = await paymentService_1.default.initiateSTKPush(phone, amount);
        res.status(200).json(paymentResponse);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// MPESA Callback endpoint to save transaction details
// MPESA Callback endpoint to save transaction details
app.post('/callback', async (req, res, next) => {
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
        const amount = metadataItems.find((item) => item.Name === 'Amount')?.Value;
        const trnxId = metadataItems.find((item) => item.Name === 'MpesaReceiptNumber')?.Value;
        const phone = metadataItems.find((item) => item.Name === 'PhoneNumber')?.Value;
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
                amount: new client_1.Prisma.Decimal(amount),
                status: status,
            }
        });
        console.log('New Payment Record Created:');
        console.log(payment);
        res.status(200).json({ message: 'Payment saved', payment });
    }
    catch (error) {
        console.error('Error in callback endpoint:', error);
        res.status(500).json({ message: 'Error saving payment', error: error.message });
    }
});
app.listen(3000, () => console.log('Server running on port 3000'));
