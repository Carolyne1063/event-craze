import express from "express";
import asyncHandler from "express-async-handler";
import { EventController } from "../controllers/eventController";

const router = express.Router();
const eventController = new EventController(); 

router.post("/create", asyncHandler(eventController.createEvent.bind(eventController)));
router.get("/:id", asyncHandler(eventController.getEventById.bind(eventController)));
router.get("/", asyncHandler(eventController.getAllEvents.bind(eventController)));
router.put("/:id", asyncHandler(eventController.updateEvent.bind(eventController)));
router.delete("/:id", asyncHandler(eventController.deleteEvent.bind(eventController)));

export default router;
