// // Production-Ready Backend Notification System
// // src/services/production-fcm.service.js

// const Notification = require('../models/Notification');
// const User = require('../models/User');
// const messaging = require('../config/firebase');

// const MIN_FCM_TOKEN_LENGTH = 50;

// class ProductionFCMService {
  
//   // Send reminder notification with action buttons
//   async sendReminderWithActions(userId, title, message, medicineData = {}) {
//     try {
//       const user = await User.findById(userId);
      
//       if (!user) {
//         console.log(`❌ User not found: ${userId}`);
//         return { success: false, error: 'User not found' };
//       }
      
//       // Method 1: Real FCM with action buttons (if token exists)
//       if (user.fcmToken && user.fcmToken.length > MIN_FCM_TOKEN_LENGTH) {
//         const fcmResult = await this.sendReminderFCM(user.fcmToken, title, message, medicineData);
//         if (fcmResult.success) {
//           console.log(`✅ Reminder FCM with actions sent to ${user.name}: ${title}`);
//           return fcmResult;  // ✅ SUCCESS - Return here, no database save for successful FCM
//         }
//       }
      
//       // Method 2: Fallback - Console notification (only if FCM fails)
//       this.logReminderNotification(user, title, message, medicineData);
      
//       // Method 3: Database logging (only if FCM fails)
//       await this.saveNotificationToDatabase(userId, title, message, medicineData);
      
//       return { 
//         success: true, 
//         method: 'console+database',
//         message: 'Reminder notification logged with action data'
//       };
      
//     } catch (error) {
//       console.error('❌ Reminder notification error:', error);
//       return { success: false, error: error.message };
//     }
//   }
  
//   async sendReminderFCM(fcmToken, title, message, medicineData) {
//     try {
//       console.log(`📱 Attempting FCM send to token: ${fcmToken.length} chars`);
      
//       const timestamp = new Date();
//       const payload = {
//         notification: { title, body: message },
//         data: {
//           medicineId: String(medicineData.medicineId || ''),
//           medicineName: String(medicineData.medicineName || ''),
//           userId: String(medicineData.userId || ''),
//           type: 'medicine_reminder',
//           timestamp: timestamp.toISOString(),
//           showActions: 'true',
//           actionType: 'reminder'
//         },
//         token: fcmToken
//       };
      
//       const response = await messaging.send(payload);
      
//       console.log(`✅ REMINDER FCM SUCCESS:`, {
//         title,
//         messageId: response,
//         timestamp: timestamp.toLocaleTimeString()
//       });
      
//       return { 
//         success: true, 
//         messageId: response,
//         method: 'reminder_fcm_delivered'
//       };
      
//     } catch (error) {
//       console.error('🚨 REMINDER FCM FAILED:', error.message);
//       return { success: false, error: error.message };
//     }
//   }
  
//   // Console logging for reminder with action info
//   logReminderNotification(user, title, message, medicineData) {
//     console.log('\n🔔 MEDICINE REMINDER WITH ACTIONS:');
//     console.log(`👤 User: ${user.name} (${user.email})`);
//     console.log(`📱 Phone: ${user.phone}`);
//     console.log(`💊 Medicine: ${medicineData.medicineName || 'Unknown'}`);
//     console.log(`🆔 Medicine ID: ${medicineData.medicineId || 'Unknown'}`);
//     console.log(`📋 Title: ${title}`);
//     console.log(`💬 Message: ${message}`);
//     console.log(`⏰ Time: ${new Date().toLocaleString()}`);
//     console.log(`🔘 Actions Available: [✅ Taken] [⏭️ Skip]`);
//     console.log(`✅ Status: Reminder Ready with Action Buttons`);
//     console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
//   }
//   async sendNotification(userId, title, message, medicineData = {}) {
//     try {
//       const user = await User.findById(userId);
      
//       if (!user) {
//         console.log(`❌ User not found: ${userId}`);
//         return { success: false, error: 'User not found' };
//       }
      
//       // Method 1: Real FCM (if token exists and valid)
//       if (user.fcmToken && user.fcmToken.length > MIN_FCM_TOKEN_LENGTH) {
//         const fcmResult = await this.sendRealFCM(user.fcmToken, title, message, medicineData);
//         if (fcmResult.success) {
//           console.log(`✅ FCM sent to ${user.name}: ${title}`);
//           return fcmResult; // Don't save to DB if FCM succeeds
//         }
//       }
      
