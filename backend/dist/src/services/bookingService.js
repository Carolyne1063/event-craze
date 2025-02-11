"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
const prisma = new client_1.PrismaClient();
class BookingService {
    // Create a booking and return its details including the ticketType.
    static async createBooking(userId, eventId, ticketType, quantity) {
        try {
            // Find the ticket record matching the event and ticketType.
            const ticket = await prisma.ticket.findFirst({
                where: { eventId, type: ticketType },
            });
            if (!ticket) {
                throw new Error("Ticket type not found for this event.");
            }
            // Check ticket availability.
            if (ticket.quantity < quantity) {
                throw new Error("Not enough tickets available.");
            }
            // Calculate total price using Decimal.
            const totalPrice = new library_1.Decimal(ticket.price).mul(new library_1.Decimal(quantity));
            // Create the booking.
            // Note: The ticketType field is saved in the booking record.
            const booking = await prisma.booking.create({
                data: {
                    userId,
                    eventId,
                    ticketId: ticket.id,
                    ticketType, // This field will be stored and returned.
                    quantity,
                    totalPrice,
                },
                include: { ticket: true, event: true, user: true },
            });
            // Decrement the ticket quantity.
            await prisma.ticket.update({
                where: { id: ticket.id },
                data: { quantity: { decrement: quantity } },
            });
            return booking;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("An unknown error occurred while creating the booking.");
            }
        }
    }
    static async getBookingsByUser(userId) {
        return await prisma.booking.findMany({
            where: { userId },
            include: { event: true, ticket: true },
        });
    }
    // Retrieve a booking by its ID and include event, ticket, and user details.
    static async getBookingById(bookingId) {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { event: true, ticket: true, user: true },
        });
        if (!booking) {
            throw new Error("Booking not found.");
        }
        return booking;
    }
    static async cancelBooking(bookingId) {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
            });
            if (!booking)
                throw new Error("Booking not found");
            // Restore the ticket quantity.
            await prisma.ticket.update({
                where: { id: booking.ticketId },
                data: { quantity: { increment: booking.quantity } },
            });
            // Delete the booking.
            await prisma.booking.delete({
                where: { id: bookingId },
            });
            return { message: "Booking cancelled successfully" };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("An unknown error occurred while canceling the booking.");
            }
        }
    }
    /**
   * Update a booking by changing the ticket type and/or quantity.
   * - newTicketType is now required.
   * - If a new ticket type is provided (and it's different from the current one):
   *   1. Restore the full booked quantity to the old ticket's pool.
   *   2. Look up the new Ticket record for the event by its type.
   *   3. Verify that the new ticket has enough available tickets.
   *   4. Deduct the requested new quantity from the new ticket.
   *   5. Use the new ticket's price for recalculating the total price.
   * - Otherwise, if only the quantity changes:
   *   1. Adjust the current ticket's available quantity.
   *   2. Recalculate the total price using the current ticket's price.
   * The updated booking is returned with event, ticket, and user details.
   */
    static async updateBooking(bookingId, newQuantity, newTicketType // Now required
    ) {
        try {
            // Guard clause: Ensure newQuantity is provided and valid.
            if (newQuantity === undefined || newQuantity === null || newQuantity <= 0) {
                throw new Error("New quantity must be provided and be greater than 0.");
            }
            // Retrieve the booking with its associated ticket, event, and user details.
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                include: { ticket: true, event: true, user: true },
            });
            if (!booking)
                throw new Error("Booking not found.");
            let currentTicket = booking.ticket;
            const oldQuantity = booking.quantity;
            let updatedTicketId = currentTicket.id;
            let ticketPrice = currentTicket.price;
            // If the new ticket type is provided and different from the current ticket's type:
            if (newTicketType !== currentTicket.type) {
                // Restore the full booked quantity to the current ticket's pool.
                await prisma.ticket.update({
                    where: { id: currentTicket.id },
                    data: { quantity: { increment: oldQuantity } },
                });
                // Fetch the new Ticket record for the event using the provided newTicketType.
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
            }
            else {
                // No change in ticket type; adjust the quantity on the current ticket.
                if (newQuantity > oldQuantity) {
                    const additionalNeeded = newQuantity - oldQuantity;
                    if (currentTicket.quantity < additionalNeeded) {
                        throw new Error("Not enough additional tickets available.");
                    }
                    await prisma.ticket.update({
                        where: { id: currentTicket.id },
                        data: { quantity: { decrement: additionalNeeded } },
                    });
                }
                else if (newQuantity < oldQuantity) {
                    const reduction = oldQuantity - newQuantity;
                    await prisma.ticket.update({
                        where: { id: currentTicket.id },
                        data: { quantity: { increment: reduction } },
                    });
                }
            }
            // Recalculate total price based on the (possibly updated) ticket price and new quantity.
            const newTotalPrice = new library_1.Decimal(ticketPrice).mul(new library_1.Decimal(newQuantity));
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
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            else {
                throw new Error("An unknown error occurred while updating the booking.");
            }
        }
    }
    static async getBookingsByEvent(eventId) {
        return await prisma.booking.findMany({
            where: { eventId },
            include: { event: true, ticket: true, user: true },
        });
    }
}
exports.default = BookingService;
