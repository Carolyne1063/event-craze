"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = __importDefault(require("../controllers/bookingController"));
const router = express_1.default.Router();
// 📌 Create a Booking
router.post("/create", bookingController_1.default.createBooking);
// 📌 Get All Bookings for a User
router.get("/:userId", bookingController_1.default.getBookingsByUser);
// 📌 Get a Single Booking by ID
router.get("/:bookingId", bookingController_1.default.getBookingById);
// 📌 Cancel a Booking
router.delete("/:bookingId", bookingController_1.default.cancelBooking);
// Update a booking (change ticket quantity)
router.put("/update/:bookingId", bookingController_1.default.updateBooking);
// Get all bookings for a specific event
router.get("/event/:eventId", bookingController_1.default.getBookingsByEvent);
exports.default = router;
