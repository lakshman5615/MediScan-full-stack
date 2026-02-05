const Medicine = require('../models/Medicine');

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Medicine.find({
      userId: req.user._id,
      schedule: { $exists: true }
    });
    res.json({ success: true, data: reminders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
