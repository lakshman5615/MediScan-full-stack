const Medicine = require('../models/Medicine');

exports.addMedicine = async (req, res) => {
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

exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user._id });
    res.json({ success: true, data: medicines });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Medicine deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
