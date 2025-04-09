import { PrismaClient } from "@prisma/client";
import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient(); 
let otpStore: { [email: string]: string } = {}; 

// 🔹 1. Forgot Password - Generate OTP
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
        otpStore[email] = otp;

        // Send OTP via Email
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false,  // 🔹 Allows self-signed certificates
            }
        });

        await transporter.sendMail({
            from: `"Support" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP code is ${otp}`,
        });

        res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending OTP" });
    }
};

// 🔹 2. Verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    if (otpStore[email] && otpStore[email] === otp) {
        return res.status(200).json({ message: "OTP verified", email });
    } else {
        return res.status(400).json({ message: "Invalid OTP" });
    }
};

// 🔹 3. Reset Password

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        // 🔥 Hash the new password before updating
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        return res.status(200).json({ message: "Password reset successful" });
    } catch (error: unknown) {  
        const err = error as Error;
        return res.status(500).json({ message: "Error resetting password", error: err.message });
    }
};



