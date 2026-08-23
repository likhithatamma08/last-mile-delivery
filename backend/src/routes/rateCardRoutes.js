const express = require("express");

const {
  createRateCard,
  getRateCards,
  updateRateCard,
  deleteRateCard,
} = require("../controllers/rateCardController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// =====================================================
// ADMIN - CREATE
// =====================================================

router.post(
  "/",
  protect,
  authorize("admin"),
  createRateCard
);

// =====================================================
// ADMIN + DELIVERY AGENT - VIEW
// =====================================================

router.get(
  "/",
  protect,
  authorize("admin", "delivery_agent"),
  getRateCards
);

// =====================================================
// ADMIN - UPDATE
// =====================================================

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateRateCard
);

// =====================================================
// ADMIN - DELETE
// =====================================================

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteRateCard
);

module.exports = router;