const mongoose = require('mongoose');

const cabinetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicineName: { type: String, required: true },
  schedule: { type: [String], required: true }, // ["09:00", "21:00"]
  quantity: { type: Number, required: true },
  remainingQuantity: { type: Number, required: true },
  status: { type: String, enum: ['active','completed','stopped'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cabinet', cabinetSchema);
