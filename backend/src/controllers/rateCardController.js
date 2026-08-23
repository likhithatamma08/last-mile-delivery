const RateCard = require("../models/RateCard");

// =====================================================
// CREATE RATE CARD
// =====================================================

const createRateCard = async (req, res) => {
  try {
    const {
      zone,
      orderType,
      baseRate,
      perKgRate,
      codCharge,
    } = req.body;

    if (
      !zone ||
      !orderType ||
      baseRate === undefined ||
      perKgRate === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Zone, order type, base rate and per kg rate are required",
      });
    }

    const existingRateCard = await RateCard.findOne({
      zone,
      orderType,
    });

    if (existingRateCard) {
      return res.status(400).json({
        success: false,
        message:
          "A rate card already exists for this zone and order type",
      });
    }

    const rateCard = await RateCard.create({
      zone,
      orderType,
      baseRate: Number(baseRate),
      perKgRate: Number(perKgRate),
      codCharge: Number(codCharge || 0),
    });

    const populatedRateCard = await RateCard.findById(
      rateCard._id
    ).populate("zone", "name code");

    res.status(201).json({
      success: true,
      message: "Rate card created successfully",
      rateCard: populatedRateCard,
    });
  } catch (error) {
    console.error("Create rate card error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating rate card",
    });
  }
};

// =====================================================
// GET RATE CARDS
// =====================================================

const getRateCards = async (req, res) => {
  try {
    const rateCards = await RateCard.find()
      .populate("zone", "name code")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rateCards.length,
      rateCards,
    });
  } catch (error) {
    console.error("Get rate cards error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching rate cards",
    });
  }
};

// =====================================================
// UPDATE RATE CARD
// =====================================================

const updateRateCard = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      zone,
      orderType,
      baseRate,
      perKgRate,
      codCharge,
      isActive,
    } = req.body;

    const rateCard = await RateCard.findById(id);

    if (!rateCard) {
      return res.status(404).json({
        success: false,
        message: "Rate card not found",
      });
    }

    if (zone && orderType) {
      const duplicate = await RateCard.findOne({
        zone,
        orderType,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message:
            "Another rate card already exists for this zone and order type",
        });
      }
    }

    if (zone !== undefined) {
      rateCard.zone = zone;
    }

    if (orderType !== undefined) {
      rateCard.orderType = orderType;
    }

    if (baseRate !== undefined) {
      rateCard.baseRate = Number(baseRate);
    }

    if (perKgRate !== undefined) {
      rateCard.perKgRate = Number(perKgRate);
    }

    if (codCharge !== undefined) {
      rateCard.codCharge = Number(codCharge);
    }

    if (isActive !== undefined) {
      rateCard.isActive = isActive;
    }

    await rateCard.save();

    const updatedRateCard = await RateCard.findById(id)
      .populate("zone", "name code");

    res.status(200).json({
      success: true,
      message: "Rate card updated successfully",
      rateCard: updatedRateCard,
    });
  } catch (error) {
    console.error("Update rate card error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating rate card",
    });
  }
};

// =====================================================
// DELETE RATE CARD
// =====================================================

const deleteRateCard = async (req, res) => {
  try {
    const { id } = req.params;

    const rateCard = await RateCard.findById(id);

    if (!rateCard) {
      return res.status(404).json({
        success: false,
        message: "Rate card not found",
      });
    }

    await RateCard.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Rate card deleted successfully",
    });
  } catch (error) {
    console.error("Delete rate card error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting rate card",
    });
  }
};

module.exports = {
  createRateCard,
  getRateCards,
  updateRateCard,
  deleteRateCard,
};