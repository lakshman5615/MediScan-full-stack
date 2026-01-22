const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const FCMService = require('../services/fcm.service');
const User = require('../models/User');

// Medicine reminder cron job - runs every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
    
    // Find medicines with matching schedule time and quantity > 0
    const medicines = await Medicine.find({
      'schedule.time': currentTime,
      quantity: { $gt: 0 }
    }).populate('userId');
    
    // Send mobile notifications
    for (const medicine of medicines) {
      if (medicine.userId && medicine.userId.phone) {
        // Send FCM notification to mobile
        await FCMService.sendNotificationByPhone(
          medicine.userId.phone,
          '💊 Medicine Time!',
          `${medicine.medicineName} lene ka time ho gaya hai (${medicine.schedule.time})`
        );
        
        // Reduce quantity after reminder
        medicine.quantity -= 1;
        await medicine.save();
        
        // Check for low stock
        if (medicine.quantity <= 2 && medicine.quantity > 0) {
          await FCMService.sendNotificationByPhone(
            medicine.userId.phone,
            '⚠️ Low Stock Alert',
            `${medicine.medicineName} stock low! Sirf ${medicine.quantity} doses bachi hain.`
          );
        }
      }
    }
    
    if (medicines.length > 0) {
      console.log(`📱 Sent ${medicines.length} mobile notifications at ${currentTime}`);
    }
  } catch (error) {
    console.error('Medicine reminder cron error:', error);
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
      const user = await User.findById(medicine.userId);
      if (user && user.phone) {
        const daysLeft = Math.ceil((medicine.expiryDate - today) / (1000 * 60 * 60 * 24));
        await FCMService.sendNotificationByPhone(
          user.phone,
          '⏰ Expiry Alert',
          `Alert! ${medicine.medicineName} ${daysLeft} din me expire ho rahi hai.`
        );
      }
    }
    
    console.log(`Checked expiry for ${expiringSoon.length} medicines`);
  } catch (error) {
    console.error('Expiry cron error:', error);
  }
});

console.log('Medicine reminder cron jobs started');

module.exports = {};