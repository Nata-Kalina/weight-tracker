const mongoose = require("mongoose");

const GoalsSchema = new mongoose.Schema(
  {
    weightGoal: {
      type: Number,
      required: [true, "Please provide your goal"],
    },

    status: {
      type: String,
      enum: ["set", "declined", "reached"],
      default: "set",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goals", GoalsSchema);
