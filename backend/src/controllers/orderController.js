const Order = require("../models/Order");
const User = require("../models/User");
const TrackingHistory = require("../models/TrackingHistory");
const Notification = require("../models/Notification");
const RateCard = require("../models/RateCard");


// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (req, res) => {
  try {
    const {
      pickupAddress,
      deliveryAddress,
      packageDescription,
      packageWeight,
      length,
      width,
      height,
      orderType,
      paymentType,
      zone,
      area,
      expectedDeliveryDate,
    } = req.body;

    // -------------------------------------------------
    // Validate required fields
    // -------------------------------------------------

    if (
      !pickupAddress ||
      !deliveryAddress ||
      !packageDescription ||
      packageWeight === undefined ||
      length === undefined ||
      width === undefined ||
      height === undefined ||
      !orderType ||
      !paymentType ||
      !zone ||
      !area
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Pickup address, delivery address, package description, package weight, dimensions, order type, payment type, zone and area are required",
      });
    }

    // -------------------------------------------------
    // Convert numeric values
    // -------------------------------------------------

    const actualWeight = Number(packageWeight);
    const packageLength = Number(length);
    const packageWidth = Number(width);
    const packageHeight = Number(height);

    if (
      !Number.isFinite(actualWeight) ||
      !Number.isFinite(packageLength) ||
      !Number.isFinite(packageWidth) ||
      !Number.isFinite(packageHeight)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Package weight, length, width and height must be valid numbers",
      });
    }

    if (
      actualWeight <= 0 ||
      packageLength <= 0 ||
      packageWidth <= 0 ||
      packageHeight <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Package weight, length, width and height must be greater than 0",
      });
    }

    // -------------------------------------------------
    // Calculate volumetric weight
    // -------------------------------------------------

    const volumetricWeight =
      (packageLength * packageWidth * packageHeight) / 5000;

    // -------------------------------------------------
    // Billable weight
    // -------------------------------------------------

    const billableWeight = Math.max(
      actualWeight,
      volumetricWeight
    );

    // -------------------------------------------------
    // Find rate card
    // -------------------------------------------------

    const rateCard = await RateCard.findOne({
      zone,
      orderType,
      isActive: true,
    });

    if (!rateCard) {
      return res.status(404).json({
        success: false,
        message:
          "No active rate card found for this zone and order type",
      });
    }

    // -------------------------------------------------
    // Calculate pricing
    // -------------------------------------------------

    const baseRate = Number(rateCard.baseRate);
    const perKgRate = Number(rateCard.perKgRate);

    const codCharge =
      paymentType === "COD"
        ? Number(rateCard.codCharge || 0)
        : 0;

    if (
      !Number.isFinite(baseRate) ||
      !Number.isFinite(perKgRate) ||
      !Number.isFinite(codCharge)
    ) {
      return res.status(500).json({
        success: false,
        message: "Invalid rate card configuration",
      });
    }

    const deliveryFee =
      baseRate +
      billableWeight * perKgRate +
      codCharge;

    // -------------------------------------------------
    // Generate order number
    // -------------------------------------------------

    const orderNumber = `ORD-${Date.now()}`;

    // -------------------------------------------------
    // Create order
    // -------------------------------------------------

    const order = await Order.create({
      orderNumber,

      customer: req.user._id,

      pickupAddress,
      deliveryAddress,
      packageDescription,

      packageWeight: actualWeight,

      length: packageLength,
      width: packageWidth,
      height: packageHeight,

      volumetricWeight,
      billableWeight,

      orderType,
      paymentType,

      zone,
      area,

      deliveryFee,

      expectedDeliveryDate:
        expectedDeliveryDate || null,

      status: "PLACED",
    });

    // -------------------------------------------------
    // Tracking history
    // -------------------------------------------------

    await TrackingHistory.create({
      order: order._id,
      status: "PLACED",
      updatedBy: req.user._id,
      notes: "Order placed successfully",
    });

    // -------------------------------------------------
    // Notification
    // -------------------------------------------------

    await Notification.create({
      recipient: req.user._id,
      order: order._id,
      title: "Order Placed",
      message:
        `Your order ${order.orderNumber} has been placed successfully.`,
      type: "ORDER_CREATED",
    });

    // -------------------------------------------------
    // Return populated order
    // -------------------------------------------------

    const populatedOrder =
      await Order.findById(order._id)
        .populate(
          "customer",
          "name email phone address"
        )
        .populate(
          "deliveryAgent",
          "name email phone"
        )
        .populate("zone", "name code")
        .populate("area", "name pincode");

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder,

      pricing: {
        actualWeight,
        volumetricWeight,
        billableWeight,
        baseRate,
        perKgRate,
        codCharge,
        deliveryFee,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating order",
    });
  }
};

