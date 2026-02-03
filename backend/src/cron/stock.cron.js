const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const AlertService = require('../services/alert.service');

// Run daily at 10 AM to check stock levels
cron.schedule('0 10 * * *', async () => {
    try {
        console.log('📦 Checking medicine stock levels...');
        
        const medicines = await Medicine.find({}).populate('userId', 'fcmToken');
        
        for (const medicine of medicines) {
            if (!medicine.userId?.fcmToken) continue;
            
            // Check if low stock
            if (medicine.remainingQuantity <= medicine.lowStockThreshold) {
                await AlertService.createLowStockAlert(medicine);
                console.log(`✅ Low stock alert created: ${medicine.name} (${medicine.remainingQuantity} left)`);
            }
        }
        
        console.log('📦 Stock check completed');
        
    } catch (error) {
        console.error('❌ Stock cron error:', error);
    }
});

console.log('📦 Stock cron job started - runs daily at 10 AM');