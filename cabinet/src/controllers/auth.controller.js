// src/controllers/auth.controller.js

exports.signup = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Signup API working ✅',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Signup failed',
    });
  }
};

exports.login = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Login API working ✅',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};
