const mongoose = require("mongoose");

const RatingAndFeedbackSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    addedTo: {
      type: String,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
    skill:{
        type:String,
        required:true
    }
  },
  { timestamps: true }
);

const RatingAndFeedback=mongoose.model('rating&feedbacks',RatingAndFeedbackSchema)

module.exports=RatingAndFeedback