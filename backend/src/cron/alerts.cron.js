const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const ProductionFCMService = require('../services/production-fcm.service');

// Medicine reminder notifications (every minute)
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDay = now.getDay();
    const currentDate = now.getDate();

    const medicines = await Medicine.find({
      quantity: { $gt: 0 },
      'schedule.time': currentTime
    }).populate('userId');

    for (const med of medicines) {
      const { schedule, medicineName, userId, _id } = med;
      if (!userId) continue;

      // DAILY
      if (schedule.frequency === 'daily') {
        await ProductionFCMService.sendNotification(
          userId._id,
          '💊 Medicine Reminder',
          `${medicineName} lene ka time ho gaya`,
          { medicineId: _id }
        );
      }

      // WEEKLY
      if (
        schedule.frequency === 'weekly' &&
        schedule.day === currentDay
      ) {
        await ProductionFCMService.sendNotification(
          userId._id,
          '💊 Weekly Reminder',
          `${medicineName} ka weekly dose time`,
          { medicineId: _id }
        );
      }

      // MONTHLY
      if (
        schedule.frequency === 'monthly' &&
        schedule.date === currentDate
      ) {
        await ProductionFCMService.sendNotification(
          userId._id,
          '💊 Monthly Reminder',
          `${medicineName} ka monthly dose time`,
          { medicineId: _id }
        );
      }
    }

    console.log('✅ Medicine reminders checked at', currentTime);

  } catch (err) {
    console.error('❌ Medicine reminder cron error:', err);
  }
});

// Low quantity and expiry alerts (every hour)
cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

    // Low quantity alerts (≤2 doses)
    const lowQuantityMedicines = await Medicine.find({
      quantity: { $lte: 2, $gt: 0 }
    }).populate('userId');

    for (const med of lowQuantityMedicines) {
      if (!med.userId) continue;
      
      await ProductionFCMService.sendNotification(
        med.userId._id,
        '⚠️ Low Stock Alert',
        `${med.medicineName} ki quantity kam hai (${med.quantity} doses left)`,
        { medicineId: med._id, type: 'low_quantity' }
      );
    }

    // Expiry alerts (≤7 days)
    const expiringMedicines = await Medicine.find({
      expiryDate: { $lte: sevenDaysFromNow },
      quantity: { $gt: 0 }
    }).populate('userId');

    for (const med of expiringMedicines) {
      if (!med.userId) continue;
      
      const daysLeft = Math.ceil((med.expiryDate - now) / (1000 * 60 * 60 * 24));
      
      await ProductionFCMService.sendNotification(
        med.userId._id,
        '📅 Expiry Alert',
        `${med.medicineName} ${daysLeft} din mein expire ho jayegi`,
        { medicineId: med._id, type: 'expiry_warning' }
      );
    }

    console.log('✅ Low quantity and expiry alerts checked at', now.toLocaleTimeString());

  } catch (err) {
    console.error('❌ Alert cron error:', err);
  }
});