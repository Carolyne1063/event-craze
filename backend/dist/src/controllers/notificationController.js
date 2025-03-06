"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notificationService_1 = require("../services/notificationService");
exports.NotificationController = {
    // Get notifications for a user
    async getNotifications(req, res) {
        try {
            const { userId } = req.params;
            const notifications = await notificationService_1.NotificationService.getNotifications(userId);
            res.json(notifications);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch notifications" });
        }
    },
    // Mark a notification as read
    async markAsRead(req, res) {
        try {
            const { notificationId } = req.params;
            await notificationService_1.NotificationService.markAsRead(notificationId);
            res.json({ message: "Notification marked as read" });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to update notification" });
        }
    },
};
