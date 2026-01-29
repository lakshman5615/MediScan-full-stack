 const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  //for string miss match
  scanMedicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ScanMedicine",
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
        time: { type: String, required: true },
        frequency: { type: String, enum: ['daily','weekly','monthly'], default: 'daily' } }
  ,
      status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' },
  // aiExplanation: {
  //   usage: {
  //     type: String
  //   },
  //   dosage: {
  //     type: String
  //   },
  //   warnings: {
  //     type: String
  //   },
  //   sideEffects: {
  //     type: String
  //   }
  // },
  missedCount: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Medicine', medicineSchema);
