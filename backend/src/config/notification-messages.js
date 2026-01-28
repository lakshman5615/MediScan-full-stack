
// src/config/notification-messages.js

const NotificationMessages = {
  
  // Medicine reminder messages
  medicineReminder: {
    title: '💊 Medicine Reminder',
    getMessage: (medicineName, time) => `Time to take your ${medicineName} (${time})`
  },
  
  // Low stock alert messages
  lowStock: {
    title: '⚠️ Low Stock Alert',
    getMessage: (medicineName, quantity) => `${medicineName} is running low. Only ${quantity} dose${quantity > 1 ? 's' : ''} remaining.`
  },
  
  // Out of stock messages
  outOfStock: {
    title: '🚫 Out of Stock',
    getMessage: (medicineName) => `${medicineName} is out of stock. Please refill your prescription.`
  },
  
  // Expiry alert messages
  expiryAlert: {
    title: '⏰ Expiry Alert',
    getMessage: (medicineName, daysLeft) => `${medicineName} expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}. Please check expiry date.`
  },
  
  // Test notification
  testNotification: {
    title: '🧪 Test Notification',
    message: 'MediScan notification system is working perfectly!'
  },
  
  // Welcome notification
  welcome: {
    title: '🏥 Welcome to MediScan',
    getMessage: (userName) => `Hello ${userName}! Your medicine cabinet is ready. Add medicines to get reminders.`
  },
  
  // System notifications
  system: {
    tokenRegistered: {
      title: '✅ Notifications Enabled',
      message: 'You will now receive medicine reminders on this device.'
    },
    
    medicineAdded: {
      title: '💊 Medicine Added',
      getMessage: (medicineName, time) => `${medicineName} added successfully. Reminder set for ${time}.`
    }
  }
};

module.exports = NotificationMessages;