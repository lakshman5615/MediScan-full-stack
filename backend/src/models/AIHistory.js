const mongoose = require("mongoose");

const aiHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    default: null
  },

  question: {
    type: String,
    required: true
  },

  aiResponse: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AIHistory", aiHistorySchema);
