// Notification Model for Database Storage
// src/models/Notification.js

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  title: {
    type: String,
    required: true
  },
  
  message: {
    type: String,
    required: true
  },
  
  type: {
    type: String,
    enum: ['medicine_reminder', 'low_stock', 'expiry_alert', 'general'],
    default: 'medicine_reminder'
  },
  
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: false
  },
  
  isRead: {
    type: Boolean,
    default: false
  },
  
  deliveryStatus: {
    type: String,
    enum: ['pending', 'delivered', 'failed'],
    default: 'pending'
  },
  
  deliveryMethod: {
    type: String,
    enum: ['fcm', 'database', 'console'],
    default: 'fcm'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  readAt: {
    type: Date,
    default: null
  }
});

// Index for faster queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);