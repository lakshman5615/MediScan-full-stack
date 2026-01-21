const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const FCMService = require('../services/fcm.service');

// Schedule reminder cron job - runs every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
    
    // Find medicines with matching schedule time and quantity > 0
    const medicines = await Medicine.find({
      'schedule.time': currentTime,
      quantity: { $gt: 0 }
    });
    
    // Send FCM notifications
    for (const medicine of medicines) {
      await FCMService.sendScheduleReminder(
        medicine.userId,
        medicine.medicineName, 
        medicine.schedule.time
      );
    }
    
    if (medicines.length > 0) {
      console.log(`Sent ${medicines.length} schedule reminders at ${currentTime}`);
    }
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

// Daily expiry check - runs at 12:00 AM
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    const fiveDaysLater = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
    
    const expiringSoon = await Medicine.find({
      expiryDate: { $lte: fiveDaysLater },
      quantity: { $gt: 0 }
    });
    
    for (const medicine of expiringSoon) {
      const daysLeft = Math.ceil((medicine.expiryDate - today) / (1000 * 60 * 60 * 24));
      await FCMService.sendExpiryAlert(medicine.userId, medicine.medicineName, daysLeft);
    }
    
    console.log(`Checked expiry for ${expiringSoon.length} medicines`);
  } catch (error) {
    console.error('Expiry cron error:', error);
  }
});

console.log('Medicine reminder cron jobs started');

module.exports = {};