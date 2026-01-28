// ⚠️ ADMIN 

const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Medicine = require('../models/Medicine');
const ProductionFCMService = require('../services/production-fcm.service');
const AutoTokenManager = require('../services/auto-token-manager');

const router = express.Router();

// Add user by phone number
router.post('/add-user-by-phone', async (req, res) => {
  try {
    const { name, phone, age = 25, email, password = 'default123' } = req.body;
    
    // Generate email if not provided
    const userEmail = email || `${phone}@mediscan.com`;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ phone }, { email: userEmail }]
    });
    
    if (existingUser) {
      return res.json({
        success: true,
        message: 'User already exists',
        user: {
          id: existingUser._id,
          name: existingUser.name,
          phone: existingUser.phone,
          email: existingUser.email
        }
      });
    }
    
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      name,
      phone,
      email: userEmail,
      password: hashedPassword,
      age
    });
    
    await newUser.save();
    
    // Auto-assign real FCM token from pool
    await AutoTokenManager.autoAssignToken(newUser._id);
    
    res.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        age: newUser.age
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add medicine for user by phone
router.post('/add-medicine-by-phone', async (req, res) => {
  try {
    const { phone, medicineName, quantity, scheduleTime, expiryDate } = req.body;
    
    // Find user by phone
    const user = await User.findOne({ phone });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found. Please add user first.' 
      });
    }
    
    // Create medicine
    const medicine = new Medicine({
      userId: user._id,
      medicineName,
      quantity,
      schedule: {
        time: scheduleTime,
        frequency: 'daily'
      },
      expiryDate: new Date(expiryDate)
    });
    
    await medicine.save();
    
    // Send confirmation notification
    await ProductionFCMService.sendNotification(
      user._id,
      '💊 Medicine Added',
      `${medicineName} added successfully. Reminder set for ${scheduleTime}.`,
      { medicineId: medicine._id, userId: user._id }
    );
    
    res.json({
      success: true,
      message: 'Medicine added successfully',
      medicine: {
        id: medicine._id,
        name: medicineName,
        quantity,
        scheduleTime,
        user: user.name,
        phone: user.phone
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send notification to phone number
router.post('/notify-by-phone', async (req, res) => {
  try {
    const { phone, title, message } = req.body;
    
    // Find user by phone
    const user = await User.findOne({ phone });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found with this phone number' 
      });
    }
    
    // Send notification
    const result = await ProductionFCMService.sendNotification(
      user._id,
      title,
      message
    );
    
    res.json({
      success: true,
      message: 'Notification sent successfully',
      user: user.name,
      phone: user.phone,
      result
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user details by phone
router.get('/user-by-phone/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    
    const user = await User.findOne({ phone }).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    // Get user's medicines
    const medicines = await Medicine.find({ userId: user._id });
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        age: user.age,
        fcmToken: user.fcmToken ? 'Registered' : 'Not Registered',
        medicineCount: medicines.length,
        medicines: medicines.map(med => ({
          name: med.medicineName,
          quantity: med.quantity,
          scheduleTime: med.schedule.time,
          expiryDate: med.expiryDate
        }))
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Complete setup: Add user + medicine + notification
router.post('/complete-setup', async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      age = 25,
      medicineName, 
      quantity, 
      scheduleTime, 
      expiryDate 
    } = req.body;
    
    // Step 1: Add user
    const userEmail = `${phone}@mediscan.com`;
    const hashedPassword = await bcrypt.hash('default123', 10);
    
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = new User({
        name,
        phone,
        email: userEmail,
        password: hashedPassword,
        age
      });
      await user.save();
      
      // Auto-assign real FCM token from pool
      await AutoTokenManager.autoAssignToken(user._id);
    }
    
    // Step 2: Add medicine
    const medicine = new Medicine({
      userId: user._id,
      medicineName,
      quantity,
      schedule: {
        time: scheduleTime,
        frequency: 'daily'
      },
      expiryDate: new Date(expiryDate)
    });
    
    await medicine.save();
    
    // Step 3: Send confirmation notification
    await ProductionFCMService.sendNotification(
      user._id,
      '🏥 MediScan Setup Complete',
      `Hello ${name}! ${medicineName} added. You'll get reminders at ${scheduleTime}.`,
      { medicineId: medicine._id, userId: user._id }
    );
    
    res.json({
      success: true,
      message: 'Complete setup successful',
      user: {
        name: user.name,
        phone: user.phone,
        medicine: medicineName,
        scheduleTime,
        notificationSent: true
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update FCM token by phone number
router.post('/update-fcm-token', async (req, res) => {
  try {
    const { phone, fcmToken } = req.body;
    
    if (!phone || !fcmToken) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number and FCM token required' 
      });
    }
    
    // Find user by phone
    const user = await User.findOne({ phone });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found with this phone number' 
      });
    }
    
    // Update FCM token
    await User.findByIdAndUpdate(user._id, { fcmToken });
    
    console.log(`🔄 Real FCM token updated for ${user.name} (${phone})`);
    
    res.json({
      success: true,
      message: 'Real FCM token updated successfully',
      user: {
        name: user.name,
        phone: user.phone,
        tokenUpdated: true,
        tokenPreview: fcmToken.substring(0, 20) + '...'
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;