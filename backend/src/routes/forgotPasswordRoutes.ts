import express from 'express';
import { forgotPassword, verifyOtp, resetPassword } from '../controllers/forgotPasswordController';

const router = express.Router();

// ✅ Ensure async handlers are passed correctly
router.post('/forgot-password', async (req, res, next) => {
    try {
        await forgotPassword(req, res);
    } catch (error) {
        next(error); // Pass errors to Express error handler
    }
});

router.post('/verify-otp', async (req, res, next) => {
    try {
        await verifyOtp(req, res);
    } catch (error) {
        next(error);
    }
});

router.post('/reset-password', async (req, res, next) => {
    try {
        await resetPassword(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
