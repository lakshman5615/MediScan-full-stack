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
    medicineName: { type: String, required: true },
    dosage: { type: String, default: '' },
    
    status: {
        type: String,
        enum: ['PENDING', 'TAKEN', 'MISSED', 'DISMISSED'],
        default: 'PENDING'
    },
    
    severity: {
        type: String,
        enum: ['NORMAL', 'WARNING', 'CRITICAL'],
        default: 'NORMAL'
    },
    
    meta: {
        scheduledTime: String, // morning/afternoon/evening/night
        expiryDate: Date,
        stockLeft: Number,
        threshold: Number
    },
    
    showInUI: { type: Boolean, default: true },
    sentToDevice: { type: Boolean, default: false },
    
    // Prevent duplicate alerts
    uniqueKey: { type: String, unique: true, sparse: true }
}, {
    timestamps: true
});

// Indexes for performance
alertSchema.index({ userId: 1, type: 1, status: 1 });
alertSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);