require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

const createDeliveryAgent = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const existingAgent = await User.findOne({
      email: "agent@lastmile.com",
    });

    if (existingAgent) {
      console.log("Delivery agent already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Agent@12345", 10);

    const agent = await User.create({
      name: "Delivery Agent",
      email: "agent@lastmile.com",
      password: hashedPassword,
      phone: "9111111111",
      role: "delivery_agent",
      address: "Chennai",
    });

    console.log("Delivery agent created successfully");
    console.log("Email:", agent.email);
    console.log("Password: Agent@12345");

    process.exit(0);
  } catch (error) {
    console.error("Error creating delivery agent:", error);
    process.exit(1);
  }
};

createDeliveryAgent();