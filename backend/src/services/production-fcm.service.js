// Production-Ready Backend Notification System
// src/services/production-fcm.service.js

const Notification = require('../models/Notification');
const User = require('../models/User');
const messaging = require('../config/firebase');

const MIN_FCM_TOKEN_LENGTH = 50;

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
      if (user.fcmToken && user.fcmToken.length > MIN_FCM_TOKEN_LENGTH) {
        const fcmResult = await this.sendReminderFCM(user.fcmToken, title, message, medicineData);
        if (fcmResult.success) {
          console.log(`✅ Reminder FCM with actions sent to ${user.name}: ${title}`);
          return fcmResult;  // ✅ SUCCESS - Return here, no database save for successful FCM
        }
      }
      
      // Method 2: Fallback - Console notification (only if FCM fails)
      this.logReminderNotification(user, title, message, medicineData);
      
      // Method 3: Database logging (only if FCM fails)
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
  
  async sendReminderFCM(fcmToken, title, message, medicineData) {
    try {
      console.log(`📱 Attempting FCM send to token: ${fcmToken.length} chars`);
      
      const timestamp = new Date();
      const payload = {
        notification: { title, body: message },
        data: {
          medicineId: String(medicineData.medicineId || ''),
          medicineName: String(medicineData.medicineName || ''),
          userId: String(medicineData.userId || ''),
          type: 'medicine_reminder',
          timestamp: timestamp.toISOString(),
          showActions: 'true',
          actionType: 'reminder'
        },
        token: fcmToken
      };
      
      const response = await messaging.send(payload);
      
      console.log(`✅ REMINDER FCM SUCCESS:`, {
        title,
        messageId: response,
        timestamp: timestamp.toLocaleTimeString()
      });
      
      return { 
        success: true, 
        messageId: response,
        method: 'reminder_fcm_delivered'
      };
      
    } catch (error) {
      console.error('🚨 REMINDER FCM FAILED:', error.message);
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
      if (user.fcmToken && user.fcmToken.length > MIN_FCM_TOKEN_LENGTH) {
        const fcmResult = await this.sendRealFCM(user.fcmToken, title, message, medicineData);
        if (fcmResult.success) {
          console.log(`✅ FCM sent to ${user.name}: ${title}`);
          return fcmResult; // Don't save to DB if FCM succeeds
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
  
  async sendRealFCM(fcmToken, title, message, medicineData) {
    try {
      const timestamp = new Date();
      const payload = {
        notification: { title, body: message },
        data: {
          medicineId: String(medicineData.medicineId || ''),
          userId: String(medicineData.userId || ''),
          scheduledAt: String(medicineData.scheduledAt || ''),
          type: 'medicine_reminder',
          timestamp: timestamp.toISOString(),
          showActions: 'true',
          actionType: 'medicine_reminder'
        },
        token: fcmToken
      };
      
      const response = await messaging.send(payload);
      
      console.log(`🔔 REAL FCM DELIVERED:`, {
        title,
        message,
        messageId: response,
        timestamp: timestamp.toLocaleTimeString()
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
  
  async saveNotificationToDatabase(userId, title, message, medicineData) {
    try {
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

// Auto-refresh FCM token every 24 hours
setInterval(async () => {
    try {
        console.log('🔄 Auto-refreshing FCM tokens...');
        const users = await User.find({ fcmToken: { $exists: true, $ne: null } });
        
        for (const user of users) {
            // Test if token is still valid by sending a test message
            try {
                await messaging.send({
                    token: user.fcmToken,
                    data: { test: 'token_validation' }
                });
                console.log(`✅ Token valid for user: ${user.name}`);
            } catch (error) {
                if (error.message.includes('not found')) {
                    console.log(`❌ Invalid token for user: ${user.name} - marking for refresh`);
                    user.fcmToken = null; // Mark for refresh
                    await user.save();
                }
            }
        }
    } catch (error) {
        console.error('❌ Token refresh error:', error);
    }
}, 24 * 60 * 60 * 1000); // Every 24 hours

module.exports = new ProductionFCMService(); 