const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
   
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", 
      required: true,
    },
    serviceProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", 
      required: true,
    },
    skillName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled","rejected"], 
      default: "pending",
    },
  },
  { timestamps: true } 
);

const Booking = mongoose.model("Bookings", bookingSchema);

module.exports = Booking;
