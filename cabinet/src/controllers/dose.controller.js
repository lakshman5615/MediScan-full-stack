const DoseHistory = require('../models/DoseHistory');
const Medicine = require('../models/Medicine');

exports.markDose = async (req, res) => {
  const { medicineId, status, scheduledTime } = req.body;

  const medicine = await Medicine.findById(medicineId);

  const dose = await DoseHistory.create({
    userId: req.user.id,
    medicineId,
    medicineName: medicine.name,
    scheduledTime,
    scheduledAt: new Date(),
    status
  });

  // agar TAKEN → quantity kam karo
  if (status === 'TAKEN') {
    medicine.quantity -= 1;
    await medicine.save();
  }

  res.json({ success: true, dose });
};

exports.getDoseHistory = async (req, res) => {
  const history = await DoseHistory.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json(history);
};
