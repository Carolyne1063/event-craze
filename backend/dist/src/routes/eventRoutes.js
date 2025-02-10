"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const eventController_1 = require("../controllers/eventController");
const router = express_1.default.Router();
const eventController = new eventController_1.EventController(); // ✅ Instantiate the class
router.post("/create", (0, express_async_handler_1.default)(eventController.createEvent.bind(eventController)));
router.get("/:id", (0, express_async_handler_1.default)(eventController.getEventById.bind(eventController)));
router.get("/", (0, express_async_handler_1.default)(eventController.getAllEvents.bind(eventController)));
router.put("/:id", (0, express_async_handler_1.default)(eventController.updateEvent.bind(eventController)));
router.delete("/:id", (0, express_async_handler_1.default)(eventController.deleteEvent.bind(eventController)));
exports.default = router;