//       // Method 2: Console notification (always works)
//       this.logNotification(user, title, message);
      
//       // Method 3: Database logging for frontend to fetch
//       await this.saveNotificationToDatabase(userId, title, message, medicineData);
      
//       return { 
//         success: true, 
//         method: 'console+database',
//         message: 'Notification logged and saved'
//       };
      
//     } catch (error) {
//       console.error('❌ Notification error:', error);
//       return { success: false, error: error.message };
//     }
//   }
  
//   async sendRealFCM(fcmToken, title, message, medicineData) {
//     try {
//       const timestamp = new Date();
//       const payload = {
//         notification: { title, body: message },
//         data: {
//           medicineId: String(medicineData.medicineId || ''),
//           userId: String(medicineData.userId || ''),
//           scheduledAt: String(medicineData.scheduledAt || ''),
//           type: 'medicine_reminder',
//           timestamp: timestamp.toISOString(),
//           showActions: 'true',
//           actionType: 'medicine_reminder'
//         },
//         token: fcmToken
//       };
      
//       const response = await messaging.send(payload);
      
//       console.log(`🔔 REAL FCM DELIVERED:`, {
//         title,
//         message,
//         messageId: response,
//         timestamp: timestamp.toLocaleTimeString()
//       });
      
//       return { 
//         success: true, 
//         messageId: response,
//         method: 'real_fcm'
//       };
      
//     } catch (error) {
//       console.error('🚨 FCM Error:', error.message);
//       return { success: false, error: error.message };
//     }
//   }
  
//   // Console logging for development
//   logNotification(user, title, message) {
//     console.log('\n🔔 MEDICINE NOTIFICATION:');
//     console.log(`👤 User: ${user.name} (${user.email})`);
//     console.log(`📱 Phone: ${user.phone}`);
//     console.log(`📋 Title: ${title}`);
//     console.log(`💬 Message: ${message}`);
//     console.log(`⏰ Time: ${new Date().toLocaleString()}`);
//     console.log(`✅ Status: Notification Ready for User`);
//     console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
//   }
  
//   async saveNotificationToDatabase(userId, title, message, medicineData) {
//     try {
//       const notification = new Notification({
//         userId: userId,
//         title: title,
//         message: message,
//         type: 'medicine_reminder',
//         medicineId: medicineData.medicineId,
//         isRead: false,
//         createdAt: new Date()
//       });
      
//       await notification.save();
//       console.log(`💾 Notification saved to database for user ${userId}`);
      
//     } catch (error) {
//       console.error('❌ Database save error:', error);
//     }
//   }
  
//   // Bulk notification for multiple users
//   async sendBulkNotifications(notifications) {
//     const results = [];
    
//     for (const notif of notifications) {
//       const result = await this.sendNotification(
//         notif.userId,
//         notif.title,
//         notif.message,
//         notif.medicineData
//       );
//       results.push({ userId: notif.userId, result });
//     }
    
//     console.log(`📊 Bulk notifications sent: ${results.length}`);
//     return results;
//   }
  
//   // Health check for notification system
//   async healthCheck() {
//     try {
//       const totalUsers = await User.countDocuments();
//       const usersWithTokens = await User.countDocuments({ 
//         fcmToken: { $exists: true, $ne: null, $ne: '' }
//       });
      
//       const status = {
//         totalUsers,
//         usersWithTokens,
//         fcmEnabled: usersWithTokens > 0,
//         systemHealth: 'operational',
//         timestamp: new Date().toISOString()
//       };
      
//       console.log('🏥 Notification System Health:', status);
//       return status;
      
//     } catch (error) {
//       console.error('❌ Health check failed:', error);
//       return { systemHealth: 'error', error: error.message };
//     }
//   }
// }

// // Auto-refresh FCM token every 7 days
// setInterval(async () => {
//     try {
//         console.log('🔄 Auto-refreshing FCM tokens...');
//         const users = await User.find({ fcmToken: { $exists: true, $ne: null } });
        
