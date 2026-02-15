const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  type: {
    type: String,
    enum: ['REMINDER', 'EXPIRY', 'LOW_STOCK'],
    required: true
  },

  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },

  medicineName: {
    type: String,
    required: true
  },

  dosage: {
    type: String,
    default: ''
  },

  // PENDING = waiting for action
  // TAKEN / MISSED = reminder action
  // RESOLVED = expiry / low stock closed
  status: {
  type: String,
  enum: ['PENDING', 'TAKEN', 'MISSED', 'DISMISSED', 'RESOLVED'],
  default: 'PENDING'
},

actionRequired: {
  type: Boolean,
  default: false // REMINDER true hoga
}
,

  severity: {
    type: String,
    enum: ['NORMAL', 'WARNING', 'CRITICAL'],
    default: 'NORMAL'
  },

  meta: {
    scheduledTime: String,   // morning / afternoon / evening / night
    expiryDate: Date,
    stockLeft: Number,
    threshold: Number
  },

  // UI & Notification sync flags
  showInUI: {
    type: Boolean,
    default: true
  },

  sentToDevice: {
    type: Boolean,
    default: false
  },

  // When alert is completed (taken/missed/resolved)
  resolvedAt: {
    type: Date,
    default: null
  },

  // Prevent duplicate alerts (per medicine / per day / per type)
  uniqueKey: {
    type: String,
    unique: true,
    sparse: true
  }

}, {
  timestamps: true
});

// Performance indexes
alertSchema.index({ userId: 1, type: 1, status: 1 });
alertSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
