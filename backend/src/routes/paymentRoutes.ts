import express from 'express';
import { getAllPayments, getPaymentById } from '../controllers/paymentController';

const router = express.Router();

router.get("/", getAllPayments);
// router.get("/:paymentId", getPaymentById);

export default router;
