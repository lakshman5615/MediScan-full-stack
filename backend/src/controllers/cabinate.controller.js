const cabinetService = require('../cabinet/cabinet.service');

exports.addMedicine = async (req, res) => {
  try {
    const medicine = await cabinetService.addMedicine({ userId: req.user.id, ...req.body });
    res.status(201).json({ success: true, data: medicine });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};

exports.getCabinet = async (req, res) => {
  const meds = await cabinetService.getUserCabinet(req.user.id);
  res.json({ success: true, data: meds });
};

exports.markMedicineTaken = async (req, res) => {
  const result = await cabinetService.markTaken(req.params.id);
  if (!result) return res.status(404).json({ error: 'Medicine not found' });
  res.json({ success: true, data: result });
};
