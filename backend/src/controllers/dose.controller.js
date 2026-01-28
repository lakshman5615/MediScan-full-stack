const DoseHistory = require('../models/DoseHistory');

exports.markDose = async (req, res) => {
  try {
    const { medicineId, status, scheduledAt } = req.body;
    const userId = req.user._id;

    if (!['TAKEN', 'MISSED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const existing = await DoseHistory.findOne({
      userId,
      medicineId,
      scheduledAt
    });

    if (existing) {
      existing.status = status;
      await existing.save();
    } else {
      await DoseHistory.create({
        userId,
        medicineId,
        medicineName: req.body.medicineName,
        scheduledTime: req.body.scheduledTime,
        scheduledAt,
        status
      });
    }

    res.json({ success: true, message: `Dose marked as ${status}` });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



exports.getDoseHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const history = await DoseHistory
      .find({ userId })
      .populate('medicineId', 'medicineName')
      .sort({ scheduledAt: -1 });

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};