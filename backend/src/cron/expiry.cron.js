const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const ProductionFCMService = require('../services/production-fcm.service');

// Run daily at 9 AM to check for expiring medicines
cron.schedule('0 9 * * *', async () => {
    try {
        console.log('📅 Checking medicine expiry dates...');
        
        const today = new Date();
        const sevenDaysFromNow = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
        
        // Find medicines expiring within 7 days
        const expiringSoonMedicines = await Medicine.find({
            expiryDate: { 
                $gte: today,
                $lte: sevenDaysFromNow 
            },
            quantity: { $gt: 0 },
            isActive: { $ne: false }
        }).populate('userId', 'fcmToken name');
        
        for (const medicine of expiringSoonMedicines) {
            if (!medicine.userId?.fcmToken) continue;
            
            const daysUntilExpiry = Math.ceil((new Date(medicine.expiryDate) - today) / (1000 * 60 * 60 * 24));
            
            try {
                await ProductionFCMService.sendNotificationWithAlert(medicine.userId._id, {
                    title: '⏰ Expiry Warning',
                    message: `${medicine.medicineName} expires in ${daysUntilExpiry} day${daysUntilExpiry > 1 ? 's' : ''}. Please check and replace if needed.`,
                    alertType: 'EXPIRY',
                    medicineId: medicine._id,
                    medicineName: medicine.medicineName,
                    severity: daysUntilExpiry <= 3 ? 'CRITICAL' : 'WARNING',
                    meta: {
                        expiryDate: medicine.expiryDate,
                        daysUntilExpiry: daysUntilExpiry
                    }
                });
                
                console.log(`⏰ Expiry warning sent: ${medicine.medicineName} (${daysUntilExpiry} days left)`);
                
            } catch (error) {
                console.error(`❌ Failed to send expiry warning for ${medicine.medicineName}:`, error);
            }
        }
        
        // Find expired medicines
        const expiredMedicines = await Medicine.find({
            expiryDate: { $lt: today },
            quantity: { $gt: 0 },
            isActive: { $ne: false }
        }).populate('userId', 'fcmToken name');
        
        for (const medicine of expiredMedicines) {
            if (!medicine.userId?.fcmToken) continue;
            
            try {
                await ProductionFCMService.sendNotificationWithAlert(medicine.userId._id, {
                    title: '🚨 Medicine Expired',
                    message: `${medicine.medicineName} has expired. Please dispose of it safely and get a new prescription.`,
                    alertType: 'EXPIRY',
                    medicineId: medicine._id,
                    medicineName: medicine.medicineName,
                    severity: 'CRITICAL',
                    meta: {
                        expiryDate: medicine.expiryDate,
                        daysExpired: Math.ceil((today - new Date(medicine.expiryDate)) / (1000 * 60 * 60 * 24))
                    }
                });
                
                console.log(`🚨 Expired medicine alert sent: ${medicine.medicineName}`);
                
            } catch (error) {
                console.error(`❌ Failed to send expired medicine alert for ${medicine.medicineName}:`, error);
            }
        }
        
    } catch (error) {
        console.error('❌ Expiry monitoring cron error:', error);
    }
});

console.log('📅 Expiry monitoring cron job started - runs daily at 9 AM');

// OLD CODE (Commented for backup)
/*
const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const AlertService = require('../services/alert.service');

cron.schedule('0 9 * * *', async () => {
  const medicines = await Medicine.find();

  for (const medicine of medicines) {
    const today = new Date();
    const expiry = new Date(medicine.expiryDate);
    const diff = (expiry - today) / (1000 * 60 * 60 * 24);

    if (diff <= 7) {
      await AlertService.createExpiryAlert(medicine);
    }
  }
});
*/