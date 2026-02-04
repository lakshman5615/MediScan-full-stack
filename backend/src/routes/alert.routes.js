const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.jwt');
const alertController = require('../controllers/alert.controller');

router.get('/', authMiddleware, alertController.getAlerts);
router.post('/action', authMiddleware, alertController.handleAction);

module.exports = router;