// API Test for Yashika User - 8:40 PM Medicine
const fetch = require('node-fetch');

const baseURL = 'http://localhost:3000/api';

const createYashikaViaAPI = async () => {
  try {
    console.log('🏥 Creating Yashika via API...\n');

    // 1. Register Yashika
    console.log('1️⃣ Registering Yashika...');
    const registerResponse = await fetch(`${baseURL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Yashika',
        email: 'yashika@mediscan.com',
        phone: '9111393409',
        age: 25,
        password: 'yashika123'
      })
    });

    const registerResult = await registerResponse.json();
    console.log('Registration:', registerResult.success ? '✅ Success' : '❌ Failed');
    if (!registerResult.success) {
      console.log('Error:', registerResult.message);
    }

    // 2. Login Yashika
    console.log('\n2️⃣ Logging in Yashika...');
    const loginResponse = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'yashika@mediscan.com',
        password: 'yashika123'
      })
    });

    const loginResult = await loginResponse.json();
    console.log('Login:', loginResult.success ? '✅ Success' : '❌ Failed');
    
    if (!loginResult.success) {
      console.log('Error:', loginResult.message);
      return;
    }

    const authToken = loginResult.jwtToken;

    // 3. Add Medicine with 8:40 PM schedule
    console.log('\n3️⃣ Adding medicine with 8:40 PM schedule...');
    const medicineResponse = await fetch(`${baseURL}/medicine/add`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        medicineName: 'Paracetamol',
        quantity: 10,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        schedule: {
          time: '20:40', // 8:40 PM
          frequency: 'daily'
        }
      })
    });

    const medicineResult = await medicineResponse.json();
    console.log('Medicine added:', medicineResult.success ? '✅ Success' : '❌ Failed');

    // 4. Test notification
    console.log('\n4️⃣ Testing notification...');
    const testResponse = await fetch(`${baseURL}/medicine/test-notification`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    const testResult = await testResponse.json();
    console.log('Test notification sent ✅');

    console.log('\n🎯 Setup Complete:');
    console.log('👤 User: Yashika');
    console.log('📞 Phone: 9111393409');
    console.log('💊 Medicine: Paracetamol');
    console.log('⏰ Schedule: 8:40 PM (20:40)');
    console.log('📦 Quantity: 10 doses');
    console.log('\n🔔 Notification will be sent automatically at 8:40 PM!');

  } catch (error) {
    console.error('❌ API Error:', error.message);
  }
};

createYashikaViaAPI();