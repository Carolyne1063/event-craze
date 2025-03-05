"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentById = exports.getAllPayments = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllPayments = async (req, res) => {
    try {
        const payments = await prisma.payment.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(payments);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving payments", error: error.message });
    }
};
exports.getAllPayments = getAllPayments;
const getPaymentById = async (req, res) => {
    try {
        const payment = await prisma.payment.findUnique({
            where: { id: req.params.paymentId }
        });
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.status(200).json(payment);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving payment", error: error.message });
    }
};
exports.getPaymentById = getPaymentById;
