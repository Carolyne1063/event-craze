import express from "express";
import BookingController from "../controllers/bookingController";

const router = express.Router();

// 📌 Create a Booking
router.post("/create", BookingController.createBooking);

// 📌 Get All Bookings for a User
router.get("/:userId", BookingController.getBookingsByUser);

// 📌 Get a Single Booking by ID
router.get("/:bookingId", BookingController.getBookingById);

// 📌 Cancel a Booking
router.delete("/:bookingId", BookingController.cancelBooking);

// Update a booking (change ticket quantity)
router.put("/update/:bookingId", BookingController.updateBooking);

// Get all bookings for a specific event
router.get("/event/:eventId", BookingController.getBookingsByEvent);

export default router;
