import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create a ticket for an event (Admin only)
 */
export const createTicket = async (eventId: string, type: string, quantity: number, price: number) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new Error("Event not found.");

  return prisma.ticket.create({
    data: { type, quantity, price, eventId },
  });
};

/**
 * Update a ticket (Admin only)
 */
export const updateTicket = async (ticketId: string, updates: { type?: string; quantity?: number; price?: number }) => {
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw new Error("Ticket not found.");

  return prisma.ticket.update({
    where: { id: ticketId },
    data: updates,
  });
};

/**
 * Delete a ticket (Admin only)
 */
export const deleteTicket = async (ticketId: string) => {
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw new Error("Ticket not found.");

  return prisma.ticket.delete({ where: { id: ticketId } });
};

/**
 * Fetch all tickets
 */
export const getAllTickets = async () => {
  return prisma.ticket.findMany();
};

/**
 * Fetch tickets for a specific event
 */
export const getTicketsByEvent = async (eventId: string) => {
  return prisma.ticket.findMany({ where: { eventId } });
};

/**
 * Fetch a single ticket by ID
 */
export const getTicketById = async (ticketId: string) => {
  return prisma.ticket.findUnique({ where: { id: ticketId } });
};
