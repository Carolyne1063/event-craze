import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

class BookingService {
  static async createBooking(
    userId: string,
    eventId: string,
    ticketType: string,
    quantity: number
  ) {
    try {
      // Find the event and ticket type
      const ticket = await prisma.ticket.findFirst({
        where: { eventId, type: ticketType },
      });

      if (!ticket) {
        throw new Error("Ticket type not found for this event.");
      }

      // Check if enough tickets are available
      if (ticket.quantity < quantity) {
        throw new Error("Not enough tickets available.");
      }

      // Calculate total price using Decimal
      const totalPrice = new Decimal(ticket.price).mul(new Decimal(quantity));

      // Create booking and include related ticket, event, and user details
      const booking = await prisma.booking.create({
        data: {
          userId,
          eventId,
          ticketId: ticket.id,
          quantity,
          totalPrice,
        },
        include: { ticket: true, event: true, user: true },
      });

      // Update ticket quantity (decrement the available amount)
      await prisma.ticket.update({
        where: { id: ticket.id },
        data: { quantity: { decrement: quantity } },
      });

      return booking;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred while creating the booking.");
      }
    }
  }

  static async getBookingsByUser(userId: string) {
    return await prisma.booking.findMany({
      where: { userId },
      include: { event: true, ticket: true },
    });
  }

  // Updated getBookingById to include event, ticket, and user details
  static async getBookingById(bookingId: string) {
    return await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { event: true, ticket: true, user: true },
    });
  }

  static async cancelBooking(bookingId: string) {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) throw new Error("Booking not found");

      // Restore ticket quantity by incrementing with the booking quantity
      await prisma.ticket.update({
        where: { id: booking.ticketId },
        data: { quantity: { increment: booking.quantity } },
      });

      // Delete booking
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

  /**
   * Update a booking by changing the ticket type and/or the ticket quantity.
   * - If a new ticket type is provided (and it's different from the current one):
   *   1. Restore the full booked quantity to the old ticket's pool.
   *   2. Find the new ticket for the event with the provided type.
   *   3. Verify that the new ticket has enough available quantity.
   *   4. Deduct the requested new quantity from the new ticket.
   *   5. Use the new ticket's price for recalculating the total price.
   * - Otherwise, if only the quantity changes:
   *   1. Adjust the current ticket's available quantity.
   *   2. Recalculate the total price using the current ticket's price.
   * The updated booking is then returned with event, ticket, and user details.
   */
  static async updateBooking(
    bookingId: string,
    newQuantity: number,
    newTicketType?: string
  ) {
    try {
      // Guard clause: Ensure newQuantity is provided and valid.
      if (newQuantity === undefined || newQuantity === null || newQuantity <= 0) {
        throw new Error("New quantity must be provided and be greater than 0.");
      }
  
      // Retrieve the booking with associated ticket, event, and user details.
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { ticket: true, event: true, user: true },
      });
      if (!booking) throw new Error("Booking not found.");
  
      let currentTicket = booking.ticket;
      const oldQuantity = booking.quantity;
      let updatedTicketId = currentTicket.id;
      let ticketPrice = currentTicket.price;
  
      // If a new ticket type is provided:
      if (newTicketType) {
        // If the new ticket type is different from the current ticket's type, restore old quantity.
        if (newTicketType !== currentTicket.type) {
          await prisma.ticket.update({
            where: { id: currentTicket.id },
            data: { quantity: { increment: oldQuantity } },
          });
        }
  
        // Force re-fetch the new ticket record using the provided newTicketType.
        const newTicket = await prisma.ticket.findFirst({
          where: { eventId: booking.eventId, type: newTicketType },
        });
        if (!newTicket) {
          throw new Error("New ticket type not found for this event.");
        }
        // Check if enough tickets are available in the new ticket record.
        if (newTicket.quantity < newQuantity) {
          throw new Error("Not enough tickets available for the new ticket type.");
        }
        // Deduct the requested quantity from the new ticket.
        await prisma.ticket.update({
          where: { id: newTicket.id },
          data: { quantity: { decrement: newQuantity } },
        });
        // Update references to use the new ticket.
        updatedTicketId = newTicket.id;
        ticketPrice = newTicket.price;
      } else {
        // No new ticket type provided; adjust the quantity on the current ticket.
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
  
      // Recalculate total price based on the (possibly updated) ticket price and new quantity.
      const newTotalPrice = new Decimal(ticketPrice).mul(new Decimal(newQuantity));
  
      // Update the booking record with the new ticket reference (if changed), new quantity, and total price.
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          ticketId: updatedTicketId,
          quantity: newQuantity,
          totalPrice: newTotalPrice,
        },
        include: { event: true, ticket: true, user: true },
      });
  
      return updatedBooking;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred while updating the booking.");
      }
    }
  }
  

  /**
   * Retrieve all bookings for a specific event.
   */
  static async getBookingsByEvent(eventId: string) {
    return await prisma.booking.findMany({
      where: { eventId },
      include: { event: true, ticket: true, user: true },
    });
  }
}

export default BookingService;
