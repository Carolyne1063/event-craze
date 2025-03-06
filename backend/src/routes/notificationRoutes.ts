import express from "express";
import { NotificationController } from "../controllers/notificationController";

const router = express.Router();

// Get notifications for a user
router.get("/:userId", NotificationController.getNotifications);

// Mark a notification as read
router.put("/:notificationId/read", NotificationController.markAsRead);

export default router;