//         for (const user of users) {
//             // Test if token is still valid by sending a test message
//             try {
//                 await messaging.send({
//                     token: user.fcmToken,
//                     data: { test: 'token_validation' }
//                 });
//                 console.log(`✅ Token valid for user: ${user.name}`);
//             } catch (error) {
//                 if (error.message.includes('not found')) {
//                     console.log(`❌ Invalid token for user: ${user.name} - marking for refresh`);
//                     user.fcmToken = null; // Mark for refresh
//                     await user.save();
//                 }
//             }
//         }
//     } catch (error) {
//         console.error('❌ Token refresh error:', error);
//     }
// }, 7 * 24 * 60 * 60 * 1000); // Every 7 days

// module.exports = new ProductionFCMService();

// ============================================
// PRODUCTION FCM SERVICE
// ============================================
// Yeh service 3 kaam karti hai:
// 1. Alert create karti hai (Database me save hota hai - Alert UI ke liye)
// 2. Notification create karti hai (Database me save hota hai - Sync ke liye)
// 3. FCM push notification bhejti hai (Device pe notification dikhta hai)
// ============================================

// src/services/production-fcm.service.js
const Notification = require('../models/Notification');
const Alert = require('../models/Alert');
const User = require('../models/User');
const messaging = require('../config/firebase');

const MIN_FCM_TOKEN_LENGTH = 50;

// Safe interval: 7 days to prevent frequent token expiration
const TOKEN_REFRESH_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

class ProductionFCMService {
  constructor() {
    this.isDev = process.env.NODE_ENV !== 'production';
    this.startTokenValidationLoop();
  }

  async validateFCMTokens() {
    try {
      const users = await User.find({ fcmToken: { $exists: true } });
      for (const user of users) {
        if (!user.fcmToken || user.fcmToken.length < MIN_FCM_TOKEN_LENGTH) {
          user.fcmToken = null;
          await user.save();
        }
      }


    } catch (error) {
      console.error('❌ FCM validation error:', error);
    }
  }

  startTokenValidationLoop() {
    // Immediately run once
    this.validateFCMTokens();

    // Then run safely every 7 days
    setInterval(() => {
      this.validateFCMTokens();
    }, TOKEN_REFRESH_INTERVAL_MS);
  }

