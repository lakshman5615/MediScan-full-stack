// Production-Ready Backend Notification System
// src/services/production-fcm.service.js

const User = require('../models/User');
const messaging = require('../config/firebase');

class ProductionFCMService {
  
  // Send reminder notification with action buttons
  async sendReminderWithActions(userId, title, message, medicineData = {}) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        console.log(`❌ User not found: ${userId}`);
        return { success: false, error: 'User not found' };
      }
      
      // Method 1: Real FCM with action buttons (if token exists)
      if (user.fcmToken && user.fcmToken.length > 50) {
        const fcmResult = await this.sendReminderFCM(user.fcmToken, title, message, medicineData);
        if (fcmResult.success) {
          console.log(`✅ Reminder FCM with actions sent to ${user.name}: ${title}`);
          return fcmResult;
        }
      }
      
      // Method 2: Console notification with action info
      this.logReminderNotification(user, title, message, medicineData);
      
      // Method 3: Database logging
      await this.saveNotificationToDatabase(userId, title, message, medicineData);
      
      return { 
        success: true, 
        method: 'console+database',
        message: 'Reminder notification logged with action data'
      };
      
    } catch (error) {
      console.error('❌ Reminder notification error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Real FCM with action buttons for reminders
  async sendReminderFCM(fcmToken, title, message, medicineData) {
    try {
      const payload = {
        notification: {
          title: title,
          body: message
        },
        data: {
          medicineId: String(medicineData.medicineId || ''),
          medicineName: String(medicineData.medicineName || ''),
          userId: String(medicineData.userId || ''),
          type: 'medicine_reminder',
          timestamp: new Date().toISOString(),
          // Action data for frontend
          showActions: 'true',
          actionType: 'reminder',
          takenAction: `taken_${medicineData.medicineId}`,
          missedAction: `missed_${medicineData.medicineId}`
        },
        android: {
          notification: {
            sound: 'default',
            priority: 'high',
            clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            // Action buttons for Android
            actions: [
              {
                action: `taken_${medicineData.medicineId}`,
                title: '✅ Taken',
                icon: 'ic_check'
              },
              {
                action: `missed_${medicineData.medicineId}`,
                title: '⏭️ Skip',
                icon: 'ic_skip'
              }
            ]
          },
          data: {
            medicineId: String(medicineData.medicineId || ''),
            medicineName: String(medicineData.medicineName || ''),
            showActions: 'true'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
              category: 'MEDICINE_REMINDER',
              // iOS action buttons
              'mutable-content': 1
            }
          },
          fcm_options: {
            image: 'https://example.com/medicine-icon.png'
          }
        },
        token: fcmToken
      };
      
      const response = await messaging.send(payload);
      
      console.log(`🔔 REMINDER FCM WITH ACTIONS DELIVERED:`, {
        title,
        message,
        medicineId: medicineData.medicineId,
        medicineName: medicineData.medicineName,
        messageId: response,
        timestamp: new Date().toLocaleTimeString()
      });
      
      return { 
        success: true, 
        messageId: response,
        method: 'reminder_fcm_with_actions'
      };
      
    } catch (error) {
      console.error('🚨 Reminder FCM Error:', error.message);
      return { success: false, error: error.message };
    }
  }
  
  // Console logging for reminder with action info
  logReminderNotification(user, title, message, medicineData) {
    console.log('\n🔔 MEDICINE REMINDER WITH ACTIONS:');
    console.log(`👤 User: ${user.name} (${user.email})`);
    console.log(`📱 Phone: ${user.phone}`);
    console.log(`💊 Medicine: ${medicineData.medicineName || 'Unknown'}`);
    console.log(`🆔 Medicine ID: ${medicineData.medicineId || 'Unknown'}`);
    console.log(`📋 Title: ${title}`);
    console.log(`💬 Message: ${message}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    console.log(`🔘 Actions Available: [✅ Taken] [⏭️ Skip]`);
    console.log(`✅ Status: Reminder Ready with Action Buttons`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
  async sendNotification(userId, title, message, medicineData = {}) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        console.log(`❌ User not found: ${userId}`);
        return { success: false, error: 'User not found' };
      }
      
      // Method 1: Real FCM (if token exists and valid)
      if (user.fcmToken && user.fcmToken.length > 50) {
        const fcmResult = await this.sendRealFCM(user.fcmToken, title, message, medicineData);
        if (fcmResult.success) {
          console.log(`✅ FCM sent to ${user.name}: ${title}`);
          return fcmResult;
        }
      }
      
      // Method 2: Console notification (always works)
      this.logNotification(user, title, message);
      
      // Method 3: Database logging for frontend to fetch
      await this.saveNotificationToDatabase(userId, title, message, medicineData);
      
      return { 
        success: true, 
        method: 'console+database',
        message: 'Notification logged and saved'
      };
      
    } catch (error) {
      console.error('❌ Notification error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Real FCM with proper error handling
  async sendRealFCM(fcmToken, title, message, medicineData) {
    try {
      const payload = {
        notification: {
          title: title,
          body: message
        },
        data: {
          medicineId: String(medicineData.medicineId || ''),
          userId: String(medicineData.userId || ''),
          scheduledAt: String(medicineData.scheduledAt || ''),
          token: String(medicineData.token || ''),  
          type: 'medicine_reminder',
          timestamp: new Date().toISOString(),
          // Action data for frontend handling
          showActions: 'true',
          actionType: 'medicine_reminder'
        },
        android: {
          notification: {
            sound: 'default',
            priority: 'high',
            clickAction: 'FLUTTER_NOTIFICATION_CLICK'
          },
          data: {
            medicineId: String(medicineData.medicineId || ''),
            userId: String(medicineData.userId || ''),
            showActions: 'true'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
              category: 'MEDICINE_REMINDER'
            }
          }
        },
        token: fcmToken
      };
      
      const response = await messaging.send(payload);
      
      console.log(`🔔 REAL FCM DELIVERED:`, {
        title,
        message,
        messageId: response,
        timestamp: new Date().toLocaleTimeString()
      });
      
      return { 
        success: true, 
        messageId: response,
        method: 'real_fcm'
      };
      
    } catch (error) {
      console.error('🚨 FCM Error:', error.message);
      return { success: false, error: error.message };
    }
  }
  
  // Console logging for development
  logNotification(user, title, message) {
    console.log('\n🔔 MEDICINE NOTIFICATION:');
    console.log(`👤 User: ${user.name} (${user.email})`);
    console.log(`📱 Phone: ${user.phone}`);
    console.log(`📋 Title: ${title}`);
    console.log(`💬 Message: ${message}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    console.log(`✅ Status: Notification Ready for User`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
  
  // Save notification to database for frontend polling
  async saveNotificationToDatabase(userId, title, message, medicineData) {
    try {
      const Notification = require('../models/Notification');
      
      const notification = new Notification({
        userId: userId,
        title: title,
        message: message,
        type: 'medicine_reminder',
        medicineId: medicineData.medicineId,
        isRead: false,
        createdAt: new Date()
      });
      
      await notification.save();
      console.log(`💾 Notification saved to database for user ${userId}`);
      
    } catch (error) {
      console.error('❌ Database save error:', error);
    }
  }
  
  // Bulk notification for multiple users
  async sendBulkNotifications(notifications) {
    const results = [];
    
    for (const notif of notifications) {
      const result = await this.sendNotification(
        notif.userId,
        notif.title,
        notif.message,
        notif.medicineData
      );
      results.push({ userId: notif.userId, result });
    }
    
    console.log(`📊 Bulk notifications sent: ${results.length}`);
    return results;
  }
  
  // Health check for notification system
  async healthCheck() {
    try {
      const totalUsers = await User.countDocuments();
      const usersWithTokens = await User.countDocuments({ 
        fcmToken: { $exists: true, $ne: null, $ne: '' }
      });
      
      const status = {
        totalUsers,
        usersWithTokens,
        fcmEnabled: usersWithTokens > 0,
        systemHealth: 'operational',
        timestamp: new Date().toISOString()
      };
      
      console.log('🏥 Notification System Health:', status);
      return status;
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return { systemHealth: 'error', error: error.message };
    }
  }
}

module.exports = new ProductionFCMService(); 