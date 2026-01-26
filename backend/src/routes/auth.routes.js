const express = require('express');
const { signup } = require('../controllers/auth.controller');
const { signupValidation } = require('../middlewares/auth.validation');
const { login } = require('../controllers/auth.controller');
const { loginValidation } = require('../middlewares/auth.validation');
const authMiddleware = require("../middlewares/auth.jwt");
const User = require('../models/User');


const router = require("express").Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);


router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Profile data",
        user: req.user
    });
});

// Update FCM Token
router.post('/fcm-token', authMiddleware, async (req, res) => {
    try {
        const { fcmToken } = req.body;
        const { _id: userId } = req.user;
        
        // Validate FCM token
        if (!fcmToken || fcmToken.length < 100) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid FCM token. Token must be generated from Firebase SDK.' 
            });
        }
        
        await User.findByIdAndUpdate(userId, { fcmToken });
        
        res.json({ 
            success: true,
            message: 'FCM token updated successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});


module.exports = router;