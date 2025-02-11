"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./src/routes/userRoutes"));
// ✅ Corrected path
const dotenv_1 = __importDefault(require("dotenv"));
const eventRoutes_1 = __importDefault(require("./src/routes/eventRoutes"));
const bookingRoutes_1 = __importDefault(require("./src/routes/bookingRoutes"));
const ticketRoutes_1 = __importDefault(require("./src/routes/ticketRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Use the routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/events', eventRoutes_1.default);
app.use("/api/bookings", bookingRoutes_1.default);
app.use("/api/tickets", ticketRoutes_1.default);
app.listen(3000, () => console.log('Server running on port 3000'));
