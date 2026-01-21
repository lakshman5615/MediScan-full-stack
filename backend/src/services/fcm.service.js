class FCMService {
  // Send schedule reminder notification
  async sendScheduleReminder(userId, medicineName, time) {
    try {
      const message = `⏰ ${medicineName} lene ka time ho gaya hai (${time})`;
      
      // FCM implementation would go here
      console.log('FCM Notification:', message);
      
      return { success: true, message };
    } catch (error) {
      console.error('FCM Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send low stock alert
  async sendLowStockAlert(userId, medicineName, quantity) {
    try {
      const message = `⚠️ ${medicineName} stock low! Sirf ${quantity} doses bachi hain.`;
      
      console.log('Low Stock Alert:', message);
      
      return { success: true, message };
    } catch (error) {
      console.error('FCM Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send expiry alert
  async sendExpiryAlert(userId, medicineName, daysLeft) {
    try {
      const message = `⏰ Alert! ${medicineName} ${daysLeft} din me expire ho rahi hai.`;
      
      console.log('Expiry Alert:', message);
      
      return { success: true, message };
    } catch (error) {
      console.error('FCM Error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new FCMService();