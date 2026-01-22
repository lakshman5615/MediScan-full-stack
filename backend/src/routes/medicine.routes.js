const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Medicine routes working!',
    timestamp: new Date().toISOString()
  });
});

// Import controller functions
const { getMedicines, addMedicine, acceptMedicine, rejectMedicine, getAlerts } = require('../controllers/medicine.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const FCMService = require('../services/fcm.service');

// My Cabinet routes
router.get('/', authMiddleware, getMedicines);
router.post('/add', authMiddleware, addMedicine);
router.post('/accept', authMiddleware, acceptMedicine);
router.post('/reject', authMiddleware, rejectMedicine);
router.get('/alerts', authMiddleware, getAlerts);

// Send notification by phone number (FCM + WhatsApp)
router.post('/notify-phone', authMiddleware, async (req, res) => {
  try {
    const { phoneNumber, title, message } = req.body;
    
    const result = await FCMService.sendNotificationByPhone(phoneNumber, title, message);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send WhatsApp message directly
router.post('/notify-whatsapp', authMiddleware, async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;
    const WhatsAppService = require('../services/whatsapp.service');
    
    const result = await WhatsAppService.sendWhatsAppMessage(phoneNumber, message);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send to single FCM token
router.post('/notify-token', authMiddleware, async (req, res) => {
  try {
    const { fcmToken, title, message } = req.body;
    
    const result = await FCMService.sendToToken(fcmToken, title, message);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send to multiple tokens
router.post('/notify-multiple', authMiddleware, async (req, res) => {
  try {
    const { fcmTokens, title, message } = req.body;
    
    const result = await FCMService.sendToMultipleTokens(fcmTokens, title, message);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send to topic
router.post('/notify-topic', authMiddleware, async (req, res) => {
  try {
    const { topic, title, message } = req.body;
    
    const result = await FCMService.sendToTopic(topic, title, message);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test mobile notification for current user
router.post('/test-notification', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const User = require('../models/User');
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Send test notification
    const result = await FCMService.sendNotificationByPhone(
      user.phone,
      '🧪 Test Notification',
      `Hi ${user.name}! Ye test notification hai. Aapka mobile notification system working hai! 🎉`
    );
    
    res.json({
      message: 'Test notification sent',
      user: { name: user.name, phone: user.phone },
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;