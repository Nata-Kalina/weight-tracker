const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  age: {
    type: Number,
    required: [true, "Please provide age"],
  },
  height: {
    type: Number,
    required: [true, "Please provide height"],
  },
  weight: {
    type: Number,
    required: [true, "Please provide weight"],
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female", "someone else"],
      message: "{VALUE} is not supported",
    },
  },
  activity_level: {
    type: String,
    enum: {
      values: ["high", "medium", "low"],
      message: "{VALUE} is not supported",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please rpovide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 3,
    maxlength: 20,
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
