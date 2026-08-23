const express = require("express");
const cors = require("cors");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const trackingRoutes = require("./routes/trackingRoutes");

app.use("/api/tracking", trackingRoutes);
// =====================================================
// ZONE ROUTES
// =====================================================

const zoneRoutes = require("./routes/zoneRoutes");

app.use("/api/zones", zoneRoutes);

// =====================================================
// AREA ROUTES
// =====================================================

const areaRoutes = require("./routes/areaRoutes");

app.use("/api/areas", areaRoutes);

// =====================================================
// ORDER ROUTES
// =====================================================

const orderRoutes = require("./routes/orderRoutes");

app.use("/api/orders", orderRoutes);

// =====================================================
// RATE CARD ROUTES
// =====================================================

const rateCardRoutes = require("./routes/rateCardRoutes");

app.use("/api/rate-cards", rateCardRoutes);

// =====================================================
// NOTIFICATION ROUTES
// =====================================================

const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/notifications", notificationRoutes);

// =====================================================
// ADMIN ROUTES
// =====================================================

const adminRoutes = require("./routes/adminRoutes");

app.use("/api/admin", adminRoutes);


// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Last-Mile Delivery API is running",
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// EXPORT
// =====================================================

module.exports = app;