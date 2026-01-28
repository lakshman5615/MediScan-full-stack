const express = require('express');
const { signup, login } = require('../controllers/auth.controller');
const { signupValidation, loginValidation } = require('../middlewares/auth.validation');
const authMiddleware = require("../middlewares/auth.jwt");
const User = require('../models/User');

const router = express.Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);

// Get profile
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Profile data", user: req.user });
});

// Update FCM Token
router.post('/fcm-token', authMiddleware, async (req, res) => {
    try {
        const { fcmToken } = req.body;
        const { _id: userId } = req.user;
        if (!fcmToken) return res.status(400).json({ success: false, error: 'FCM token required' });

        await User.findByIdAndUpdate(userId, { fcmToken });

        res.json({ success: true, message: 'FCM token updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
