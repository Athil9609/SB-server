const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  serviceProviderName:{
    type:String,
    required:true
  },
  serviceReceiverName:{
    type:String,
    required:true
  },

  serviceReceiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  skillName: {
    type: String,
    required: true,
  },
  skillId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Skills",
    require:true
  }, 
   status: {
    type: String,
    enum: ["pending", "completed"], 
    default: "pending",
  },
  transactionDateTime: {
    type: Date,
    default: Date.now, 
  },
  rate: {
    type: Number,
    required: true,
  }
});

const transactions=mongoose.model("transactions", transactionSchema);

module.exports = transactions
