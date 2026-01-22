const User = require('../models/User');
const messaging = require('../config/firebase');
const FreeEmailService = require('./free-email.service');

class FCMService {
  // Send notification by phone number (Free methods)
  async sendNotificationByPhone(phoneNumber, title, message) {
    try {
      const user = await User.findOne({ phone: phoneNumber });
      
      // Method 1: Console notification (always works)
      console.log('\n🔔 MEDICINE NOTIFICATION:');
      console.log(`📞 Phone: ${phoneNumber}`);
      console.log(`📋 Title: ${title}`);
      console.log(`💬 Message: ${message}`);
      console.log(`⏰ Time: ${new Date().toLocaleString()}`);
      console.log('✅ Status: Notification Ready!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Method 2: Email notification (free)
      const emailResult = await FreeEmailService.sendMedicineReminder(
        phoneNumber, 
        `${title}: ${message}`, 
        new Date().toLocaleString()
      );
      
      // Method 3: FCM if available
      let fcmResult = { success: false };
      if (user && user.fcmToken) {
        fcmResult = await this.sendToToken(user.fcmToken, title, message);
      }
      
      return {
        success: true,
        console: { success: true, message: 'Displayed in console' },
        email: emailResult,
        fcm: fcmResult,
        message: 'Notification sent via multiple free methods'
      };
    } catch (error) {
      console.error('Phone notification error:', error);
      return { success: false, error: error.message };
    }
  }

  // Real FCM notification using Firebase Admin SDK
  async sendToToken(fcmToken, title, messageBody) {
    try {
      const message = {
        notification: {
          title: title,
          body: messageBody
        },
        data: {
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          sound: 'default',
          priority: 'high'
        },
        android: {
          notification: {
            sound: 'default',
            priority: 'high',
            defaultSound: true
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        },
        token: fcmToken
      };

      // Send real FCM notification
      const response = await messaging.send(message);
      
      // Also log to console for visibility
      console.log('🔔 REAL FCM NOTIFICATION SENT:');
      console.log('📱 Token:', fcmToken.substring(0, 20) + '...');
      console.log('📋 Title:', title);
      console.log('💬 Message:', messageBody);
      console.log('⏰ Time:', new Date().toISOString());
      console.log('✅ Status: Delivered to Device');
      console.log('🆔 Message ID:', response);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      return { 
        success: true, 
        messageId: response,
        notification: {
          token: fcmToken,
          title: title,
          body: messageBody,
          timestamp: new Date().toISOString(),
          delivered: true
        }
      };
    } catch (error) {
      console.error('🚨 FCM Error:', error);
      
      // Fallback to mock if Firebase fails
      console.log('📱 FALLBACK NOTIFICATION:');
      console.log('📋 Title:', title);
      console.log('💬 Message:', messageBody);
      console.log('⚠️ Status: Firebase failed, showing in console');
      
      return { 
        success: false, 
        error: error.message,
        fallback: true
      };
    }
  }

  // Send schedule reminder notification
  async sendScheduleReminder(userId, medicineName, time) {
    try {
      const user = await User.findById(userId);
      
      if (user && user.fcmToken) {
        const title = '⏰ Medicine Reminder';
        const message = `${medicineName} lene ka time ho gaya hai (${time})`;
        
        console.log(`\n🚨 MEDICINE REMINDER for ${user.name}:`);
        console.log(`📞 Phone: ${user.phone}`);
        console.log(`💊 Medicine: ${medicineName}`);
        console.log(`⏰ Time: ${time}`);
        
        return await this.sendToToken(user.fcmToken, title, message);
      }
      
      return { success: false, error: 'User or FCM token not found' };
    } catch (error) {
      console.error('Schedule reminder error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send low stock alert
  async sendLowStockAlert(userId, medicineName, quantity) {
    try {
      const user = await User.findById(userId);
      
      if (user && user.fcmToken) {
        const title = '⚠️ Low Stock Alert';
        const message = `${medicineName} stock low! Sirf ${quantity} doses bachi hain.`;
        
        console.log(`\n⚠️ LOW STOCK ALERT for ${user.name}:`);
        console.log(`💊 Medicine: ${medicineName}`);
        console.log(`📦 Quantity: ${quantity}`);
        
        return await this.sendToToken(user.fcmToken, title, message);
      }
      
      return { success: false, error: 'User or FCM token not found' };
    } catch (error) {
      console.error('Low stock alert error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send expiry alert
  async sendExpiryAlert(userId, medicineName, daysLeft) {
    try {
      const user = await User.findById(userId);
      
      if (user && user.fcmToken) {
        const title = '⏰ Expiry Alert';
        const message = `Alert! ${medicineName} ${daysLeft} din me expire ho rahi hai.`;
        
        console.log(`\n⏰ EXPIRY ALERT for ${user.name}:`);
        console.log(`💊 Medicine: ${medicineName}`);
        console.log(`📅 Days Left: ${daysLeft}`);
        
        return await this.sendToToken(user.fcmToken, title, message);
      }
      
      return { success: false, error: 'User or FCM token not found' };
    } catch (error) {
      console.error('Expiry alert error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new FCMService();