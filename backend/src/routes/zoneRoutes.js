const express = require("express");

const {
  createZone,
  getZones,
} = require("../controllers/zoneController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin only
router.post("/", protect, authorize("admin"), createZone);

// Admin and delivery agents can view zones
router.get(
  "/",
  protect,
  authorize("admin", "delivery_agent","customer"),
  getZones
);

module.exports = router;