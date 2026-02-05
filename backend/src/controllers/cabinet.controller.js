const Medicine = require('../models/Medicine');

exports.addToCabinet = async (req, res) => {
  try {
    const medicine = new Medicine({
      userId: req.user._id,
      ...req.body
    });
    await medicine.save();
    res.status(201).json({ success: true, data: medicine });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCabinet = async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user._id });
    res.json({ success: true, data: medicines });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
