 const mongoose = require('mongoose');

const doseHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },

  medicineName: String,
  scheduledTime: String, // Morning / Afternoon / Evening
  scheduledAt: Date,

  status: {
    type: String,
    enum: ['TAKEN', 'MISSED'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('DoseHistory', doseHistorySchema);
