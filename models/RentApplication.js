const mongoose = require("mongoose");
const rentalApplicationSchema = mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    maxlength: 1000,
  },
});

const RentApplicationModel = mongoose.model(
  "rentalApplication",
  rentalApplicationSchema
);
module.exports = { RentApplicationModel };
