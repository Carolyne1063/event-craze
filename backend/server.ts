import express from 'express';
import userRoutes from './src/routes/userRoutes';
 // ✅ Corrected path
 import dotenv from 'dotenv';
dotenv.config();



const app = express();
app.use(express.json());

// Use the routes
app.use('/api/users', userRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
