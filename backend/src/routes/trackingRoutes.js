const express = require("express");

const router = express.Router();

const {
  getTrackingHistory,
  addTrackingHistory,
} = require("../controllers/trackingController");

const authMiddleware = require("../middleware/authMiddleware");

// Get tracking history
router.get(
  "/:orderId",
  authMiddleware,
  getTrackingHistory
);

// Add tracking history
router.post(
  "/:orderId",
  authMiddleware,
  addTrackingHistory
);

module.exports = router;