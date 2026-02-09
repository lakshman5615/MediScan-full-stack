const Alert = require('../models/Alert');
const Medicine = require('../models/Medicine');
const DoseHistory = require('../models/doseHistory');
const ProductionFCMService = require('./production-fcm.service');

class AlertService {

  /* =====================================================
     1️⃣ CREATE REMINDER ALERT
  ===================================================== */
  static async createReminderAlert(medicine, slot) {
    const today = new Date().toISOString().split('T')[0];

    // ✅ UniqueKey: medicineId + slot + date (time nahi - taaki duplicate na bane)
    const uniqueKey = `${medicine._id}_${slot}_${today}`;

    const existing = await Alert.findOne({ uniqueKey });
    if (existing) {
      console.log(`⏭️ Reminder alert already exists for ${medicine.name} (${slot} today)`);
      return existing;
    }

    console.log(`💾 Creating alert in database for ${medicine.name}...`);
    const alert = await Alert.create({
      userId: medicine.userId,
      type: 'REMINDER',
      medicineId: medicine._id,
      medicineName: medicine.name,
      dosage: medicine.dosage,
      actionRequired: true,
      meta: { scheduledTime: slot },
      uniqueKey
    });
    console.log(`✅ Alert created with ID: ${alert._id}`);

    // ✅ Check user FCM token
    const User = require('../models/User');
    const user = await User.findById(medicine.userId);
    console.log(`👤 User FCM Token: ${user?.fcmToken ? `EXISTS (${user.fcmToken.length} chars)` : 'NOT FOUND'}`);
    if (!user?.fcmToken || user.fcmToken.length < 50) {
      console.log(`⚠️ No valid FCM token - Alert created but notification not sent`);
      return alert;
    }

    console.log(`📤 Sending FCM notification for ${medicine.name}...`);
    try {
      // ✅ Pass alertId to prevent duplicate alert creation
      await ProductionFCMService.sendReminderWithActions(
        medicine.userId._id || medicine.userId,
        '💊 Medicine Reminder',
        `Time to take ${medicine.name} (${slot})`,
        {
          alertId: alert._id, // ✅ Pass existing alert ID
          medicineId: medicine._id,
          medicineName: medicine.name,
          dosage: medicine.dosage,
          scheduledTime: slot
        }
      );
      console.log(`✅ FCM notification sent for ${medicine.name}`);
    } catch (fcmError) {
      console.error(`❌ FCM notification failed for ${medicine.name}:`, fcmError.message);
      console.log(`⚠️ Alert saved to DB but not delivered to device`);
    }

    return alert;
  }


  /* =====================================================
     2️⃣ CREATE EXPIRY ALERT
  ===================================================== */
  static async createExpiryAlert(medicine) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const expiryDate = new Date(medicine.expiryDate);
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    let severity = 'NORMAL';
    if (daysLeft <= 0) severity = 'CRITICAL';
    else if (daysLeft <= 5) severity = 'WARNING';

    // ✅ UniqueKey: medicineId + today's date (din me 1 baar)
    const uniqueKey = `EXPIRY_${medicine._id}_${todayStr}`;
    const existing = await Alert.findOne({ uniqueKey });
    if (existing) {
      console.log(`⏭️ Expiry alert already exists for ${medicine.name} today`);
      return existing;
    }

    const alert = await Alert.create({
      userId: medicine.userId,
      type: 'EXPIRY',
      medicineId: medicine._id,
      medicineName: medicine.name,
      status: 'PENDING',
      actionRequired: false,
      severity,
      meta: { expiryDate },
      uniqueKey
    });

