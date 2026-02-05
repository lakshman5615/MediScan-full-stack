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

    // Find medicines with active schedules for current time
    const medicines = await Medicine.find({
      remainingQuantity: { $gt: 0 },
      $or: [
        { 'schedule.morning.enabled': true, 'schedule.morning.time': currentTime },
        { 'schedule.afternoon.enabled': true, 'schedule.afternoon.time': currentTime },
        { 'schedule.evening.enabled': true, 'schedule.evening.time': currentTime },
        { 'schedule.night.enabled': true, 'schedule.night.time': currentTime }
      ]
    }).populate('userId');

    console.log(`💊 Found ${medicines.length} medicines scheduled for ${currentTime}`);
    
    if (medicines.length > 0) {
      console.log('Medicines:', medicines.map(m => ({ 
        name: m.name, 
        time: currentTime,
        user: m.userId?.name 
      })));
    }

    for (const med of medicines) {
      const { schedule, name, userId, _id, lastReminderSent } = med;
      if (!userId) continue;

      // Prevent duplicate reminders (within 1 hour)
      if (lastReminderSent && now - lastReminderSent < 60 * 60 * 1000) continue;

      // Determine which schedule slot matched
      let scheduleType = '';
      if (schedule.morning.enabled && schedule.morning.time === currentTime) scheduleType = 'Morning';
      else if (schedule.afternoon.enabled && schedule.afternoon.time === currentTime) scheduleType = 'Afternoon';
      else if (schedule.evening.enabled && schedule.evening.time === currentTime) scheduleType = 'Evening';
      else if (schedule.night.enabled && schedule.night.time === currentTime) scheduleType = 'Night';

      if (scheduleType) {
        await ProductionFCMService.sendReminderWithActions(
          userId._id,
          `💊 ${scheduleType} Medicine Reminder`,
          `It's time to take your medicine: ${name}`,
          { 
            medicineId: _id,
            medicineName: name,
            userId: userId._id
          }
        );

        // Update lastReminderSent
        med.lastReminderSent = now;
        await med.save();
      }
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

    // ----- Low Quantity Alerts (≤ lowStockThreshold) -----
    const lowQuantityMedicines = await Medicine.find({
      $expr: { $lte: ['$remainingQuantity', '$lowStockThreshold'] },
      remainingQuantity: { $gt: 0 }
    }).populate('userId');

    for (const med of lowQuantityMedicines) {
      if (!med.userId) continue;

      const lowStockInterval = 24 * 60 * 60 * 1000; // 1 day
      if (med.lastLowStockAlert && now - med.lastLowStockAlert < lowStockInterval) continue;

      await ProductionFCMService.sendNotification(
        med.userId._id,
        '⚠️ Low Stock Alert',
        `Low stock for medicine: ${med.name} (${med.remainingQuantity} doses left)`,
        { medicineId: med._id, type: 'low_quantity' }
      );
      
      // Store in notifications for UI
      await require('../models/Notification').create({
        userId: med.userId._id,
        medicineId: med._id,
        title: '⚠️ Low Stock Alert',
        message: `Low stock for medicine: ${med.name} (${med.remainingQuantity} doses left)`,
        medicineId: med._id,
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
      remainingQuantity: { $gt: 0 }
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
        `${med.name} will expire in ${daysLeft} day(s)`,
        { medicineId: med._id, type: 'expiry_warning' }
      );
      
      // Store in notifications for UI
      const severity = daysLeft <= 1 ? 'CRITICAL' : 'WARNING';
      await require('../models/Notification').create({
        userId: med.userId._id,
        medicineId: med._id,
        title: '📅 Expiry Alert',
        message: `${med.name} will expire in ${daysLeft} day(s)`,
        medicineId: med._id,
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
