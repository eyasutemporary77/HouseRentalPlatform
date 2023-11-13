const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["MESSAGE", "PROPERTY UPDATE", "APPOINTMENT REMINDER"],
  },
  message: {
    type: String,
    required: true,
    minlegth: 1,
    maxlength: 1024,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  linkToPage: {
    type: String,
    minlegth: 1,
    maxlength: 1024,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
