"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
// services/eventService.ts
const client_1 = require("@prisma/client");
const notificationService_1 = require("./notificationService");
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
    async updateEvent(eventId, newDetails) {
        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: newDetails,
        });
        // Fetch all users who booked this event
        const bookings = await prisma.booking.findMany({ where: { eventId } });
        // Send notification to each user
        for (const booking of bookings) {
            await notificationService_1.NotificationService.createNotification(booking.userId, eventId, `The event '${updatedEvent.eventName}' has been updated. Please check details.`);
        }
        return updatedEvent;
    }
    async deleteEvent(id) {
        return await prisma.event.delete({ where: { id } });
    }
}
exports.EventService = EventService;
