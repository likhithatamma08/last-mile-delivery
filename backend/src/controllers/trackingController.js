const TrackingHistory = require("../models/TrackingHistory");
const Order = require("../models/Order");

// Get tracking history for an order
const getTrackingHistory = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const history = await TrackingHistory.find({
      order: orderId,
    })
      .populate("updatedBy", "name email role")
      .sort({ createdAt: 1 });

    res.status(200).json({
      orderNumber: order.orderNumber,
      currentStatus: order.status,
      history,
    });
  } catch (error) {
    console.error("Get tracking history error:", error);

    res.status(500).json({
      message: "Failed to fetch tracking history",
      error: error.message,
    });
  }
};


// Add tracking history entry
const addTrackingHistory = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, location, notes } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const tracking = await TrackingHistory.create({
      order: orderId,
      status,
      location: location || "",
      updatedBy: req.user._id,
      notes: notes || "",
    });

    res.status(201).json({
      message: "Tracking history added successfully",
      tracking,
    });
  } catch (error) {
    console.error("Add tracking history error:", error);

    res.status(500).json({
      message: "Failed to add tracking history",
      error: error.message,
    });
  }
};


module.exports = {
  getTrackingHistory,
  addTrackingHistory,
};