// ============================================
// ALERT ROUTES - Frontend se connect karne ke liye
// ============================================
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.jwt');
const alertController = require('../controllers/alert.controller');

// GET /api/alerts - Saare alerts fetch karo (reminders, expiry, low stock)
router.get('/', authMiddleware, alertController.getAlerts);

// POST /api/alerts/action - Alert pe action lo (TAKEN/MISSED/DISMISSED)
router.post('/action', authMiddleware, alertController.handleAction);

module.exports = router;
