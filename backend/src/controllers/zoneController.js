const Zone = require("../models/Zone");

// Create Zone
const createZone = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Zone name and code are required",
      });
    }

    const existingZone = await Zone.findOne({
      $or: [{ name }, { code }],
    });

    if (existingZone) {
      return res.status(400).json({
        success: false,
        message: "Zone with this name or code already exists",
      });
    }

    const zone = await Zone.create({
      name,
      code,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Zone created successfully",
      zone,
    });
  } catch (error) {
    console.error("Create zone error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating zone",
    });
  }
};

// Get All Zones
const getZones = async (req, res) => {
  try {
    const zones = await Zone.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: zones.length,
      zones,
    });
  } catch (error) {
    console.error("Get zones error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching zones",
    });
  }
};

module.exports = {
  createZone,
  getZones,
};