const Alert = require('../models/Alert');
const Medicine = require('../models/Medicine');
const DoseHistory = require('../models/doseHistory');
const ProductionFCMService = require('./production-fcm.service');

class AlertService {

  /* =====================================================
     1️⃣ CREATE REMINDER ALERT
  ===================================================== */
 async createReminderAlert(medicine, slot) {
  const today = new Date().toISOString().split('T')[0];

  const uniqueKey = `${medicine._id}_${slot}_${today}`;

  const existing = await Alert.findOne({ uniqueKey });
  if (existing) return;

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

  await ProductionFCMService.sendReminderWithActions(
    medicine.userId._id,
    '💊 Medicine Reminder',
    `Time to take ${medicine.name} (${slot})`,
    {
      alertId: alert._id,
      medicineId: medicine._id,
      medicineName: medicine.name
    }
  );

  return alert;
}


  /* =====================================================
     2️⃣ CREATE EXPIRY ALERT
  ===================================================== */
  static async createExpiryAlert(medicine) {
    const today = new Date();
    const expiryDate = new Date(medicine.expiryDate);
    const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    let severity = 'NORMAL';
    if (daysLeft <= 0) severity = 'CRITICAL';
    else if (daysLeft <= 7) severity = 'WARNING';

    const uniqueKey = `EXPIRY_${medicine._id}_${expiryDate.toDateString()}`;
    const existing = await Alert.findOne({ uniqueKey });
    if (existing) return existing;

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
    const uniqueKey = `LOW_STOCK_${medicine._id}_${medicine.remainingQuantity}`;
    const existing = await Alert.findOne({ uniqueKey });
    if (existing) return existing;

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

async handleAction(alertId, action, userId) {
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
      const title = daysLeft <= 0 ? '🚨 Medicine Expired' : '⚠️ Expiry Alert';
      const message =
        daysLeft <= 0
          ? `${alert.medicineName} has expired`
          : `${alert.medicineName} expires in ${daysLeft} days`;

      await ProductionFCMService.sendNotification(
        alert.userId,
        title,
        message,
        {
          alertId: alert._id.toString(),
          type: 'EXPIRY'
        }
      );

      alert.sentToDevice = true;
      await alert.save();
    } catch (err) {
      console.error('Expiry FCM failed:', err);
    }
  }

  static async sendLowStockNotification(alert, medicine) {
    try {
      await ProductionFCMService.sendNotification(
        alert.userId,
        '📦 Low Stock Alert',
        `${alert.medicineName} is running low (${medicine.remainingQuantity} left)`,
        {
          alertId: alert._id.toString(),
          type: 'LOW_STOCK'
        }
      );

      alert.sentToDevice = true;
      await alert.save();
    } catch (err) {
      console.error('Low stock FCM failed:', err);
    }
  }
}

module.exports = AlertService;
