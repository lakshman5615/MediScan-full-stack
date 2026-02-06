
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AutoTokenManager = require('../services/auto-token-manager');



exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password, age } = req.body;

    // check user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      phone,
      age,
      password: hashedPassword
    });

    // ✅ AUTO FCM TOKEN ASSIGNMENT
    await AutoTokenManager.autoAssignToken(user._id);
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not defined');
    }
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // res.status(201).json({
    //   success: true,
    //   message: 'Signup successful ✅',
    //   token,
    //   userId: user._id
    // });
    res.status(201).json({
      success: true,
      message: "Signup successful ✅",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // const token = jwt.sign(
    //   { _id: user._id },
    //  process.env.JWT_SECRET || 'secretkey',

    //   { expiresIn: '7d' }
    // );
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not defined');
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful ✅',
      token,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
////added 30-01-26
// const User = require('../models/User');

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name email phone fcmToken age");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile data",
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
