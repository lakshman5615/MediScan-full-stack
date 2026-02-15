// ❌ DISABLED - Using alerts.cron.js instead to prevent duplicates
// This file is kept for reference only

console.log('⚠️ medicine-reminder.cron.js is DISABLED - Using alerts.cron.js instead');

// OLD CODE (Commented for backup)
/*
const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const Notification = require('../models/Notification');
const ProductionFCMService = require('../services/production-fcm.service');

// Run every minute to check for medicine reminders
cron.schedule('* * * * *', async () => {
    try {
        console.log('🔔 Checking medicine reminders...');
        
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
        const today = now.toDateString();
        
        // Find medicines with enabled schedules and valid users
        const medicines = await Medicine.find({
            $or: [
                { 'schedule.morning.enabled': true },
                { 'schedule.afternoon.enabled': true },
                { 'schedule.evening.enabled': true },
                { 'schedule.night.enabled': true }
            ],
            remainingQuantity: { $gt: 0 },
            expiryDate: { $gte: today }
        }).populate('userId', 'fcmToken');
        
        for (const medicine of medicines) {
            if (!medicine.userId?.fcmToken) continue;
            
            const scheduleSlots = ['morning', 'afternoon', 'evening', 'night'];
            
            for (const slot of scheduleSlots) {
                const schedule = medicine.schedule[slot];
                
                // Skip if not enabled or time doesn't match
                if (!schedule?.enabled || schedule.time !== currentTime) continue;
                
                // Check if reminder already sent today (batch check will be added later)
                const todayStart = new Date(today);
                const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
                
                const existingNotification = await Notification.findOne({
                    userId: medicine.userId._id,
                    medicineId: medicine._id,
                    type: 'medicine_reminder',
                    createdAt: { $gte: todayStart, $lt: todayEnd },
                    message: { $regex: slot, $options: 'i' }
                });
                
                if (existingNotification) {
                    console.log(`⏭️ Reminder already sent for ${medicine.name} - ${slot}`);
                    continue;
                }
                
                // Additional safety checks (already filtered in query)
                if (medicine.remainingQuantity <= 0 || new Date(medicine.expiryDate) < new Date(today)) {
                    continue;
                }
                
                // Send reminder notification
                const title = '💊 Medicine Reminder';
                const message = `Time to take ${medicine.name} (${slot.toUpperCase()})`;
                
                try {
                    // Send FCM notification with action buttons
                    await ProductionFCMService.sendNotification(
                        medicine.userId._id,
                        title,
                        message,
                        {
                            medicineId: medicine._id.toString(),
                            scheduledTime: slot,
                            type: 'medicine_reminder',
                            actions: JSON.stringify([
                                { action: 'taken', title: 'TAKEN' },
                                { action: 'missed', title: 'MISSED' }
                            ])
                        }
                    );
                    
                    // Store notification in database with alert fields
                    await Notification.create({
                        userId: medicine.userId._id,
                        medicineId: medicine._id,
                        title,
                        message: `${message} - ${schedule.time}`,
                        type: 'medicine_reminder',
                        alertType: 'REMINDER',
                        status: 'PENDING',
                        severity: 'NORMAL',
                        showInUI: true,
                        deliveryStatus: 'delivered'
                    });
                    
                    // Update last reminder sent
                    medicine.lastReminderSent = now;
                    await medicine.save();
                    
                    console.log(`✅ Reminder sent: ${medicine.name} - ${slot} at ${currentTime}`);
                    
                } catch (notificationError) {
                    console.error(`❌ Failed to send reminder for ${medicine.name}:`, notificationError);
                    
                    // Store failed notification
                    await Notification.create({
                        userId: medicine.userId._id,
                        medicineId: medicine._id,
                        title,
                        message,
                        type: 'medicine_reminder',
                        deliveryStatus: 'failed'
                    });
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Medicine reminder cron error:', error);
    }
});

console.log('🔔 Medicine reminder cron job started - runs every minute');
*/
