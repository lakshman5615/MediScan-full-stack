 const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    medicineName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, required: true },
    schedule: {
        time: { type: String, required: true },
        frequency: { type: String, enum: ['daily','weekly','monthly'], default: 'daily' }
    },
    status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' },
    lastLowStockAlert: {
  type: Date,
  default: null
},
lastExpiryAlert: {
  type: Date,
  default: null
}
,
lastReminderSent: { type: Date, default: null }
,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Medicine', medicineSchema);
