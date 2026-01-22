// MediScan Mobile Notification Test Script
// Run this after starting the server

const testMobileNotifications = async () => {
  const baseURL = 'http://localhost:3000/api';
  
  console.log('🏥 MediScan Mobile Notification Test');
  console.log('=====================================');
  
  // Test user data
  const testUser = {
    name: 'Test User',
    email: 'test@mediscan.com',
    phone: '+919876543210',
    age: 25,
    password: 'test123'
  };
  
  try {
    // 1. Register user
    console.log('\n1️⃣ Registering user...');
    const registerResponse = await fetch(`${baseURL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const registerResult = await registerResponse.json();
    console.log('Registration:', registerResult.success ? '✅ Success' : '❌ Failed');
    
    // 2. Login user
    console.log('\n2️⃣ Logging in user...');
    const loginResponse = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    const loginResult = await loginResponse.json();
    console.log('Login:', loginResult.success ? '✅ Success' : '❌ Failed');
    
    if (!loginResult.success) return;
    
    const authToken = loginResult.jwtToken;
    
    // 3. Add medicine
    console.log('\n3️⃣ Adding medicine...');
    const medicine = {
      medicineName: 'Paracetamol',
      quantity: 10,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      schedule: {
        time: new Date().toTimeString().slice(0, 5), // Current time
        frequency: 'daily'
      }
    };
    
    const medicineResponse = await fetch(`${baseURL}/medicine/add`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(medicine)
    });
    
    const medicineResult = await medicineResponse.json();
    console.log('Medicine added:', medicineResult.success ? '✅ Success' : '❌ Failed');
    
    // 4. Test notification
    console.log('\n4️⃣ Testing notification...');
    const notificationResponse = await fetch(`${baseURL}/medicine/test-notification`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const notificationResult = await notificationResponse.json();
    console.log('Test notification:', notificationResult.message || '✅ Sent');
    
    // 5. Test phone notification
    console.log('\n5️⃣ Testing phone notification...');
    const phoneNotificationResponse = await fetch(`${baseURL}/medicine/notify-phone`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        phoneNumber: testUser.phone,
        title: '💊 Medicine Reminder',
        message: 'Paracetamol lene ka time ho gaya hai!'
      })
    });
    
    const phoneResult = await phoneNotificationResponse.json();
    console.log('Phone notification:', phoneResult.success ? '✅ Sent' : '❌ Failed');
    
    console.log('\n🎉 Test completed! Check console for notification details.');
    console.log('\n📱 Open http://localhost:3000/mobile for mobile registration page');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run test if this file is executed directly
if (require.main === module) {
  // Add fetch polyfill for Node.js
  global.fetch = require('node-fetch');
  testMobileNotifications();
}

module.exports = testMobileNotifications;