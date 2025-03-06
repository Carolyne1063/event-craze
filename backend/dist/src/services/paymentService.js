"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// PaymentService.ts
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class PaymentService {
    static async generateToken() {
        const secret = process.env.MPESA_SECRET_KEY;
        const consumer = process.env.MPESA_CONSUMER_KEY;
        const auth = Buffer.from(`${consumer}:${secret}`).toString("base64");
        try {
            const response = await axios_1.default.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
                headers: { authorization: `Basic ${auth}` },
            });
            return response.data.access_token;
        }
        catch (error) {
            throw new Error("Error generating MPESA token");
        }
    }
    static async initiateSTKPush(phone, amount) {
        const token = await this.generateToken();
        const date = new Date();
        // Format timestamp as YYYYMMDDHHMMSS
        const timestamp = date.getFullYear().toString() +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            ("0" + date.getDate()).slice(-2) +
            ("0" + date.getHours()).slice(-2) +
            ("0" + date.getMinutes()).slice(-2) +
            ("0" + date.getSeconds()).slice(-2);
        const shortcode = process.env.MPESA_PAYBILL;
        const passkey = process.env.MPESA_PASSKEY;
        const password = Buffer.from(shortcode + passkey + timestamp).toString("base64");
        const requestData = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: `254${phone}`,
            PartyB: shortcode,
            PhoneNumber: `254${phone}`,
            CallBackURL: "https://b554-102-215-12-244.ngrok-free.app/callback", // make sure to set this in your .env
            AccountReference: `EventBooking-${phone}`,
            TransactionDesc: "Payment for event booking",
        };
        try {
            const response = await axios_1.default.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", requestData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        }
        catch (error) {
            throw new Error(error.response?.data?.errorMessage || "Error initiating MPESA STK push");
        }
    }
}
exports.default = PaymentService;
