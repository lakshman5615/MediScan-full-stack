const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./src/models/User');
const Medicine = require('./src/models/Medicine');

const createYashikaUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create Yashika user
    const hashedPassword = await bcrypt.hash('yashika123', 10);
    
    const yashikaUser = new User({
      name: 'Yashika',
      email: 'yashika@mediscan.com',
      phone: '9111393409',
      age: 25,
      password: hashedPassword
    });

    await yashikaUser.save();
    console.log('✅ Yashika user created');

    // Add medicine with 8:40 PM schedule
    const medicine = new Medicine({
      userId: yashikaUser._id,
      medicineName: 'Paracetamol',
      quantity: 10,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      schedule: {
        time: '20:40', // 8:40 PM
        frequency: 'daily'
      },
      status: 'accepted'
    });

    await medicine.save();
    console.log('✅ Medicine added with 8:40 PM schedule');

    console.log('\n🎯 Setup Complete:');
    console.log(`👤 User: Yashika`);
    console.log(`📞 Phone: 9111393409`);
    console.log(`💊 Medicine: Paracetamol`);
    console.log(`⏰ Time: 8:40 PM (20:40)`);
    console.log(`📦 Quantity: 10 doses`);
    console.log('\n🔔 Notification will be sent at 8:40 PM daily!');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createYashikaUser();