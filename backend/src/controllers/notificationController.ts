import { Request, Response } from "express";
import { NotificationService } from "../services/notificationService";

export const NotificationController = {
  async getNotifications(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const notifications = await NotificationService.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  },

  async markAsRead(req: Request, res: Response) {
    try {
      const { notificationId } = req.params;
      await NotificationService.markAsRead(notificationId);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update notification" });
    }
  },
};
