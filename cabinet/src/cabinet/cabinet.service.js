const Cabinet = require('./cabinet.model');

class CabinetService {

  async addMedicine(data) {
    return await Cabinet.create({ ...data, remainingQuantity: data.quantity });
  }

  async getUserCabinet(userId) {
    return await Cabinet.find({ userId });
  }

  async markTaken(cabinetId) {
    const med = await Cabinet.findById(cabinetId);
    if (!med) return null;

    med.remainingQuantity -= 1;
    if (med.remainingQuantity <= 0) med.status = 'completed';

    await med.save();
    return med;
  }
}

module.exports = new CabinetService();