    await this.sendExpiryNotification(alert, daysLeft);
    return alert;
  }

  /* =====================================================
     3️⃣ CREATE LOW STOCK ALERT
  ===================================================== */
  static async createLowStockAlert(medicine) {
    const today = new Date().toISOString().split('T')[0];
    // ✅ UniqueKey: medicineId + date (quantity nahi - taaki har dose pe duplicate na bane)
    const uniqueKey = `LOW_STOCK_${medicine._id}_${today}`;
    
    const existing = await Alert.findOne({ uniqueKey });
    if (existing) {
      console.log(`⏭️ Low stock alert already exists for ${medicine.name} today`);
      return existing;
    }

    const alert = await Alert.create({
      userId: medicine.userId,
      type: 'LOW_STOCK',
      medicineId: medicine._id,
      medicineName: medicine.name,
      status: 'PENDING',
      actionRequired: false,
      severity: 'WARNING',
      meta: {
        stockLeft: medicine.remainingQuantity,
        threshold: medicine.lowStockThreshold
      },
      uniqueKey
    });

    await this.sendLowStockNotification(alert, medicine);
    return alert;
  }

  /* =====================================================
     4️⃣ HANDLE ACTION (FROM UI OR NOTIFICATION)
  ===================================================== */
  static async handleAction(alertId, action, userId) {
    const alert = await Alert.findOne({ _id: alertId, userId });
    if (!alert || alert.status !== 'PENDING') return alert;

    alert.status = action;
    alert.resolvedAt = new Date();
    alert.showInUI = false;
    await alert.save();

    if (alert.type === 'REMINDER') {
      await DoseHistory.create({
        userId,
        medicineId: alert.medicineId,
        medicineName: alert.medicineName,
        scheduledTime: alert.meta.scheduledTime,
        scheduledAt: new Date(),
        status: action
      });

      if (action === 'TAKEN') {
        await Medicine.findByIdAndUpdate(alert.medicineId, {
          $inc: { remainingQuantity: -1 }
        });
      }
    }

    return alert;
  }

  /* =====================================================
     5️⃣ FCM NOTIFICATIONS
  ===================================================== */

  static async sendReminderNotification(alert) {
    try {
      await ProductionFCMService.sendNotification(
        alert.userId,
        '💊 Medicine Reminder',
        `Time to take ${alert.medicineName} (${alert.meta.scheduledTime.toUpperCase()})`,
        {
          alertId: alert._id.toString(),
          type: 'REMINDER',
          actions: JSON.stringify([
            { action: 'TAKEN', title: '✅ Taken' },
            { action: 'MISSED', title: '❌ Missed' }
          ])
        }
      );

      alert.sentToDevice = true;
      await alert.save();
    } catch (err) {
      console.error('Reminder FCM failed:', err);
    }
  }

  static async sendExpiryNotification(alert, daysLeft) {
    try {
      let title, message;
      
      if (daysLeft <= 0) {
        title = '🚨 Medicine EXPIRED';
        message = `${alert.medicineName} has EXPIRED today. Do not take this medicine!`;
      } else if (daysLeft === 1) {
        title = '⚠️ Expires Tomorrow';
        message = `${alert.medicineName} expires tomorrow. Use it soon or discard.`;
      } else {
        title = '⚠️ Expiry Alert';
        message = `${alert.medicineName} expires in ${daysLeft} days`;
      }

      // ✅ sendNotificationWithAlert ko proper data pass karo
      await ProductionFCMService.sendNotificationWithAlert(
        alert.userId,
        {
          title,
          message,
          alertType: 'EXPIRY',
          type: 'expiry_alert',
          medicineId: alert.medicineId,
          medicineName: alert.medicineName,
          severity: alert.severity,
          meta: { expiryDate: alert.meta.expiryDate, daysLeft },
          alertId: alert._id
        }
      );

      alert.sentToDevice = true;
      await alert.save();
    } catch (err) {
      console.error('❌ Expiry FCM failed:', err);
    }
  }

  static async sendLowStockNotification(alert, medicine) {
    try {
      // ✅ sendNotificationWithAlert ko proper data pass karo
      await ProductionFCMService.sendNotificationWithAlert(
        alert.userId,
        {
          title: '📦 Low Stock Alert',
          message: `${alert.medicineName} is running low (${medicine.remainingQuantity} left)`,
          alertType: 'LOW_STOCK',
          type: 'low_stock',
          medicineId: alert.medicineId,
          medicineName: alert.medicineName,
          severity: alert.severity,
          meta: {
            stockLeft: medicine.remainingQuantity,
            threshold: medicine.lowStockThreshold
          }
        }
      );

      alert.sentToDevice = true;
      await alert.save();
    } catch (err) {
      console.error('❌ Low stock FCM failed:', err);
    }
  }
}

module.exports = AlertService;
