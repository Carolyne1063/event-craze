"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.NotificationService = {
    // Create a new notification
    async createNotification(userId, eventId, message) {
        return await prisma.notification.create({
            data: { userId, eventId, message },
        });
    },
    // Get all notifications for a user
    async getNotifications(userId) {
        return await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    },
    // Mark notification as read
    async markAsRead(notificationId) {
        return await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    },
};
