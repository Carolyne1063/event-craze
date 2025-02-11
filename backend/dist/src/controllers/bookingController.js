"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookingService_1 = __importDefault(require("../services/bookingService"));
class BookingController {
    static async createBooking(req, res) {
        try {
            const { userId, eventId, ticketType, quantity } = req.body;
            const booking = await bookingService_1.default.createBooking(userId, eventId, ticketType, quantity);
            res.status(201).json(booking);
            return;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            res.status(400).json({ message: errorMessage });
            return;
        }
    }
    static async getBookingsByUser(req, res) {
        try {
            const { userId } = req.params;
            const bookings = await bookingService_1.default.getBookingsByUser(userId);
            res.status(200).json(bookings);
            return;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            res.status(400).json({ message: errorMessage });
            return;
        }
    }
    static async getBookingById(req, res) {
        try {
            const { bookingId } = req.params;
            const booking = await bookingService_1.default.getBookingById(bookingId);
            if (!booking) {
                res.status(404).json({ message: "Booking not found" });
                return;
            }
            res.status(200).json(booking);
            return;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            res.status(400).json({ message: errorMessage });
            return;
        }
    }
    static async cancelBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const response = await bookingService_1.default.cancelBooking(bookingId);
            res.status(200).json(response);
            return;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            res.status(400).json({ message: errorMessage });
            return;
        }
    }
    /**
     * Update a booking by changing the ticket quantity.
     * Expects a `newQuantity` value in the request body.
     */
    static async updateBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const { newQuantity } = req.body;
            const updatedBooking = await bookingService_1.default.updateBooking(bookingId, newQuantity);
            res.status(200).json(updatedBooking);
            return;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            res.status(400).json({ message: errorMessage });
            return;
        }
    }
    /**
     * Retrieve all bookings for a specific event.
     */
    static async getBookingsByEvent(req, res) {
        try {
            const { eventId } = req.params;
            const bookings = await bookingService_1.default.getBookingsByEvent(eventId);
            res.status(200).json(bookings);
            return;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            res.status(400).json({ message: errorMessage });
            return;
        }
    }
}
exports.default = BookingController;
