"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ticketController_1 = require("../controllers/ticketController");
const router = express_1.default.Router();
router.post("/create", ticketController_1.createTicketController);
router.put("/update/:ticketId", ticketController_1.updateTicketController);
router.delete("/delete/:ticketId", ticketController_1.deleteTicketController);
router.get("/all", ticketController_1.getAllTicketsController);
router.get("/event/:eventId", ticketController_1.getTicketsByEventController);
router.get("/:ticketId", ticketController_1.getTicketByIdController);
exports.default = router;
