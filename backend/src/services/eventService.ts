import { PrismaClient } from "@prisma/client";
import { NotificationService } from "./notificationService";

const prisma = new PrismaClient();

export class EventService {
  async createEvent(data: any) {
    return await prisma.event.create({ data });
  }

  async getAllEvents() {
    return await prisma.event.findMany({ include: { tickets: true, bookings: true, reviews: true } });
  }

  async getEventById(id: string) {
    return await prisma.event.findUnique({ where: { id }, include: { tickets: true, bookings: true, reviews: true } });
  }

  async updateEvent(eventId: string, newDetails: any) {
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: newDetails,
    });
  
    // Fetch all users who booked this event
    const bookings = await prisma.booking.findMany({ where: { eventId } });
  
    // Send notification to each user
    for (const booking of bookings) {
      await NotificationService.createNotification(
        booking.userId,
        eventId,
        `The event '${updatedEvent.eventName}' has been updated. Please check details.`
      );
    }
  
    return updatedEvent;
  }  

  async deleteEvent(id: string) {
    return await prisma.event.delete({ where: { id } });
  }
}
