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
        
        // Find all medicines with enabled schedules
        const medicines = await Medicine.find({}).populate('userId', 'fcmToken');
        
        for (const medicine of medicines) {
            if (!medicine.userId?.fcmToken) continue;
            
            const scheduleSlots = ['morning', 'afternoon', 'evening', 'night'];
            
            for (const slot of scheduleSlots) {
                const schedule = medicine.schedule[slot];
                
                // Skip if not enabled or time doesn't match
                if (!schedule?.enabled || schedule.time !== currentTime) continue;
                
                // Check if reminder already sent today
                const reminderKey = `${medicine._id}_${slot}_${today}`;
                const existingNotification = await Notification.findOne({
                    userId: medicine.userId._id,
                    medicineId: medicine._id,
                    type: 'medicine_reminder',
                    createdAt: {
                        $gte: new Date(today),
                        $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
                    },
                    message: { $regex: slot, $options: 'i' }
                });
                
                if (existingNotification) {
                    console.log(`⏭️ Reminder already sent for ${medicine.name} - ${slot}`);
                    continue;
                }
                
                // Skip if expired
                if (medicine.status === 'EXPIRED') {
                    console.log(`⚠️ Skipping expired medicine: ${medicine.name}`);
                    continue;
                }
                
                // Skip if out of stock
                if (medicine.remainingQuantity <= 0) {
                    console.log(`📦 Skipping out of stock medicine: ${medicine.name}`);
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