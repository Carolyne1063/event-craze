import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(payments);
  } catch (error: any) {
    res.status(500).json({ message: "Error retrieving payments", error: error.message });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.paymentId }
    });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error: any) {
    res.status(500).json({ message: "Error retrieving payment", error: error.message });
  }
};
