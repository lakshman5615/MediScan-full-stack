
// Notification Routes for Frontend Integration
// src/routes/notification.routes.js

const express = require('express');
const authMiddleware = require('../middlewares/auth.jwt');
const Notification = require('../models/Notification');
const ProductionFCMService = require('../services/production-fcm.service');

const router = express.Router();

// Get alerts for dashboard (grouped by type)
router.get('/alerts', authMiddleware, async (req, res) => {
  try {
    const { _id: userId } = req.user;
    
    const notifications = await Notification.find({ 
      userId,
      showInUI: true 
    })
    .populate('medicineId', 'name dosage')
    .sort({ createdAt: -1 });
    
    // Group by alert type for UI sections
    const grouped = {
      reminders: notifications.filter(n => n.alertType === 'REMINDER'),
      expiry: notifications.filter(n => n.alertType === 'EXPIRY'),
      lowStock: notifications.filter(n => n.alertType === 'LOW_STOCK')
    };
    
    res.json({ success: true, data: grouped });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Handle alert actions
router.post('/action', authMiddleware, async (req, res) => {
  try {
    const { notificationId, action } = req.body;
    const { _id: userId } = req.user;
    
    if (!['TAKEN', 'MISSED', 'DISMISSED'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Invalid action' });
    }
    
    const notification = await Notification.findOne({ _id: notificationId, userId });
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    
    notification.status = action;
    notification.showInUI = action === 'DISMISSED' ? false : true;
    
    // Handle TAKEN action for reminders
    if (action === 'TAKEN' && notification.alertType === 'REMINDER') {
      const Medicine = require('../models/Medicine');
      const DoseHistory = require('../models/doseHistory');
      
      const medicine = await Medicine.findById(notification.medicineId);
      if (medicine && medicine.remainingQuantity > 0) {
        medicine.remainingQuantity -= 1;
        await medicine.save();
      }
      
      // Create dose history
      await DoseHistory.create({
        userId,
        medicineId: notification.medicineId,
        medicineName: medicine?.name || 'Unknown',
        scheduledTime: 'manual',
        scheduledAt: new Date(),
        status: 'TAKEN'
      });
    }
    
    // Handle MISSED action for reminders
    if (action === 'MISSED' && notification.alertType === 'REMINDER') {
      const DoseHistory = require('../models/doseHistory');
      const Medicine = require('../models/Medicine');
      
      const medicine = await Medicine.findById(notification.medicineId);
      
      await DoseHistory.create({
        userId,
        medicineId: notification.medicineId,
        medicineName: medicine?.name || 'Unknown',
        scheduledTime: 'manual',
        scheduledAt: new Date(),
        status: 'MISSED'
      });
    }
    
    await notification.save();
    
    res.json({ 
      success: true, 
      message: `Alert marked as ${action}`,
      data: notification 
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const query = { userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }
    
    const notifications = await Notification.find(query)
      .populate('medicineId', 'medicineName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const totalCount = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });
    
    res.json({
      success: true,
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        unreadCount
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark notification as read
router.put('/read/:id', authMiddleware, async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id } = req.params;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    
    res.json({ success: true, notification });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark all notifications as read
router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    const { _id: userId } = req.user;
    
    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    
    res.json({ success: true, message: 'All notifications marked as read' });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test notification (for development)
router.post('/test', authMiddleware, async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { title = '🧪 Test Notification', message = 'MediScan notification system working!' } = req.body;
    
    const result = await ProductionFCMService.sendNotification(userId, title, message);
    
    res.json({ success: true, result });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// System health check
router.get('/health', async (req, res) => {
  try {
    const health = await ProductionFCMService.healthCheck();
    res.json({ success: true, health });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete notification
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id } = req.params;
    
    const notification = await Notification.findOneAndDelete({ _id: id, userId });
    
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    
    res.json({ success: true, message: 'Notification deleted' });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 