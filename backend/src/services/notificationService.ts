import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const NotificationService = {
  // Create a new notification
  async createNotification(userId: string, eventId: string, message: string) {
    return await prisma.notification.create({
      data: { userId, eventId, message },
    });
  },

  // Get all notifications for a user
  async getNotifications(userId: string) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  },
};
