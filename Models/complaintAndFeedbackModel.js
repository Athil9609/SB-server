const mongoose = require("mongoose");

const feedbackComplaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  username: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["complaint", "feedback"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: function () {
      return this.type === "complaint";
    },
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: function () {
      return this.type === "feedback";
    },
  },
  adminResponse: {
    type: String,
    default: "",
  },
  respondedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const complaintAndFeedbackModel = mongoose.model("FeedbackComplaint", feedbackComplaintSchema);

module.exports = complaintAndFeedbackModel;
