const Medicine = require('../models/Medicine');
const DoseHistory = require('../models/doseHistory');
const AlertService = require('../services/alert.service');

// POST /api/medicine/add
exports.addMedicine = async (req, res) => {
    try {
        const { 
            name, 
            brand, 
            medicineType, 
            dosage, 
            totalQuantity, 
            expiryDate, 
            lowStockThreshold, 
            schedule 
        } = req.body;

        console.log('🔍 ADD MEDICINE REQUEST:');
        console.log('   totalQuantity from frontend:', totalQuantity, typeof totalQuantity);
        console.log('   lowStockThreshold from frontend:', lowStockThreshold, typeof lowStockThreshold);

        // Validation
        if (!name || !medicineType || !totalQuantity || !expiryDate) {
            return res.status(400).json({ 
                success: false, 
                error: 'Required fields: name, medicineType, totalQuantity, expiryDate' 
            });
        }

        const medicine = new Medicine({
            userId: req.user._id,
            name,
            brand: brand || '',
            medicineType,
            dosage: dosage || '',
            totalQuantity,
            remainingQuantity: totalQuantity,
            expiryDate: new Date(expiryDate),
            lowStockThreshold: lowStockThreshold || 2,
            schedule: schedule || {
                morning: { enabled: false, time: '08:00' },
                afternoon: { enabled: false, time: '13:00' },
                evening: { enabled: false, time: '18:00' },
                night: { enabled: false, time: '22:00' }
            }
        });

        console.log('💾 Saving medicine with:');
        console.log('   totalQuantity:', medicine.totalQuantity);
        console.log('   remainingQuantity:', medicine.remainingQuantity);
        console.log('   lowStockThreshold:', medicine.lowStockThreshold);

        await medicine.save();
        
        console.log('✅ Medicine saved to DB:');
        console.log('   totalQuantity:', medicine.totalQuantity);
        console.log('   remainingQuantity:', medicine.remainingQuantity);
        console.log('   lowStockThreshold:', medicine.lowStockThreshold);
        
        res.status(201).json({ success: true, data: medicine });
    } catch (error) {
        console.error('❌ Add medicine error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /api/medicine - with search and filters
exports.getMedicines = async (req, res) => {
    try {
        const { search, filter } = req.query;
        let query = { userId: req.user._id };

        // Search by name, symptoms, activeIngredients
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { symptoms: { $in: [new RegExp(search, 'i')] } },
                { activeIngredients: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const medicines = await Medicine.find(query).sort({ createdAt: -1 });

        // Apply status filters after fetching (since status is virtual)
        let filteredMedicines = medicines;
        if (filter) {
            filteredMedicines = medicines.filter(medicine => {
                const status = medicine.status; // Virtual field
                switch (filter) {
                    case 'LOW_STOCK': return status === 'LOW_STOCK';
                    case 'EXPIRED': return status === 'EXPIRED';
                    case 'EXPIRING': 
                        const daysUntilExpiry = Math.ceil((new Date(medicine.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                        return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
                    case 'HIGH_STOCK': return medicine.remainingQuantity > medicine.lowStockThreshold * 2;
                    default: return true;
                }
            });
        }

        res.json({ success: true, data: filteredMedicines });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /api/medicine/:id
exports.getMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        
        if (!medicine) {
            return res.status(404).json({ success: false, error: 'Medicine not found' });
        }

        res.json({ success: true, data: medicine });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// PUT /api/medicine/update/:id
exports.updateMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        
        if (!medicine) {
            return res.status(404).json({ success: false, error: 'Medicine not found' });
        }

        const { 
            name, 
            brand, 
            medicineType, 
            dosage, 
            totalQuantity, 
            expiryDate, 
            lowStockThreshold, 
            schedule 
        } = req.body;

        // Update fields
        if (name) medicine.name = name;
        if (brand !== undefined) medicine.brand = brand;
        if (medicineType) medicine.medicineType = medicineType;
        if (dosage !== undefined) medicine.dosage = dosage;
        if (totalQuantity !== undefined) {
            const oldTotal = medicine.totalQuantity;
            const oldRemaining = medicine.remainingQuantity;
            medicine.totalQuantity = totalQuantity;
            // If increasing total, add difference to remaining
            if (totalQuantity > oldTotal) {
                medicine.remainingQuantity = oldRemaining + (totalQuantity - oldTotal);
            } else {
                // If decreasing, set remaining = new total
                medicine.remainingQuantity = totalQuantity;
            }
        }
        if (expiryDate) medicine.expiryDate = new Date(expiryDate);
        if (lowStockThreshold !== undefined) medicine.lowStockThreshold = lowStockThreshold;
        if (schedule) {
            medicine.schedule = { ...medicine.schedule, ...schedule };
            console.log(`🕒 Updated schedule for ${medicine.name}:`, JSON.stringify(medicine.schedule, null, 2));
        }

        await medicine.save();
        
        // 🗑️ Delete ALL alerts for this medicine today (including uniqueKey)
        const Alert = require('../models/Alert');
        const today = new Date().toISOString().split('T')[0];
        const deleted = await Alert.deleteMany({
            medicineId: medicine._id,
            createdAt: { $gte: new Date(today) }
        });
        console.log(`🧹 Deleted ${deleted.deletedCount} alerts for ${medicine.name} after update`);
        
        res.json({ success: true, data: medicine });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE /api/medicine/delete/:id
exports.deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        
        if (!medicine) {
            return res.status(404).json({ success: false, error: 'Medicine not found' });
        }

        res.json({ success: true, message: 'Medicine deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST /api/medicine/taken/:id - Mark dose as taken
exports.markTaken = async (req, res) => {
    try {
        const { scheduledTime } = req.body; // morning/afternoon/evening/night
        
        const medicine = await Medicine.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        
        if (!medicine) {
            return res.status(404).json({ success: false, error: 'Medicine not found' });
        }

        // Reduce remaining quantity only on TAKEN
        if (medicine.remainingQuantity > 0) {
            medicine.remainingQuantity -= 1;
            await medicine.save();
            
            // Check if now low stock and create alert
            if (medicine.remainingQuantity <= medicine.lowStockThreshold) {
                await AlertService.createLowStockAlert(medicine);
            }
        }

        // Record in dose history
        await DoseHistory.create({
            userId: req.user._id,
            medicineId: medicine._id,
            medicineName: medicine.name,
            scheduledTime: scheduledTime || 'manual',
            scheduledAt: new Date(),
            status: 'TAKEN'
        });

        res.json({ 
            success: true, 
            message: 'Dose marked as taken',
            remainingQuantity: medicine.remainingQuantity,
            status: medicine.status
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST /api/medicine/missed/:id - Mark dose as missed
exports.markMissed = async (req, res) => {
    try {
        const { scheduledTime } = req.body;
        
        const medicine = await Medicine.findOne({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        
        if (!medicine) {
            return res.status(404).json({ success: false, error: 'Medicine not found' });
        }

        // Record in dose history (no quantity change for missed)
        await DoseHistory.create({
            userId: req.user._id,
            medicineId: medicine._id,
            medicineName: medicine.name,
            scheduledTime: scheduledTime || 'manual',
            scheduledAt: new Date(),
            status: 'MISSED'
        });

        res.json({ 
            success: true, 
            message: 'Dose marked as missed',
            remainingQuantity: medicine.remainingQuantity,
            status: medicine.status
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};