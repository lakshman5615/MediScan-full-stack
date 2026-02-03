const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const ProductionFCMService = require('../services/production-fcm.service');

const reminderInterval = 24 * 60 * 60 * 1000; // 1 day

// ----------------------
// Medicine Reminders (every minute)
// ----------------------
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const currentDay = now.getDay();
    const currentDate = now.getDate();

    console.log(`🔍 Checking reminders at ${currentTime}`);

    const medicines = await Medicine.find({
      quantity: { $gt: 0 },
      'schedule.time': currentTime
    }).populate('userId');

    console.log(`💊 Found ${medicines.length} medicines scheduled for ${currentTime}`);
    
    if (medicines.length > 0) {
      console.log('Medicines:', medicines.map(m => ({ 
        name: m.medicineName, 
        time: m.schedule.time,
        user: m.userId?.name 
      })));
    }

    for (const med of medicines) {
      const { schedule, medicineName, userId, _id, lastReminderSent } = med;
      if (!userId) continue;

      // Prevent duplicate reminders
      if (lastReminderSent && now - lastReminderSent < reminderInterval) continue;

      // DAILY
      if (schedule.frequency === 'daily') {
        await ProductionFCMService.sendReminderWithActions(
          userId._id,
          '💊 Daily Medicine Reminder',
          `It's time to take your medicine: ${medicineName}`,
          { 
            medicineId: _id,
            medicineName: medicineName,
            userId: userId._id
          }
        );
      }

      // WEEKLY
      if (schedule.frequency === 'weekly' && schedule.day === currentDay) {
        await ProductionFCMService.sendReminderWithActions(
          userId._id,
          '💊 Weekly Medicine Reminder',
          `It's your weekly dose of: ${medicineName}`,
          { 
            medicineId: _id,
            medicineName: medicineName,
            userId: userId._id
          }
        );
      }

      // MONTHLY
      if (schedule.frequency === 'monthly' && schedule.date === currentDate) {
        await ProductionFCMService.sendReminderWithActions(
          userId._id,
          '💊 Monthly Medicine Reminder',
          `It's your monthly dose of: ${medicineName}`,
          { 
            medicineId: _id,
            medicineName: medicineName,
            userId: userId._id
          }
        );
      }

      // Update lastReminderSent
      med.lastReminderSent = now;
      await med.save();
    }

    console.log('✅ Medicine reminders checked at', currentTime);
  } catch (err) {
    console.error('❌ Medicine reminder cron error:', err);
  }
});

// ----------------------
// Low Quantity & Expiry Alerts (every hour)
// ----------------------
cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // ----- Low Quantity Alerts (≤2 doses) -----
    const lowQuantityMedicines = await Medicine.find({
      quantity: { $lte: 2, $gt: 0 }
    }).populate('userId');

    for (const med of lowQuantityMedicines) {
      if (!med.userId) continue;

      const lowStockInterval = 24 * 60 * 60 * 1000; // 1 day
      if (med.lastLowStockAlert && now - med.lastLowStockAlert < lowStockInterval) continue;

      await ProductionFCMService.sendNotification(
        med.userId._id,
        '⚠️ Low Stock Alert',
        `Low stock for medicine: ${med.medicineName} (${med.quantity} doses left)`,
        { medicineId: med._id, type: 'low_quantity' }
      );
      
      // Store in notifications for UI
      await require('../models/Notification').create({
        userId: med.userId._id,
        medicineId: med._id,
        title: '⚠️ Low Stock Alert',
        message: `Low stock for medicine: ${med.medicineName} (${med.quantity} doses left)`,
        type: 'low_stock',
        alertType: 'LOW_STOCK',
        status: 'PENDING',
        severity: 'WARNING',
        showInUI: true,
        deliveryStatus: 'delivered'
      });

      med.lastLowStockAlert = now;
      await med.save();
    }

    // ----- Expiry Alerts (≤7 days) -----
    const expiringMedicines = await Medicine.find({
      expiryDate: { $gt: now, $lte: sevenDaysFromNow }, // Only future dates
      quantity: { $gt: 0 }
    }).populate('userId');

    for (const med of expiringMedicines) {
      if (!med.userId) continue;

      const daysLeft = Math.ceil((med.expiryDate - now) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 0) continue; // Already expired

      // Prevent duplicate expiry alerts
      if (med.lastExpiryAlert && now - med.lastExpiryAlert < 24 * 60 * 60 * 1000) continue;

      await ProductionFCMService.sendNotification(
        med.userId._id,
        '📅 Expiry Alert',
        `${med.medicineName} will expire in ${daysLeft} day(s)`,
        { medicineId: med._id, type: 'expiry_warning' }
      );
      
      // Store in notifications for UI
      const severity = daysLeft <= 1 ? 'CRITICAL' : 'WARNING';
      await require('../models/Notification').create({
        userId: med.userId._id,
        medicineId: med._id,
        title: '📅 Expiry Alert',
        message: `${med.medicineName} will expire in ${daysLeft} day(s)`,
        type: 'expiry_alert',
        alertType: 'EXPIRY',
        status: 'PENDING',
        severity,
        showInUI: true,
        deliveryStatus: 'delivered'
      });

      med.lastExpiryAlert = now;
      await med.save();
    }

    console.log('✅ Low quantity and expiry alerts checked at', now.toLocaleTimeString());

  } catch (err) {
    console.error('❌ Alert cron error:', err);
  }
});
