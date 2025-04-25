"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketById = exports.getTicketsByEvent = exports.getAllTickets = exports.deleteTicket = exports.updateTicket = exports.createTicket = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createTicket = async (eventId, type, quantity, price) => {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event)
        throw new Error("Event not found.");
    return prisma.ticket.create({
        data: { type, quantity, price, eventId },
    });
};
exports.createTicket = createTicket;
const updateTicket = async (ticketId, updates) => {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket)
        throw new Error("Ticket not found.");
    return prisma.ticket.update({
        where: { id: ticketId },
        data: updates,
    });
};
exports.updateTicket = updateTicket;
const deleteTicket = async (ticketId) => {
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!ticket)
        throw new Error("Ticket not found.");
    return prisma.ticket.delete({ where: { id: ticketId } });
};
exports.deleteTicket = deleteTicket;
const getAllTickets = async () => {
    return prisma.ticket.findMany();
};
exports.getAllTickets = getAllTickets;
const getTicketsByEvent = async (eventId) => {
    return prisma.ticket.findMany({ where: { eventId } });
};
exports.getTicketsByEvent = getTicketsByEvent;
const getTicketById = async (ticketId) => {
    return prisma.ticket.findUnique({ where: { id: ticketId } });
};
exports.getTicketById = getTicketById;
