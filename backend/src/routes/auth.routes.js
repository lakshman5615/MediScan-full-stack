const express = require('express');
const { signup } = require('../controllers/auth.controller');
const { signupValidation } = require('../middlewares/auth.middleware');
const { login } = require('../controllers/auth.controller');
const { loginValidation } = require('../middlewares/auth.middleware');
const authMiddleware = require("../middlewares/auth.jwt");


const router = require("express").Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);


router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Profile data",
        user: req.user
    });
});


module.exports = router;