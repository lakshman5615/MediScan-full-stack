const Medicine = require('../models/Medicine');

/**
 * Add medicine to user's cabinet
 */
exports.addMedicine = async ({ userId, ...data }) => {
  return await Medicine.create({
    ...data,
    userId
  });
};

/**
 * Get all medicines of a user
 */
exports.getUserCabinet = async (userId) => {
  return await Medicine.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Mark medicine as taken (reduce quantity by 1)
 */
exports.markTaken = async (medicineId) => {
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) return null;

  if (medicine.quantity > 0) {
    medicine.quantity -= 1;
  }

  await medicine.save();
  return medicine;
};

exports.getMedicineById = async (medicineId, userId) => {
  return await Medicine.findOne({ _id: medicineId, userId });
};
