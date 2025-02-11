"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketByIdController = exports.getTicketsByEventController = exports.getAllTicketsController = exports.deleteTicketController = exports.updateTicketController = exports.createTicketController = void 0;
const ticketService_1 = require("../services/ticketService");
/**
 * Create Ticket
 */
const createTicketController = async (req, res) => {
    try {
        const { eventId, type, quantity, price } = req.body;
        const ticket = await (0, ticketService_1.createTicket)(eventId, type, quantity, price);
        res.status(201).json(ticket);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createTicketController = createTicketController;
/**
 * Update Ticket
 */
const updateTicketController = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const updates = req.body;
        const ticket = await (0, ticketService_1.updateTicket)(ticketId, updates);
        res.status(200).json(ticket);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateTicketController = updateTicketController;
/**
 * Delete Ticket
 */
const deleteTicketController = async (req, res) => {
    try {
        const { ticketId } = req.params;
        await (0, ticketService_1.deleteTicket)(ticketId);
        res.status(200).json({ message: "Ticket deleted successfully." });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.deleteTicketController = deleteTicketController;
/**
 * Get All Tickets
 */
const getAllTicketsController = async (req, res) => {
    try {
        const tickets = await (0, ticketService_1.getAllTickets)();
        res.status(200).json(tickets);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getAllTicketsController = getAllTicketsController;
/**
 * Get Tickets for a Specific Event
 */
const getTicketsByEventController = async (req, res) => {
    try {
        const { eventId } = req.params;
        const tickets = await (0, ticketService_1.getTicketsByEvent)(eventId);
        res.status(200).json(tickets);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getTicketsByEventController = getTicketsByEventController;
const getTicketByIdController = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = await (0, ticketService_1.getTicketById)(ticketId);
        if (!ticket) {
            res.status(404).json({ message: "Ticket not found." });
            return;
        }
        res.status(200).json(ticket);
        return;
    }
    catch (error) {
        res.status(400).json({ message: error.message });
        return;
    }
};
exports.getTicketByIdController = getTicketByIdController;
