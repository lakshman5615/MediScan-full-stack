const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  medicineName: {
    type: String,
    required: true,
    trim: true
  },

  expiryDate: {
    type: Date,
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 0
  },

  schedule: {
    time: {
      type: String, // "09:00"
      required: true
    },
    period: {
      type: String, // "Morning", "Afternoon", "Evening"
      required: true
    }
  },
  aiExplanation: {
    usage: {
      type: String
    },
    dosage: {
      type: String
    },
    warnings: {
      type: String
    }
  },

  missedCount: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Medicine", medicineSchema);
