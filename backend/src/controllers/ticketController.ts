import { Request, Response } from "express";
import {
  createTicket,
  updateTicket,
  deleteTicket,
  getAllTickets,
  getTicketsByEvent,
  getTicketById,
} from "../services/ticketService";

/**
 * Create Ticket
 */
export const createTicketController = async (req: Request, res: Response) => {
  try {
    const { eventId, type, quantity, price } = req.body;
    const ticket = await createTicket(eventId, type, quantity, price);
    res.status(201).json(ticket);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Update Ticket
 */
export const updateTicketController = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const updates = req.body;
    const ticket = await updateTicket(ticketId, updates);
    res.status(200).json(ticket);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Delete Ticket
 */
export const deleteTicketController = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    await deleteTicket(ticketId);
    res.status(200).json({ message: "Ticket deleted successfully." });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get All Tickets
 */
export const getAllTicketsController = async (req: Request, res: Response) => {
  try {
    const tickets = await getAllTickets();
    res.status(200).json(tickets);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get Tickets for a Specific Event
 */
export const getTicketsByEventController = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const tickets = await getTicketsByEvent(eventId);
    res.status(200).json(tickets);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const getTicketByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    const ticket = await getTicketById(ticketId);
    if (!ticket) {
      res.status(404).json({ message: "Ticket not found." });
      return;
    }
    res.status(200).json(ticket);
    return;
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    return;
  }
};

