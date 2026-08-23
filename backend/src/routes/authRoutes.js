const express = require("express");
const authController = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.get("/admin-test", protect, authorize("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin!",
    user: req.user,
  });
});

router.get(
  "/delivery-test",
  protect,
  authorize("delivery_agent"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Delivery Agent!",
      user: req.user,
    });
  }
);

module.exports = router;