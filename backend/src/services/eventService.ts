// services/eventService.ts
import { PrismaClient } from "@prisma/client";

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

  async updateEvent(id: string, data: any) {
    return await prisma.event.update({ where: { id }, data });
  }

  async deleteEvent(id: string) {
    return await prisma.event.delete({ where: { id } });
  }
}
