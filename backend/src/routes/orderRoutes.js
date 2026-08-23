const express = require("express");

const {
  createOrder,
  getOrders,
  getOrderById,
  assignDeliveryAgent,
  updateOrderStatus,
  getTrackingHistory,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("customer"),
  createOrder
);

router.get(
  "/",
  protect,
  authorize("admin", "customer", "delivery_agent"),
  getOrders
);

router.get(
  "/:id",
  protect,
  authorize("admin", "customer", "delivery_agent"),
  getOrderById
);

router.patch(
  "/:id/assign",
  protect,
  authorize("admin"),
  assignDeliveryAgent
);

router.patch(
  "/:id/status",
  protect,
  authorize("delivery_agent"),
  updateOrderStatus
);

router.get(
  "/:id/tracking",
  protect,
  authorize("admin", "customer", "delivery_agent"),
  getTrackingHistory
);

module.exports = router;