  // Main method: Send notification + create alert (YouTube style sync)
  async sendNotificationWithAlert(userId, notificationData) {
    try {
      const user = await User.findById(userId);
      if (!user) return { success: false, error: 'User not found' };

      // ❌ DON'T create Alert here - AlertService already created it
      // ✅ ONLY create Notification in DB (for sync)
      const notification = await this.createNotification(userId, notificationData, notificationData.alertId);
      
      // ✅ Send FCM push notification (device notification)
      await this.sendFCMNotification(user, notificationData, notificationData.alertId);
      
      return { success: true, notificationId: notification._id };
      
    } catch (error) {
      console.error('❌ Notification+Alert error:', error);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // CREATE ALERT (Database me save - Alert UI ke liye)
  // ============================================
  async createAlert(userId, data) {
    try {
      const alert = new Alert({
        userId,
        type: data.alertType || 'REMINDER',
        medicineId: data.medicineId,
        medicineName: data.medicineName,
        dosage: data.dosage,
        status: 'PENDING',
        actionRequired: data.alertType === 'REMINDER',
        severity: data.severity || 'NORMAL',
        meta: data.meta || {},
        showInUI: true,
        sentToDevice: false,
        uniqueKey: `${userId}_${data.medicineId}_${data.alertType}_${new Date().toDateString()}`
      });
      
      const savedAlert = await alert.save();
      console.log(`✅ Alert created in DB: ${savedAlert._id}`);
      return savedAlert;
      
    } catch (error) {
      console.error('❌ Alert creation failed:', error.message);
      throw error;
    }
  }

  // ============================================
  // CREATE NOTIFICATION (Database me save - Sync ke liye)
  // ============================================
  async createNotification(userId, data, alertId) {
    try {
      const notification = new Notification({
        userId,
        title: data.title,
        message: data.message,
        type: data.type || 'medicine_reminder',
        alertType: data.alertType || 'REMINDER',
        status: 'PENDING',
        severity: data.severity || 'NORMAL',
        medicineId: data.medicineId,
        isRead: false,
        showInUI: true,
        deliveryStatus: 'pending',
        deliveryMethod: 'fcm'
      });
      
      const savedNotification = await notification.save();
      console.log(`✅ Notification created in DB: ${savedNotification._id}`);
      return savedNotification;
      
    } catch (error) {
      console.error('❌ Notification creation failed:', error.message);
      throw error;
    }
  }

  // Send FCM Push Notification (device notification with action buttons)
  async sendFCMNotification(user, data, alertId) {
    // ✅ Testing: Console log for debugging
    console.log(`\n🔔 FCM NOTIFICATION ATTEMPT:`);
    console.log(`👤 User: ${user.name} (${user.email})`);
    console.log(`📱 FCM Token: ${user.fcmToken ? 'EXISTS (' + user.fcmToken.length + ' chars)' : 'NOT FOUND'}`);
    console.log(`💊 Medicine: ${data.medicineName}`);
    console.log(`📋 Title: ${data.title}`);
    console.log(`💬 Message: ${data.message}`);
    
    if (!user.fcmToken || user.fcmToken.length < MIN_FCM_TOKEN_LENGTH) {
      console.log(`⚠️ No valid FCM token for user ${user._id} - Notification saved to DB only`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      return;
    }

    try {
      const message = {
        token: user.fcmToken,
        // ❌ Remove notification field - only send data
        // This prevents Chrome's default notification
        data: {
          title: data.title, // ✅ Move to data
          body: data.message, // ✅ Move to data
          alertId: String(alertId),
          medicineId: String(data.medicineId || ''),
          type: data.alertType || 'REMINDER',
          showActions: data.alertType === 'REMINDER' ? 'true' : 'false',
          actions: data.alertType === 'REMINDER' ? JSON.stringify(['taken', 'missed']) : '[]',
          timestamp: new Date().toISOString()
        }
      };

      await messaging.send(message);
      
      // Update alert as sent to device
      await Alert.findByIdAndUpdate(alertId, { sentToDevice: true });
      
      console.log(`✅ FCM notification sent successfully to ${user.name}`);
      console.log(`📨 Message ID: ${message}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      
    } catch (error) {
      console.error(`❌ FCM send error for user ${user._id}:`, error.message);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    }
  }

  // Handle action from notification or alert UI (YouTube style sync)
  async handleAction(alertId, action, source = 'unknown') {
    try {
      // Update both Alert and Notification
      await Alert.findByIdAndUpdate(alertId, {
        status: action.toUpperCase(),
        resolvedAt: new Date()
      });
      
      await Notification.findOneAndUpdate(
        { alertId },
        { 
          status: action.toUpperCase(),
          isRead: true,
          readAt: new Date()
        }
      );
      
      if (this.isDev) console.log(`✅ Action '${action}' processed from ${source} for alert ${alertId}`);
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Action handling error:', error);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // LEGACY METHODS - Backward compatibility ke liye
  // ============================================
  
  // sendNotification - Purane code ke liye compatibility
  async sendNotification(userId, title, body, data = {}) {
    return await this.sendNotificationWithAlert(userId, {
      title,
      message: body,
      alertType: 'REMINDER',
      ...data
    });
  }

  // ✅ sendReminderWithActions - Cron jobs ke liye (alerts.cron.js me use hota hai)
  // Yeh function medicine reminders ke liye Alert + Notification + FCM create karta hai
  async sendReminderWithActions(userId, title, message, medicineData = {}) {
    console.log(`\n🔔 REMINDER WITH ACTIONS CALLED:`);
    console.log(`👤 User ID: ${userId}`);
    console.log(`💊 Medicine: ${medicineData.medicineName}`);
    console.log(`📋 Title: ${title}`);
    console.log(`💬 Message: ${message}`);
    
    try {
      // ✅ ONLY create notification + FCM (Alert already created by AlertService)
      const result = await this.sendNotificationWithAlert(userId, {
        title,
        message,
        alertType: 'REMINDER',
        medicineId: medicineData.medicineId,
        medicineName: medicineData.medicineName,
        dosage: medicineData.dosage,
        severity: 'NORMAL',
        meta: { scheduledTime: medicineData.scheduledTime }
      });
      
      console.log(`✅ Reminder with actions completed:`, result);
      return result;
      
    } catch (error) {
      console.error(`❌ sendReminderWithActions error:`, error);
      throw error;
    }
  }
}

module.exports = new ProductionFCMService();


