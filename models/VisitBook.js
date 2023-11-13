const mongoose = require("mongoose");
const visitBookSchema = mongoose.Schema(
  {
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    isFinished: { type: Boolean, default: false },
    isPostponed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const VisitBookModel = mongoose.model("VisitBook", visitBookSchema);
module.exports = { VisitBookModel };
