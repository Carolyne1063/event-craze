import { Request, Response } from "express";
import BookingService from "../services/bookingService";

class BookingController {
  static async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const { userId, eventId, ticketType, quantity } = req.body;
      const booking = await BookingService.createBooking(userId, eventId, ticketType, quantity);
      res.status(201).json(booking);
      return;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      res.status(400).json({ message: errorMessage });
      return;
    }
  }

  static async getBookingsByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const bookings = await BookingService.getBookingsByUser(userId);
      res.status(200).json(bookings);
      return;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      res.status(400).json({ message: errorMessage });
      return;
    }
  }

  static async getBookingById(req: Request, res: Response) {
    try {
      const { bookingId } = req.params;
      const booking = await BookingService.getBookingById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.status(200).json(booking);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      res.status(400).json({ message: errorMessage });
    }
  }
  

  static async cancelBooking(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const response = await BookingService.cancelBooking(bookingId);
      res.status(200).json(response);
      return;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      res.status(400).json({ message: errorMessage });
      return;
    }
  }


  static async updateBooking(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const { newQuantity } = req.body;
      const {newTicketType} = req.body;
      const updatedBooking = await BookingService.updateBooking(bookingId,  newQuantity, newTicketType);
      res.status(200).json(updatedBooking);
      return;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      res.status(400).json({ message: errorMessage });
      return;
    }
  }

 
  static async getBookingsByEvent(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const bookings = await BookingService.getBookingsByEvent(eventId);
      res.status(200).json(bookings);
      return;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      res.status(400).json({ message: errorMessage });
      return;
    }
  }
}

export default BookingController;
