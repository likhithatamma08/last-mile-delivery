const express = require("express");

const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user's notifications
router.get("/", protect, getNotifications);

// Mark notification as read
router.patch("/:id/read", protect, markAsRead);

module.exports = router;