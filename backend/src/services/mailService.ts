import nodemailer from "nodemailer";

class MailService {
  private transporter;

  constructor() {
    // Create a transporter object using SMTP transport.
    this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, 
        port: Number(process.env.SMTP_PORT), 
        secure: process.env.SMTP_SECURE === "true", 
        auth: {
          user: process.env.SMTP_USER, 
          pass: process.env.SMTP_PASS, 
        },
        tls: {
          // This option allows self-signed certificates (for development only!)
          rejectUnauthorized: false,
        },
      });
      
  }

  // Generic method to send an email.
  async sendMail(to: string, subject: string, text: string, html?: string) {
    const info = await this.transporter.sendMail({
      from: process.env.SMTP_FROM, 
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  }

  // Send a welcome email upon user registration.
  async sendWelcomeEmail(email: string, firstName: string) {
    const subject = "Welcome to EventCraze!";
    const text = `Hi ${firstName},\n\nThank you for registering with EventCraze! We are excited to have you on board.`;
    const html = `<p>Hi ${firstName},</p><p>Thank you for registering with EventCraze! We are excited to have you on board.</p>`;
    return this.sendMail(email, subject, text, html);
  }

  // Send a booking confirmation email.
  async sendBookingConfirmation(email: string, bookingDetails: any) {
    const subject = "Booking Confirmed - EventCraze";
    const text = `Your booking for the event "${bookingDetails.event.eventName}" has been confirmed.\nBooking details: ${JSON.stringify(bookingDetails, null, 2)}`;
    const html = `<p>Your booking for the event "<strong>${bookingDetails.event.eventName}</strong>" has been confirmed.</p>
                  <p>Booking details:</p>
                  <pre>${JSON.stringify(bookingDetails, null, 2)}</pre>`;
    return this.sendMail(email, subject, text, html);
  }

  // Send a cancellation email.
  async sendCancellationEmail(email: string, bookingDetails: any) {
    const subject = "Booking Cancelled - EventCraze";
    const text = `Your booking for the event "${bookingDetails.event.eventName}" has been cancelled.`;
    const html = `<p>Your booking for the event "<strong>${bookingDetails.event.eventName}</strong>" has been cancelled.</p>`;
    return this.sendMail(email, subject, text, html);
  }

// Send a booking update email.
async sendBookingUpdatedEmail(email: string, bookingDetails: any) {
  const subject = "Booking Updated - EventCraze";
  const text = `Your booking has been updated.\nBooking details: ${JSON.stringify(bookingDetails, null, 2)}`;
  const html = `<p>Your booking has been updated.</p>
                <p>Booking details:</p>
                <pre>${JSON.stringify(bookingDetails, null, 2)}</pre>`;
  return this.sendMail(email, subject, text, html);
}

}

export default new MailService();
