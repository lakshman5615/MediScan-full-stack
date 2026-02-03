const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Basic Info - matching UI exactly
    name: { type: String, required: true }, // medicineName -> name
    brand: { type: String, default: '' },
    medicineType: { 
        type: String, 
        enum: ['Prescription', 'OTC', 'Supplement'], 
        required: true
    },
    dosage: { type: String, default: '' }, // optional as per UI
    
    // Quantity Management
    totalQuantity: { type: Number, required: true, min: 1 },
    remainingQuantity: { type: Number, required: true, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    
    // Dates
    expiryDate: { type: Date, required: true },
    
    // Schedule - exactly as UI specifies
    schedule: {
        morning: {
            enabled: { type: Boolean, default: false },
            time: { type: String, default: '08:00' }
        },
        afternoon: {
            enabled: { type: Boolean, default: false },
            time: { type: String, default: '13:00' }
        },
        evening: {
            enabled: { type: Boolean, default: false },
            time: { type: String, default: '18:00' }
        },
        night: {
            enabled: { type: Boolean, default: false },
            time: { type: String, default: '22:00' }
        }
    },
    
    // Search & Filter Fields
    symptoms: [String],
    activeIngredients: [String],
    
    // Tracking Fields
    lastReminderSent: { type: Date, default: null }
}, {
    timestamps: true // createdAt, updatedAt
});

// Virtual for auto-calculated status
medicineSchema.virtual('status').get(function() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const expiryDate = new Date(this.expiryDate);
    expiryDate.setHours(0, 0, 0, 0);
    
    if (expiryDate < today) return 'EXPIRED';
    if (this.remainingQuantity <= this.lowStockThreshold) return 'LOW_STOCK';
    return 'STOCKED';
});

// Ensure virtual fields are serialized
medicineSchema.set('toJSON', { virtuals: true });
medicineSchema.set('toObject', { virtuals: true });

// Indexes for performance
medicineSchema.index({ userId: 1, status: 1 });
medicineSchema.index({ userId: 1, name: 'text' });

module.exports = mongoose.model('Medicine', medicineSchema);