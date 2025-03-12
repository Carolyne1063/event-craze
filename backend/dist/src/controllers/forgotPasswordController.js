"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyOtp = exports.forgotPassword = void 0;
const client_1 = require("@prisma/client");
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient(); // ✅ Instantiate Prisma Client
let otpStore = {}; // Temporary store
// 🔹 1. Forgot Password - Generate OTP
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
        otpStore[email] = otp;
        // Send OTP via Email
        let transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false, // 🔹 Allows self-signed certificates
            }
        });
        await transporter.sendMail({
            from: `"Support" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP code is ${otp}`,
        });
        res.status(200).json({ message: "OTP sent successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending OTP" });
    }
};
exports.forgotPassword = forgotPassword;
// 🔹 2. Verify OTP
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (otpStore[email] && otpStore[email] === otp) {
        return res.status(200).json({ message: "OTP verified", email });
    }
    else {
        return res.status(400).json({ message: "Invalid OTP" });
    }
};
exports.verifyOtp = verifyOtp;
// 🔹 3. Reset Password
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }
        // 🔥 Hash the new password before updating
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        const updatedUser = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });
        return res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) { // Explicitly declare 'error' as 'unknown'
        // 🔥 Convert 'unknown' to 'Error' type to access 'message'
        const err = error;
        return res.status(500).json({ message: "Error resetting password", error: err.message });
    }
};
exports.resetPassword = resetPassword;
