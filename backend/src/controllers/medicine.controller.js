const Medicine = require('../models/Medicine');
const AIService = require('../services/ai.service');

class MedicineController {
  // Get user medicines for My Cabinet
  async getMedicines(req, res) {
    try {
      const { userId } = req.user;
      const medicines = await Medicine.find({ userId });
      
      const active = medicines.filter(m => m.quantity > 0);
      const lowStock = medicines.filter(m => m.quantity > 0 && m.quantity < 5);
      
      res.json({ active, lowStock });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Add new medicine
  async addMedicine(req, res) {
    try {
      const { userId } = req.user;
      const { medicineName, expiryDate, quantity, schedule, aiExplanation } = req.body;
      
      const medicine = await Medicine.create({
        userId,
        medicineName,
        expiryDate,
        quantity,
        schedule,
        aiExplanation
      });
      
      res.json({ message: 'Medicine added successfully', medicine });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Accept medicine reminder
  async acceptMedicine(req, res) {
    try {
      const { medicineId } = req.body;
      
      const medicine = await Medicine.findByIdAndUpdate(
        medicineId,
        { $inc: { quantity: -1 } },
        { new: true }
      );
      
      res.json({ message: 'Medicine taken', quantity: medicine.quantity });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Reject medicine reminder
  async rejectMedicine(req, res) {
    try {
      const { medicineId } = req.body;
      
      await Medicine.findByIdAndUpdate(
        medicineId,
        { $inc: { missedCount: 1 } }
      );
      
      res.json({ message: 'Medicine missed' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get alerts (low stock & expiry)
  async getAlerts(req, res) {
    try {
      const { userId } = req.user;
      const today = new Date();
      const fiveDaysLater = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
      
      const lowStock = await Medicine.find({ userId, quantity: { $lt: 5, $gt: 0 } });
      const expiringSoon = await Medicine.find({ 
        userId, 
        expiryDate: { $lte: fiveDaysLater } 
      });
      
      res.json({ lowStock, expiringSoon });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MedicineController();