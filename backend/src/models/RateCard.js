const mongoose = require("mongoose");

const rateCardSchema = new mongoose.Schema(
  {
    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
    },

    orderType: {
      type: String,
      enum: ["B2B", "B2C"],
      required: true,
    },

    baseRate: {
      type: Number,
      required: true,
      min: 0,
    },

    perKgRate: {
      type: Number,
      required: true,
      min: 0,
    },

    codCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RateCard", rateCardSchema);