// =====================================================
// GET ALL ORDERS
// =====================================================

const getOrders = async (req, res) => {
  try {
    let orders;

    // -------------------------------------------------
    // CUSTOMER
    // -------------------------------------------------

    if (req.user.role === "customer") {
      orders = await Order.find({
        customer: req.user._id,
      })
        .populate(
          "customer",
          "name email phone address"
        )
        .populate(
          "deliveryAgent",
          "name email phone"
        )
        .populate("zone", "name code")
        .populate("area", "name pincode")
        .sort({ createdAt: -1 });
    }

    // -------------------------------------------------
    // DELIVERY AGENT
    // -------------------------------------------------

    else if (req.user.role === "delivery_agent") {
      orders = await Order.find({
        deliveryAgent: req.user._id,
      })
        .populate(
          "customer",
          "name email phone address"
        )
        .populate(
          "deliveryAgent",
          "name email phone"
        )
        .populate("zone", "name code")
        .populate("area", "name pincode")
        .sort({ createdAt: -1 });
    }

    // -------------------------------------------------
    // ADMIN
    // -------------------------------------------------

    else if (req.user.role === "admin") {
      orders = await Order.find()
        .populate(
          "customer",
          "name email phone address"
        )
        .populate(
          "deliveryAgent",
          "name email phone"
        )
        .populate("zone", "name code")
        .populate("area", "name pincode")
        .sort({ createdAt: -1 });
    }

    else {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to view orders",
      });
    }

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching orders",
    });
  }
};

// =====================================================
// GET SINGLE ORDER
// =====================================================

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate(
        "customer",
        "name email phone address"
      )
      .populate(
        "deliveryAgent",
        "name email phone"
      )
      .populate("zone", "name code")
      .populate("area", "name pincode");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // -------------------------------------------------
    // CUSTOMER
    // -------------------------------------------------

    if (req.user.role === "customer") {
      if (
        !order.customer ||
        order.customer._id.toString() !==
          req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have permission to view this order",
        });
      }
    }

    // -------------------------------------------------
    // DELIVERY AGENT
    // -------------------------------------------------

    if (req.user.role === "delivery_agent") {
      if (
        !order.deliveryAgent ||
        order.deliveryAgent._id.toString() !==
          req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have permission to view this order",
        });
      }
    }

    // -------------------------------------------------
    // ADMIN
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching order",
    });
  }
};

// =====================================================
// ASSIGN DELIVERY AGENT
// ADMIN ONLY
// =====================================================

const assignDeliveryAgent = async (req, res) => {
  try {
    // -------------------------------------------------
    // ADMIN CHECK
    // -------------------------------------------------

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Only admin can assign delivery agents",
      });
    }

    const { deliveryAgent } = req.body;

    if (!deliveryAgent) {
      return res.status(400).json({
        success: false,
        message:
          "Delivery agent ID is required",
      });
    }

    // -------------------------------------------------
    // Find delivery agent
    // -------------------------------------------------

    const agent = await User.findOne({
      _id: deliveryAgent,
      role: "delivery_agent",
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Delivery agent not found",
      });
    }

    // -------------------------------------------------
    // Find order
    // -------------------------------------------------

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // -------------------------------------------------
    // Only PLACED orders can be assigned
    // -------------------------------------------------

    if (order.status !== "PLACED") {
      return res.status(400).json({
        success: false,
        message:
          `Cannot assign agent when order status is ${order.status}`,
      });
    }

    // -------------------------------------------------
    // Assign agent
    // -------------------------------------------------

    order.deliveryAgent = agent._id;
    order.status = "ASSIGNED";

    await order.save();

    // -------------------------------------------------
    // Tracking
    // -------------------------------------------------

    await TrackingHistory.create({
      order: order._id,
      status: "ASSIGNED",
      updatedBy: req.user._id,
      notes:
        `Delivery agent ${agent.name} assigned to order`,
    });

    // -------------------------------------------------
    // Customer notification
    // -------------------------------------------------

    await Notification.create({
      recipient: order.customer,
      order: order._id,
      title: "Delivery Agent Assigned",
      message:
        `A delivery agent has been assigned to your order ${order.orderNumber}.`,
      type: "ORDER_ASSIGNED",
    });

    // -------------------------------------------------
    // Agent notification
    // -------------------------------------------------

    await Notification.create({
      recipient: agent._id,
      order: order._id,
      title: "New Delivery Assigned",
      message:
        `You have been assigned order ${order.orderNumber}.`,
      type: "ORDER_ASSIGNED",
    });

    // -------------------------------------------------
    // Return updated order
    // -------------------------------------------------

    const updatedOrder =
      await Order.findById(order._id)
        .populate(
          "customer",
          "name email phone address"
        )
        .populate(
          "deliveryAgent",
          "name email phone"
        )
        .populate("zone", "name code")
        .populate("area", "name pincode");

    return res.status(200).json({
      success: true,
      message:
        "Delivery agent assigned successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Assign delivery agent error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while assigning delivery agent",
    });
  }
};

