const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const ProductionFCMService = require('../services/production-fcm.service');

// Run every hour to check stock levels
cron.schedule('0 * * * *', async () => {
    try {
        console.log('📦 Checking medicine stock levels...');
        
        // Find medicines with low stock (quantity <= 2 and > 0)
        const lowStockMedicines = await Medicine.find({
            quantity: { $lte: 2, $gt: 0 },
            isActive: { $ne: false }
        }).populate('userId', 'fcmToken name');
        
        for (const medicine of lowStockMedicines) {
            if (!medicine.userId?.fcmToken) continue;
            
            try {
                await ProductionFCMService.sendNotificationWithAlert(medicine.userId._id, {
                    title: '⚠️ Low Stock Alert',
                    message: `${medicine.medicineName} is running low. Only ${medicine.quantity} doses remaining.`,
                    alertType: 'LOW_STOCK',
                    medicineId: medicine._id,
                    medicineName: medicine.medicineName,
                    severity: 'WARNING',
                    meta: {
                        stockLeft: medicine.quantity,
                        threshold: 2
                    }
                });
                
                console.log(`⚠️ Low stock alert sent: ${medicine.medicineName} (${medicine.quantity} left)`);
                
            } catch (error) {
                console.error(`❌ Failed to send low stock alert for ${medicine.medicineName}:`, error);
            }
        }
        
        // Find medicines that are out of stock
        const outOfStockMedicines = await Medicine.find({
            quantity: 0,
            isActive: { $ne: false }
        }).populate('userId', 'fcmToken name');
        
        for (const medicine of outOfStockMedicines) {
            if (!medicine.userId?.fcmToken) continue;
            
            try {
                await ProductionFCMService.sendNotificationWithAlert(medicine.userId._id, {
                    title: '🚫 Out of Stock',
                    message: `${medicine.medicineName} is out of stock. Please refill your prescription.`,
                    alertType: 'LOW_STOCK',
                    medicineId: medicine._id,
                    medicineName: medicine.medicineName,
                    severity: 'CRITICAL',
                    meta: {
                        stockLeft: 0,
                        threshold: 0
                    }
                });
                
                console.log(`🚫 Out of stock alert sent: ${medicine.medicineName}`);
                
            } catch (error) {
                console.error(`❌ Failed to send out of stock alert for ${medicine.medicineName}:`, error);
            }
        }
        
    } catch (error) {
        console.error('❌ Stock monitoring cron error:', error);
    }
});

console.log('📦 Stock monitoring cron job started - runs every hour');

// OLD CODE (Commented for backup)
/*
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
*/