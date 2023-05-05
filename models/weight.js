const mongoose = require("mongoose");

const WeightSchema = new mongoose.Schema(
  {
    currentWeight: {
      type: Number,
      required: [true, "Please provide your current weight"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Weight", WeightSchema);
