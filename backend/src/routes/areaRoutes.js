const express = require("express");

const {
  createArea,
  getAreas,
  getAreaById,
  updateArea,
  deleteArea,
} = require("../controllers/areaController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin creates area
router.post(
  "/",
  protect,
  authorize("admin"),
  createArea
);

// Admin and delivery agent can view areas
router.get(
  "/",
  protect,
  authorize("admin", "delivery_agent", "customer"),
  getAreas
);

// Get single area
router.get(
  "/:id",
  protect,
  authorize("admin", "delivery_agent"),
  getAreaById
);

// Admin updates area
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateArea
);

// Admin deletes area
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteArea
);

module.exports = router;