const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const AlertService = require('../services/alert.service');

// Run daily at 9 AM to check expiry dates
cron.schedule('0 9 * * *', async () => {
    try {
        console.log('📅 Checking medicine expiry dates...');
        
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const medicines = await Medicine.find({
            $or: [
                { expiryDate: { $lt: today } }, // Expired
                { expiryDate: { $lte: nextWeek } } // Expiring soon
            ]
        }).populate('userId', 'fcmToken');
        
        for (const medicine of medicines) {
            if (!medicine.userId?.fcmToken) continue;
            
            await AlertService.createExpiryAlert(medicine);
            console.log(`✅ Expiry alert created: ${medicine.name}`);
        }
        
        console.log(`📅 Expiry check completed - ${medicines.length} medicines processed`);
        
    } catch (error) {
        console.error('❌ Expiry cron error:', error);
    }
});

console.log('📅 Expiry cron job started - runs daily at 9 AM');