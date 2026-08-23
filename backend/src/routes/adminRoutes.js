const express = require("express");

const router = express.Router();

const {
  getDashboard,
  getAllOrders,
  getAdminOrderById,
  getDeliveryAgents,
  getCustomers,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getDashboard
);

// =====================================================
// ALL ORDERS
// =====================================================

router.get(
  "/orders",
  protect,
  authorize("admin"),
  getAllOrders
);

// =====================================================
// SINGLE ORDER
// =====================================================

router.get(
  "/orders/:id",
  protect,
  authorize("admin"),
  getAdminOrderById
);

// =====================================================
// DELIVERY AGENTS
// =====================================================

router.get(
  "/delivery-agents",
  protect,
  authorize("admin"),
  getDeliveryAgents
);

// =====================================================
// CUSTOMERS
// =====================================================

router.get(
  "/customers",
  protect,
  authorize("admin"),
  getCustomers
);

module.exports = router;