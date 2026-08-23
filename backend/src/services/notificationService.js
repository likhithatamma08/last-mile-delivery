const Notification = require("../models/Notification");

const createNotification = async ({
  recipient,
  order = null,
  title,
  message,
  type = "GENERAL",
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      order,
      title,
      message,
      type,
    });

    return notification;
  } catch (error) {
    console.error(
      "Create notification error:",
      error
    );

    return null;
  }
};

module.exports = {
  createNotification,
};