const Order = require("../models/Order");
const User = require("../models/User");

// =====================================================
// ADMIN DASHBOARD
// =====================================================

const getDashboard = async (req, res) => {
  try {
    // Get order counts
    const totalOrders = await Order.countDocuments();

    const placed = await Order.countDocuments({
      status: "PLACED",
    });

    const assigned = await Order.countDocuments({
      status: "ASSIGNED",
    });

    const pickedUp = await Order.countDocuments({
      status: "PICKED_UP",
    });

    const inTransit = await Order.countDocuments({
      status: "IN_TRANSIT",
    });

    const outForDelivery = await Order.countDocuments({
      status: "OUT_FOR_DELIVERY",
    });

    const delivered = await Order.countDocuments({
      status: "DELIVERED",
    });

    const cancelled = await Order.countDocuments({
      status: "CANCELLED",
    });

    // =================================================
    // DELIVERY AGENTS
    // =================================================

    const totalDeliveryAgents = await User.countDocuments({
      role: "delivery_agent",
    });

    // =================================================
    // CUSTOMERS
    // =================================================

    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    // =================================================
    // REVENUE
    // =================================================

    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: "DELIVERED",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$deliveryFee",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // =================================================
    // COD REVENUE
    // =================================================

    const codResult = await Order.aggregate([
      {
        $match: {
          status: "DELIVERED",
          paymentType: "COD",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$deliveryFee",
          },
        },
      },
    ]);

    const codRevenue =
      codResult.length > 0
        ? codResult[0].total
        : 0;

    // =================================================
    // PREPAID REVENUE
    // =================================================

    const prepaidResult = await Order.aggregate([
      {
        $match: {
          status: "DELIVERED",
          paymentType: "PREPAID",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$deliveryFee",
          },
        },
      },
    ]);

    const prepaidRevenue =
      prepaidResult.length > 0
        ? prepaidResult[0].total
        : 0;

    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({
      success: true,

      dashboard: {
        orders: {
          total: totalOrders,
          placed,
          assigned,
          pickedUp,
          inTransit,
          outForDelivery,
          delivered,
          cancelled,
        },

        users: {
          totalCustomers,
          totalDeliveryAgents,
        },

        revenue: {
          total: totalRevenue,
          cod: codRevenue,
          prepaid: prepaidRevenue,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard",
    });
  }
};

// =====================================================
// GET ALL ORDERS - ADMIN
// =====================================================

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email phone")
      .populate("deliveryAgent", "name email phone")
      .populate("zone", "name code")
      .populate("area", "name pincode")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
};

// =====================================================
// GET SINGLE ORDER - ADMIN
// =====================================================

const getAdminOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email phone address")
      .populate("deliveryAgent", "name email phone")
      .populate("zone", "name code")
      .populate("area", "name pincode");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get admin order error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching order",
    });
  }
};

// =====================================================
// GET DELIVERY AGENTS - ADMIN
// =====================================================

const getDeliveryAgents = async (req, res) => {
  try {
    const agents = await User.find({
      role: "delivery_agent",
    }).select("-password");

    res.status(200).json({
      success: true,
      count: agents.length,
      deliveryAgents: agents,
    });
  } catch (error) {
    console.error("Get delivery agents error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching delivery agents",
    });
  }
};

// =====================================================
// GET CUSTOMERS - ADMIN
// =====================================================

const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({
      role: "customer",
    }).select("-password");

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Get customers error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching customers",
    });
  }
};

module.exports = {
  getDashboard,
  getAllOrders,
  getAdminOrderById,
  getDeliveryAgents,
  getCustomers,
};