const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    skillName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skillcategories",
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    demoVideoURL: {
      type: String, // Store the video path or URL
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    expertise: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

// **Check if the model already exists before defining it**
const Skills =  mongoose.model("Skills", skillSchema);

module.exports = Skills;