// =====================================================
// UPDATE ORDER STATUS
// DELIVERY AGENT ONLY
// =====================================================

const updateOrderStatus = async (req, res) => {
  try {
    // -------------------------------------------------
    // DELIVERY AGENT CHECK
    // -------------------------------------------------

    if (req.user.role !== "delivery_agent") {
      return res.status(403).json({
        success: false,
        message:
          "Only the assigned delivery agent can update order status",
      });
    }

    const { status } = req.body;

    // -------------------------------------------------
    // Valid statuses
    // -------------------------------------------------

    const validStatuses = [
      "PLACED",
      "ASSIGNED",
      "PICKED_UP",
      "IN_TRANSIT",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // -------------------------------------------------
    // Find order
    // -------------------------------------------------

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // -------------------------------------------------
    // Check assigned agent
    // -------------------------------------------------

    if (
      !order.deliveryAgent ||
      order.deliveryAgent.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not assigned to this order",
      });
    }

    // -------------------------------------------------
    // Status transitions
    // -------------------------------------------------

    const allowedTransitions = {
      PLACED: [],

      ASSIGNED: [
        "PICKED_UP",
        "CANCELLED",
      ],

      PICKED_UP: [
        "IN_TRANSIT",
        "CANCELLED",
      ],

      IN_TRANSIT: [
        "OUT_FOR_DELIVERY",
        "CANCELLED",
      ],

      OUT_FOR_DELIVERY: [
        "DELIVERED",
      ],

      DELIVERED: [],

      CANCELLED: [],
    };

    const currentStatus = order.status;

    // -------------------------------------------------
    // Completed orders cannot change
    // -------------------------------------------------

    if (
      currentStatus === "DELIVERED" ||
      currentStatus === "CANCELLED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Order is already ${currentStatus}`,
      });
    }

    // -------------------------------------------------
    // Validate transition
    // -------------------------------------------------

    if (
      !allowedTransitions[currentStatus].includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Cannot change order status from ${currentStatus} to ${status}`,
      });
    }

    // -------------------------------------------------
    // Update order
    // -------------------------------------------------

    order.status = status;

    if (status === "DELIVERED") {
      order.deliveredAt = new Date();
    }

    await order.save();

    // -------------------------------------------------
    // Tracking history
    // -------------------------------------------------

    await TrackingHistory.create({
      order: order._id,
      status,
      updatedBy: req.user._id,
      notes:
        `Order status changed from ${currentStatus} to ${status}`,
    });

    // -------------------------------------------------
    // Customer notification
    // -------------------------------------------------

    let notificationTitle =
      "Order Status Updated";

    let notificationMessage =
      `Your order ${order.orderNumber} is now ${status}.`;

    let notificationType =
      "ORDER_STATUS";

    if (status === "DELIVERED") {
      notificationTitle =
        "Order Delivered";

      notificationMessage =
        `Your order ${order.orderNumber} has been delivered successfully.`;

      notificationType =
        "ORDER_DELIVERED";
    }

    await Notification.create({
      recipient: order.customer,
      order: order._id,
      title: notificationTitle,
      message: notificationMessage,
      type: notificationType,
    });

    // -------------------------------------------------
    // Return updated order
    // -------------------------------------------------

    const updatedOrder =
      await Order.findById(order._id)
        .populate(
          "customer",
          "name email phone address"
        )
        .populate(
          "deliveryAgent",
          "name email phone"
        )
        .populate("zone", "name code")
        .populate("area", "name pincode");

    return res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating order status",
    });
  }
};

// =====================================================
// GET TRACKING HISTORY
// =====================================================

const getTrackingHistory = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // -------------------------------------------------
    // CUSTOMER
    // -------------------------------------------------

    if (req.user.role === "customer") {
      if (
        order.customer.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have permission to view this order",
        });
      }
    }

    // -------------------------------------------------
    // DELIVERY AGENT
    // -------------------------------------------------

    if (req.user.role === "delivery_agent") {
      if (
        !order.deliveryAgent ||
        order.deliveryAgent.toString() !==
          req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have permission to view this order",
        });
      }
    }

    // -------------------------------------------------
    // ADMIN
    // -------------------------------------------------

    const history =
      await TrackingHistory.find({
        order: order._id,
      })
        .populate(
          "updatedBy",
          "name role"
        )
        .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error(
      "Get tracking history error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching tracking history",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  assignDeliveryAgent,
  updateOrderStatus,
  getTrackingHistory,
};