const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    const user = await User.findById(decoded._id); // ✅ FIX HERE
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: error.message });
  }
};