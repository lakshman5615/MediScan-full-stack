const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    enabled: { type: Boolean, default: false },
    time: { type: String, required: true } // HH:mm
}, { _id: false });

const medicineSchema = new mongoose.Schema({
    // 🔑 Ownership
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // 🧾 Basic Info (UI aligned)
    name: { type: String, required: true, trim: true },
    brand: { type: String, default: '' },
    medicineType: {
        type: String,
        enum: ['Prescription', 'OTC', 'Supplement'],
        required: true
    },
    dosage: { type: String, default: '' },

    // 📦 Quantity
    totalQuantity: {
        type: Number,
        required: true,
        min: 1
    },
    remainingQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 5
    },

    // 📅 Expiry
    expiryDate: {
        type: Date,
        required: true
    },

    // ⏰ Schedule (UI = backend 1:1)
    schedule: {
        morning: { type: scheduleSchema, default: () => ({ time: '08:00' }) },
        afternoon: { type: scheduleSchema, default: () => ({ time: '13:00' }) },
        evening: { type: scheduleSchema, default: () => ({ time: '18:00' }) },
        night: { type: scheduleSchema, default: () => ({ time: '22:00' }) }
    },

    // 🔎 Search helpers
    symptoms: [{ type: String }],
    activeIngredients: [{ type: String }],

    // 🧠 System tracking (cron protection)
    lastReminderSent: { type: Date, default: null },
    lastLowStockAlert: { type: Date, default: null },
    lastExpiryAlert: { type: Date, default: null }

}, {
    timestamps: true
});


// 🔄 Auto-calculated status (used by UI)
medicineSchema.virtual('status').get(function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(this.expiryDate);
    expiry.setHours(0, 0, 0, 0);

    if (expiry < today) return 'EXPIRED';
    if (this.remainingQuantity <= this.lowStockThreshold) return 'LOW_STOCK';
    return 'STOCKED';
});

// Include virtuals in response
medicineSchema.set('toJSON', { virtuals: true });
medicineSchema.set('toObject', { virtuals: true });

// 📌 Indexes
medicineSchema.index({ userId: 1, createdAt: -1 });
medicineSchema.index({ userId: 1, name: 'text' });

module.exports = mongoose.model('Medicine', medicineSchema);
