const mongoose = require("mongoose");

const rentSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property", 
    required: true,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  rentAmount: {
    type: Number,
    required: true,
  },
  paymentFrequency: {
    type: String,
    enum: ["WEEKLY", "MONTHLY", "QUARTERLY", "SEMI-ANNUALLY", "ANNUALLY"],
    required: true,
  },
  // You can add more fields such as payment history, security deposit details, and any additional metadata as needed.
});

const Rent = mongoose.model("Rent", rentSchema);

// Export the model.
module.exports = Rent;
