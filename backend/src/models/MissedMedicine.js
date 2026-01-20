// src/models/MissedMedicine.js
const mongoose = require("mongoose");

const missedMedicineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
  date: { type: Date, required: true },
  reason: { 
    type: String, 
    enum: ["no-response", "reject"], 
    default: "reject"  
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MissedMedicine", missedMedicineSchema);
