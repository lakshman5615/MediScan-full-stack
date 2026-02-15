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

exports.markMedicineTaken = async (req, res) => {
  const result = await cabinetService.markTaken(req.params.id);
  if (!result) return res.status(404).json({ error: 'Medicine not found' });
  res.json({ success: true, data: result });
};

exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await cabinetService.getMedicineById(req.params.id, req.user.id);
    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }
    res.json({ success: true, data: medicine });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4️⃣ Update Medicine
exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!medicine) return res.status(404).json({ success: false, error: "Medicine not found" });
    res.status(200).json({ success: true, data: medicine });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 5️⃣ Delete Medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!medicine) return res.status(404).json({ success: false, error: "Medicine not found" });
    res.status(200).json({ success: true, message: "Medicine deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
