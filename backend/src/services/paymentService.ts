import axios from 'axios';
import { config } from 'dotenv';
config();

class PaymentService {
  static async generateToken(): Promise<string> {
    const secret = process.env.MPESA_SECRET_KEY;
    const consumer = process.env.MPESA_CONSUMER_KEY;
    const auth = Buffer.from(`${consumer}:${secret}`).toString("base64");

    try {
      const response = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
          headers: { authorization: `Basic ${auth}` },
        }
      );
      return response.data.access_token;
    } catch (error) {
      throw new Error("Error generating MPESA token");
    }
  }

  static async initiateSTKPush(phone: string, amount: number): Promise<any> {
    const token = await this.generateToken();

    const date = new Date();
    // Format timestamp as YYYYMMDDHHMMSS
    const timestamp =
      date.getFullYear().toString() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const shortcode = process.env.MPESA_PAYBILL!;
    const passkey = process.env.MPESA_PASSKEY!;
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
      CallBackURL: "https://b554-102-215-12-244.ngrok-free.app/callback", 
      AccountReference: `EventBooking-${phone}`,
      TransactionDesc: "Payment for event booking",
    };

    try {
      const response = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.errorMessage || "Error initiating MPESA STK push"
      );
    }
  }
}

export default PaymentService;