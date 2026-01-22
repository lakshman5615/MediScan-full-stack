const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const User = require('../models/User');

// Simple validation
const validateSignup = (req, res, next) => {
    const { name, email, password, phone, age } = req.body;
    if (!name || !email || !password || !phone || !age) {
        return res.status(400).json({ message: 'All fields required' });
    }
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }
    next();
};

// Routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// FCM Token update
router.post('/fcm-token', authMiddleware, async (req, res) => {
    try {
        const { fcmToken } = req.body;
        const { userId } = req.user;
        
        await User.findByIdAndUpdate(userId, { fcmToken });
        
        res.json({ message: 'FCM token updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes working!' });
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        
        res.json({ 
            success: true, 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                age: user.age,
                fcmToken: user.fcmToken,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message, success: false });
    }
});

module.exports = router;