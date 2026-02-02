
 const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const ProductionFCMService = require('../services/production-fcm.service');


// ----------------------
// Medicine Reminders (every minute) - DISABLED (using alerts.cron.js instead)
// ----------------------
/*
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

    console.log('✅ Notifications checked at', currentTime);

  } catch (err) {
    console.error('❌ Cron error:', err);
  }
});
*/