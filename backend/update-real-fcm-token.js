// Quick FCM Token Update with Real Token
const axios = require('axios');

const realToken = 'dBfyAl6FNBA9PWXSo1mJo-:APA91bF2Q4f1Nqt7uTvITGuv6cHVa43owi-JUhdncFdxMksXnKnP9JeHs5vnB7THrt0ZL7DI-WcGgNB3wAla9--UALy1qT7tE-4rm2GxC5N-vG_R6Fexlsk';

async function updateRealToken() {
  try {
    console.log('🔥 Updating with REAL FCM Token...');
    
    const response = await axios.post('http://localhost:5000/phone-user/update-fcm-token', {
      phone: '9999999999',
      fcmToken: realToken
    });
    
    console.log('✅ Response:', response.data);
    
    // Now add medicine for immediate test
    console.log('\n💊 Adding medicine for 14:40...');
    
    const medicineResponse = await axios.post('http://localhost:5000/phone-user/complete-setup', {
      name: 'Real FCM User',
      phone: '9999999999',
      medicineName: 'Real FCM Test Medicine',
      quantity: 5,
      scheduleTime: '14:40',
      expiryDate: '2024-12-31'
    });
    
    console.log('✅ Medicine added:', medicineResponse.data);
    
    console.log('\n🎯 SETUP COMPLETE!');
    console.log('📱 Real FCM token registered');
    console.log('💊 Medicine scheduled for 14:40');
    console.log('🔔 You will get REAL notification at 14:40!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

updateRealToken();