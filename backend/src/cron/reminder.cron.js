const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const AlertService = require('../services/alert.service');

// Run every minute to check for medicine reminders
cron.schedule('* * * * *', async () => {
    try {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
        
        console.log(`🔔 Checking reminders at ${currentTime}...`);
        
        const medicines = await Medicine.find({}).populate('userId', 'fcmToken');
        
        for (const medicine of medicines) {
            if (!medicine.userId?.fcmToken) continue;
            if (medicine.status === 'EXPIRED' || medicine.remainingQuantity <= 0) continue;
            
            const scheduleSlots = ['morning', 'afternoon', 'evening', 'night'];
            
            for (const slot of scheduleSlots) {
                const schedule = medicine.schedule[slot];
                
                if (schedule?.enabled && schedule.time === currentTime) {
                    await AlertService.createReminderAlert(medicine, slot);
                    console.log(`✅ Reminder created: ${medicine.name} - ${slot}`);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Reminder cron error:', error);
    }
});

console.log('🔔 Reminder cron job started - runs every minute');