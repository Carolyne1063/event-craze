import express from "express";
import {
  createTicketController,
  updateTicketController,
  deleteTicketController,
  getAllTicketsController,
  getTicketsByEventController,
  getTicketByIdController,
} from "../controllers/ticketController";

const router = express.Router();

router.post("/create", createTicketController);
router.put("/update/:ticketId", updateTicketController);
router.delete("/delete/:ticketId", deleteTicketController);
router.get("/all", getAllTicketsController);
router.get("/event/:eventId", getTicketsByEventController);
router.get("/:ticketId", getTicketByIdController);

export default router;
