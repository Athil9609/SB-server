const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
   
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to the same User model
      required: true,
    },
    serviceProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to the same User model for service provider
      required: true,
    },
    skillName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled","rejected"], // Example status
      default: "pending",
    },
  },
  { timestamps: true } // Mongoose will automatically add createdAt and updatedAt
);

// Create the model from the schema
const Booking = mongoose.model("Bookings", bookingSchema);

module.exports = Booking;
