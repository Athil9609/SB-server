const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    default: null, // Profile picture
  },
  role: {
    type: String,
    enum: ["user"],
    default: "user",
  },
  currency: {
    type: Number,
    default: 3, // Initial currency in hours
  },
  status: {
    type: String,
    enum: ["pending", "verified", "blocked", "rejected"],
    default: "pending",
  },
  certifications: [
    {
      skillName: {
        type: String,
        required: false, // Each certification requires a skill name
      },
      filePath: {
        type: String, // Path to the uploaded certification file
        required: false,
      },
    },
  ],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
