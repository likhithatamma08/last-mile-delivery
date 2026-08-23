const Area = require("../models/Area");
const Zone = require("../models/Zone");

// Create Area
const createArea = async (req, res) => {
  try {
    const { name, pincode, zone } = req.body;

    if (!name || !pincode || !zone) {
      return res.status(400).json({
        success: false,
        message: "Name, pincode and zone are required",
      });
    }

    // Check if zone exists
    const existingZone = await Zone.findById(zone);

    if (!existingZone) {
      return res.status(404).json({
        success: false,
        message: "Zone not found",
      });
    }

    // Check duplicate pincode
    const existingArea = await Area.findOne({ pincode });

    if (existingArea) {
      return res.status(400).json({
        success: false,
        message: "Area with this pincode already exists",
      });
    }

    const area = await Area.create({
      name,
      pincode,
      zone,
    });

    const populatedArea = await Area.findById(area._id).populate(
      "zone",
      "name code"
    );

    res.status(201).json({
      success: true,
      message: "Area created successfully",
      area: populatedArea,
    });
  } catch (error) {
    console.error("Create area error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating area",
    });
  }
};

// Get All Areas
const getAreas = async (req, res) => {
  try {
    const areas = await Area.find()
      .populate("zone", "name code")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: areas.length,
      areas,
    });
  } catch (error) {
    console.error("Get areas error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching areas",
    });
  }
};

// Get Area By ID
const getAreaById = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id).populate(
      "zone",
      "name code"
    );

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }

    res.status(200).json({
      success: true,
      area,
    });
  } catch (error) {
    console.error("Get area error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching area",
    });
  }
};

// Update Area
const updateArea = async (req, res) => {
  try {
    const { name, pincode, zone, isActive } = req.body;

    const area = await Area.findById(req.params.id);

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }

    // If zone is being changed
    if (zone) {
      const existingZone = await Zone.findById(zone);

      if (!existingZone) {
        return res.status(404).json({
          success: false,
          message: "Zone not found",
        });
      }

      area.zone = zone;
    }

    // If pincode is being changed
    if (pincode && pincode !== area.pincode) {
      const duplicate = await Area.findOne({
        pincode,
        _id: { $ne: area._id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Another area already uses this pincode",
        });
      }

      area.pincode = pincode;
    }

    if (name !== undefined) {
      area.name = name;
    }

    if (isActive !== undefined) {
      area.isActive = isActive;
    }

    await area.save();

    const updatedArea = await Area.findById(area._id).populate(
      "zone",
      "name code"
    );

    res.status(200).json({
      success: true,
      message: "Area updated successfully",
      area: updatedArea,
    });
  } catch (error) {
    console.error("Update area error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating area",
    });
  }
};

// Delete Area
const deleteArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }

    await Area.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Area deleted successfully",
    });
  } catch (error) {
    console.error("Delete area error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting area",
    });
  }
};

module.exports = {
  createArea,
  getAreas,
  getAreaById,
  updateArea,
  deleteArea,
};