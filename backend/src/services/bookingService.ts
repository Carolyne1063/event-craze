import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import MailService from "./mailService"; 
import PaymentService from "./paymentService";

const prisma = new PrismaClient();

class BookingService {
  static async createBooking(
    userId: string,
    eventId: string,
    ticketType: string,
    quantity: number
  ) {
    try {
      // Find the ticket type for the event
      const ticket = await prisma.ticket.findFirst({
        where: { eventId, type: ticketType },
      });
      if (!ticket) throw new Error("Ticket type not found for this event.");
      if (ticket.quantity < quantity) throw new Error("Not enough tickets available.");

      // Calculate the total price using Decimal arithmetic
      const totalPrice = new Decimal(ticket.price).mul(new Decimal(quantity));

      // Create the booking and include related user, event, and ticket details
      const booking = await prisma.booking.create({
        data: {
          userId,
          eventId,
          ticketId: ticket.id,
          ticketType, // store ticket type in booking
          quantity,
          totalPrice,
        },
        include: { ticket: true, event: true, user: true },
      });

      // Deduct the booked tickets from the available quantity
      await prisma.ticket.update({
        where: { id: ticket.id },
        data: { quantity: { decrement: quantity } },
      });

      // Send confirmation email to the user
      await MailService.sendBookingConfirmation(booking.user.email, booking);

      // Initiate the MPESA payment if the user has a phone number
      if (booking.user.phoneNo) {
        try {
          const paymentResponse = await PaymentService.initiateSTKPush(
            booking.user.phoneNo,
            Number(booking.totalPrice)
          );
          console.log("MPESA payment initiated:", paymentResponse);
        } catch (paymentError: any) {
          console.error("Error initiating MPESA payment:", paymentError.message);
        }
      } else {
        console.warn("User phone number not available for MPESA payment.");
      }

      return booking;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error("An unknown error occurred while creating the booking.");
    }
  }

  static async getBookingsByUser(userId: string) {
    return await prisma.booking.findMany({
      where: { userId },
      include: { event: true, ticket: true },
    });
  }

  static async getBookingById(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { event: true, ticket: true, user: true },
    });
    if (!booking) {
      throw new Error("Booking not found.");
    }
    return booking;
  }

  static async cancelBooking(bookingId: string) {
    try {
      // Retrieve booking details including user and event before cancellation.
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { user: true, event: true },
      });
      if (!booking) throw new Error("Booking not found");

      // Restore ticket quantity.
      await prisma.ticket.update({
        where: { id: booking.ticketId },
        data: { quantity: { increment: booking.quantity } },
      });

      // Send cancellation email before deleting the booking.
      await MailService.sendCancellationEmail(booking.user.email, booking);

      // Delete booking.
      await prisma.booking.delete({
        where: { id: bookingId },
      });

      return { message: "Booking cancelled successfully" };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred while canceling the booking.");
      }
    }
  }

  static async updateBooking(
    bookingId: string,
    newQuantity: number,
    newTicketType?: string
  ) {
    try {
      if (newQuantity === undefined || newQuantity === null || newQuantity <= 0) {
        throw new Error("New quantity must be greater than 0.");
      }
  
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { ticket: true, event: true, user: true },
      });
      if (!booking) throw new Error("Booking not found.");
  
      let currentTicket = booking.ticket;
      const oldQuantity = booking.quantity;
      let updatedTicketId = currentTicket.id;
      let ticketPrice = currentTicket.price;
      let newTotalPrice: Decimal;
  
      // Handle ticket type change
      if (newTicketType && newTicketType !== currentTicket.type) {
        // Restore old ticket stock
        await prisma.ticket.update({
          where: { id: currentTicket.id },
          data: { quantity: { increment: oldQuantity } },
        });
  
        // Fetch new ticket details
        const newTicket = await prisma.ticket.findFirst({
          where: { eventId: booking.eventId, type: newTicketType },
        });
        if (!newTicket) throw new Error("New ticket type not found.");
  
        if (newTicket.quantity < newQuantity) {
          throw new Error("Not enough tickets available for the new type.");
        }
  
        // Deduct new ticket quantity
        await prisma.ticket.update({
          where: { id: newTicket.id },
          data: { quantity: { decrement: newQuantity } },
        });
  
        updatedTicketId = newTicket.id;
        ticketPrice = newTicket.price;
      } else {
        // Adjust only quantity for the same ticket type
        if (newQuantity > oldQuantity) {
          const additionalNeeded = newQuantity - oldQuantity;
          if (currentTicket.quantity < additionalNeeded) {
            throw new Error("Not enough additional tickets available.");
          }
          await prisma.ticket.update({
            where: { id: currentTicket.id },
            data: { quantity: { decrement: additionalNeeded } },
          });
        } else if (newQuantity < oldQuantity) {
          const reduction = oldQuantity - newQuantity;
          await prisma.ticket.update({
            where: { id: currentTicket.id },
            data: { quantity: { increment: reduction } },
          });
        }
      }
  
      // Calculate new total price
      newTotalPrice = new Decimal(ticketPrice).mul(new Decimal(newQuantity));
  
      // Compare old and new price
      const priceDifference = newTotalPrice.sub(booking.totalPrice);
  
      if (priceDifference.gt(0)) {
        // User needs to pay more
        try {
          const paymentResponse = await PaymentService.initiateSTKPush(
            booking.user.phoneNo,
            Number(priceDifference)
          );
          console.log("MPESA additional payment initiated:", paymentResponse);
        } catch (paymentError: any) {
          console.error("Error initiating MPESA payment:", paymentError.message);
          throw new Error("Payment failed. Booking update cannot proceed.");
        }
      } else if (priceDifference.lt(0)) {
        // Optional: Handle refunds if necessary
        console.warn("Price reduced. Consider issuing a refund.");
      }
  
      // Update booking details in the database
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          ticketId: updatedTicketId,
          ticketType: newTicketType || booking.ticketType,
          quantity: newQuantity,
          totalPrice: newTotalPrice,
        },
        include: { event: true, ticket: true, user: true },
      });

      await MailService.sendBookingUpdatedEmail(updatedBooking.user.email, updatedBooking);
      return updatedBooking;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      else throw new Error("An error occurred while updating the booking.");
    }
  }
  

  static async getBookingsByEvent(eventId: string) {
    return await prisma.booking.findMany({
      where: { eventId },
      include: { event: true, ticket: true, user: true },
    });
  }
}

export default BookingService;