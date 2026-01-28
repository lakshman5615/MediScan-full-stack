
// Notification Routes for Frontend Integration
// src/routes/notification.routes.js

const express = require('express');
const authMiddleware = require('../middlewares/auth.jwt');
const Notification = require('../models/Notification');
const ProductionFCMService = require('../services/production-fcm.service');

const router = express.Router();

// Get user notifications
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