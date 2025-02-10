"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
// services/eventService.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class EventService {
    async createEvent(data) {
        return await prisma.event.create({ data });
    }
    async getAllEvents() {
        return await prisma.event.findMany({ include: { tickets: true, bookings: true, reviews: true } });
    }
    async getEventById(id) {
        return await prisma.event.findUnique({ where: { id }, include: { tickets: true, bookings: true, reviews: true } });
    }
    async updateEvent(id, data) {
        return await prisma.event.update({ where: { id }, data });
    }
    async deleteEvent(id) {
        return await prisma.event.delete({ where: { id } });
    }
}
exports.EventService = EventService;
