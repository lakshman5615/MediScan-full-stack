const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const ProductionFCMService = require('../services/production-fcm.service');
const NotificationMessages = require('../config/notification-messages');

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

      let title, message;

      switch (schedule.frequency) {
        case 'daily':
          title = NotificationMessages.medicineReminder.title;
          message = NotificationMessages.medicineReminder.getMessage(medicineName, currentTime);
          break;

        case 'weekly':
          if (schedule.day !== currentDay) continue;
          title = NotificationMessages.weeklyReminder.title;
          message = NotificationMessages.weeklyReminder.getMessage(medicineName, currentTime);
          break;

        case 'monthly':
          if (schedule.date !== currentDate) continue;
          title = NotificationMessages.monthlyReminder.title;
          message = NotificationMessages.monthlyReminder.getMessage(medicineName, currentTime);
          break;

        default:
          continue;
      }

      await ProductionFCMService.sendNotification(userId._id, title, message, { medicineId: _id });
    }

    console.log('✅ Notifications checked at', currentTime);

  } catch (err) {
    console.error('❌ Cron error:', err);
  }
});
