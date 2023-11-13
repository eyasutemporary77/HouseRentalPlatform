const mongoose = require("mongoose");

const termsAndConditions = mongoose.model(
  "termsAndConditions",
  mongoose.Schema([
    {
      title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 3000,
      },
      isEnabled: {
        type: Boolean,
        default: true,
      },
      content: {
        type: String,
        required: true,
      },
      version: {
        type: String,
        required: true,
      },
      effectiveDate: {
        type: Date,
        required: true,
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ])
);

const agreementVersion = mongoose.model(
  "agreementVersion",
  mongoose.Schema({
    version: {
      type: String,
      default: "1.0.0",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    agreements: {
      type: [termsAndConditions],
    },
  })
);
module.exports = agreementVersion;
module.exports = termsAndConditions;
