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

    // 🔍 CHECK: Medicine abhi abhi create hui hai? (last 30 seconds me)
    // ⚠️ ONLY for NEW medicines - not for UPDATED medicines
    const medicineAge = Date.now() - new Date(medicine.createdAt).getTime();
    const updateAge = Date.now() - new Date(medicine.updatedAt).getTime();
    const twoMinutes = 2 * 60 * 1000; // 2 minutes protection
    
    // Skip only if medicine is NEW (createdAt = updatedAt) and just created
    const isNewMedicine = Math.abs(new Date(medicine.createdAt) - new Date(medicine.updatedAt)) < 1000;
    
    if (isNewMedicine && medicineAge < twoMinutes) {
      console.log(`⏭️ Medicine ${medicine.name} was just created (${Math.floor(medicineAge/1000)}s ago) - Skipping first reminder`);
      return null;
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
     🔍 YAHAN QUANTITY -1 HOTI HAI
  ===================================================== */
  static async handleAction(alertId, action, userId) {
    console.log(`\n🛠️ AlertService.handleAction() START:`);
    console.log(`   Alert ID: ${alertId}`);
    console.log(`   Action: ${action}`);
    console.log(`   User ID: ${userId}`);
    
    // 🔍 STEP 1: Alert database se fetch karo
    const alert = await Alert.findOne({ _id: alertId, userId });
    if (!alert) {
      console.log(`❌ Alert not found in database`);
      return null;
    }
    
    console.log(`📋 Alert found:`);
    console.log(`   Medicine: ${alert.medicineName}`);
    console.log(`   Type: ${alert.type}`);
    console.log(`   Current Status: ${alert.status}`);
    console.log(`   ShowInUI: ${alert.showInUI}`);
    
    // 🔍 STEP 2: Check if already resolved (DUPLICATE PREVENTION)
    if (alert.status !== 'PENDING') {
      console.log(`⏭️ Alert already resolved with status: ${alert.status}`);
      console.log(`⚠️ SKIPPING - No quantity change\n`);
      return alert;
    }

    // Guard: expired medicine ke reminder ko TAKEN/MISSED allow mat karo
    if (alert.type === 'REMINDER' && (action === 'TAKEN' || action === 'MISSED')) {
      const medicineForValidation = await Medicine.findById(alert.medicineId).select('expiryDate');
      if (!medicineForValidation) {
        throw new Error('Medicine not found for this alert');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiryDate = new Date(medicineForValidation.expiryDate);
      expiryDate.setHours(0, 0, 0, 0);

      if (expiryDate < today) {
        throw new Error('Cannot mark dose as TAKEN or MISSED for expired medicine');
      }
    }

    // 🔍 STEP 3: Update alert status and hide from UI
    console.log(`🔄 Updating alert status to: ${action}`);
    alert.status = action;
    alert.resolvedAt = new Date();
    alert.showInUI = false; // 🔍 YAHAN ALERT UI SE HAT JAYEGA
    await alert.save();
    console.log(`✅ Alert updated - showInUI = false`);

    // 🔍 STEP 4: REMINDER type ke liye dose history aur quantity update
    if (alert.type === 'REMINDER') {
      console.log(`💊 REMINDER type - Checking dose history...`);
      
      // Check if dose history already exists for this specific scheduledTime today
      const existingDose = await DoseHistory.findOne({
        userId,
        medicineId: alert.medicineId,
        scheduledTime: alert.meta.scheduledTime,
        scheduledAt: { 
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
      });

      if (!existingDose) {
        console.log(`🆕 Creating new dose history...`);
        await DoseHistory.create({
          userId,
          medicineId: alert.medicineId,
          medicineName: alert.medicineName,
          scheduledTime: alert.meta.scheduledTime,
          scheduledAt: new Date(),
          status: action
        });
        console.log(`✅ Dose history created`);

        // 🔍 STEP 5: YAHAN QUANTITY -1 HOTI HAI (sirf TAKEN action pe)
        if (action === 'TAKEN') {
          console.log(`🔽 Decreasing medicine quantity by 1...`);
          const medicine = await Medicine.findByIdAndUpdate(
            alert.medicineId, 
            { $inc: { remainingQuantity: -1 } },
            { new: true }
          );
          console.log(`✅ Medicine quantity updated:`);
          console.log(`   Medicine: ${medicine.name}`);
          console.log(`   New Quantity: ${medicine.remainingQuantity}`);
        } else {
          console.log(`⏭️ Action is MISSED - No quantity change`);
        }
      } else {
        console.log(`⏭️ Dose history already exists for ${alert.medicineName} (${alert.meta.scheduledTime}) today`);
        console.log(`⚠️ SKIPPING - No quantity change\n`);
      }
    }
    
    console.log(`✅ AlertService.handleAction() COMPLETE\n`);
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
