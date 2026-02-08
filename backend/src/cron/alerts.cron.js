// ============================================
// CRON JOBS - Automatic Alerts System
// ============================================
const cron = require('node-cron');
const Medicine = require('../models/Medicine');
const AlertService = require('../services/alert.service'); // ✅ AlertService use kar rahe hain proper alert creation ke liye

const reminderInterval = 24 * 60 * 60 * 1000; // 1 day

// ============================================
// Medicine Reminders (every minute check hota hai)
// ============================================
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
      if (!userId) {
        console.log(`⚠️ Skipping ${name} - No user found`);
        continue;
      }

      // ⚠️ Duplicate prevention - 1 hour cooldown
      if (lastReminderSent && now - lastReminderSent < 60 * 60 * 1000) {
        console.log(`⏭️ Skipping ${name} - Already sent within 1 hour`);
        continue;
      }

      // Determine which schedule slot matched
      let scheduleType = '';
      if (schedule.morning.enabled && schedule.morning.time === currentTime) scheduleType = 'Morning';
      else if (schedule.afternoon.enabled && schedule.afternoon.time === currentTime) scheduleType = 'Afternoon';
      else if (schedule.evening.enabled && schedule.evening.time === currentTime) scheduleType = 'Evening';
      else if (schedule.night.enabled && schedule.night.time === currentTime) scheduleType = 'Night';

      if (!scheduleType) {
        console.log(`⚠️ No schedule type matched for ${name}`);
        continue;
      }

      // ✅ AlertService.createReminderAlert() use kar rahe hain
      // Yeh automatically Alert + Notification + FCM sab create kar deta hai
      console.log(`🔔 Creating reminder alert for ${name} (${scheduleType})...`);
      
      try {
        await AlertService.createReminderAlert(med, scheduleType.toLowerCase());
        console.log(`✅ Reminder alert created successfully for ${name}`);
      } catch (alertError) {
        console.error(`❌ Failed to create reminder alert for ${name}:`, alertError);
      }

      // Update lastReminderSent to prevent duplicate alerts
      med.lastReminderSent = now;
      await med.save();
    }

    console.log('✅ Medicine reminders checked at', currentTime);
  } catch (err) {
    console.error('❌ Medicine reminder cron error:', err);
  }
});

// ============================================
// Low Quantity & Expiry Alerts (every hour check hota hai)
// ============================================
cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();
    const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // ✅ 5 din baad

    console.log(`🔍 Checking low stock & expiry alerts at ${now.toLocaleTimeString()}`);

    // ============================================
    // ✅ Low Stock Alerts - Use medicine's lowStockThreshold
    // ============================================
    const lowQuantityMedicines = await Medicine.find({
      $expr: { 
        $and: [
          { $lte: ['$remainingQuantity', '$lowStockThreshold'] },
          { $gt: ['$remainingQuantity', 0] }
        ]
      }
    }).populate('userId');

    console.log(`📦 Found ${lowQuantityMedicines.length} low stock medicines`);

    for (const med of lowQuantityMedicines) {
      if (!med.userId) continue;

      // ✅ Din me 1 baar - 24 hour cooldown
      const lowStockInterval = 24 * 60 * 60 * 1000;
      if (med.lastLowStockAlert && now - med.lastLowStockAlert < lowStockInterval) {
        console.log(`⏭️ Skipping ${med.name} - Low stock alert already sent today`);
        continue;
      }

      console.log(`🔔 Creating low stock alert for ${med.name} (${med.remainingQuantity}/${med.lowStockThreshold})`);
      
      try {
        await AlertService.createLowStockAlert(med);
        console.log(`✅ Low stock alert created for ${med.name}`);
        
        med.lastLowStockAlert = now;
        await med.save();
      } catch (err) {
        console.error(`❌ Failed to create low stock alert for ${med.name}:`, err);
      }
    }

    // ============================================
    // ✅ Expiry Alerts - 5 din baaki (din me 1 baar) + Expiry day alert
    // ============================================
    const expiringMedicines = await Medicine.find({
      expiryDate: { $gt: now, $lte: fiveDaysFromNow }, // ✅ 5 din ke andar expire hone wali
      remainingQuantity: { $gt: 0 }
    }).populate('userId');

    console.log(`📅 Found ${expiringMedicines.length} expiring medicines (within 5 days)`);

    for (const med of expiringMedicines) {
      if (!med.userId) continue;

      const daysLeft = Math.ceil((med.expiryDate - now) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 0) continue; // Already expired

      // ✅ Din me 1 baar - 24 hour cooldown
      if (med.lastExpiryAlert && now - med.lastExpiryAlert < 24 * 60 * 60 * 1000) {
        console.log(`⏭️ Skipping ${med.name} - Expiry alert already sent today`);
        continue;
      }

      console.log(`🔔 Creating expiry alert for ${med.name} (${daysLeft} days left)`);
      
      try {
        await AlertService.createExpiryAlert(med);
        console.log(`✅ Expiry alert created for ${med.name}`);
        
        med.lastExpiryAlert = now;
        await med.save();
      } catch (err) {
        console.error(`❌ Failed to create expiry alert for ${med.name}:`, err);
      }
    }

    // ============================================
    // ✅ EXPIRED TODAY - Final warning
    // ============================================
    const expiredToday = await Medicine.find({
      expiryDate: { $lte: now }, // Already expired
      remainingQuantity: { $gt: 0 }
    }).populate('userId');

    console.log(`🚨 Found ${expiredToday.length} expired medicines`);

    for (const med of expiredToday) {
      if (!med.userId) continue;

      // ✅ Check if already sent today
      const todayStr = now.toISOString().split('T')[0];
      const lastAlertDate = med.lastExpiryAlert ? new Date(med.lastExpiryAlert).toISOString().split('T')[0] : null;
      
      if (lastAlertDate === todayStr) {
        console.log(`⏭️ Skipping ${med.name} - Expired alert already sent today`);
        continue;
      }

      console.log(`🔔 Creating EXPIRED alert for ${med.name}`);
      
      try {
        await AlertService.createExpiryAlert(med);
        console.log(`✅ Expired alert created for ${med.name}`);
        
        med.lastExpiryAlert = now;
        await med.save();
      } catch (err) {
        console.error(`❌ Failed to create expired alert for ${med.name}:`, err);
      }
    }

    console.log('✅ Low quantity and expiry alerts checked at', now.toLocaleTimeString());

  } catch (err) {
    console.error('❌ Alert cron error:', err);
  }
});
