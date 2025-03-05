import express from 'express';
import userRoutes from './src/routes/userRoutes';
 // ✅ Corrected path
 import dotenv from 'dotenv';
import eventRoutes from './src/routes/eventRoutes';
import bookingRoutes from './src/routes/bookingRoutes';
import ticketRoutes from './src/routes/ticketRoutes';
import reviewRoutes from './src/routes/reviewRoutes';
import PaymentService from './src/services/paymentService';
dotenv.config();



const app = express();
app.use(express.json());

// Use the routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/reviews", reviewRoutes);
app.post('/stk', async (req, res) => {
    const { phone, amount } = req.body;
    try {
      const paymentResponse = await PaymentService.initiateSTKPush(phone, amount);
      res.status(200).json(paymentResponse);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });



app.listen(3000, () => console.log('Server running on port 3000'));
