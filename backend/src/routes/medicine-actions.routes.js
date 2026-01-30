const express = require('express');
const authMiddleware = require('../middlewares/auth.jwt');
const Medicine = require('../models/Medicine');
<<<<<<< HEAD
=======
const DoseHistory = require('../models/doseHistory');
>>>>>>> origin/cabinet-feature-bk
const ProductionFCMService = require('../services/production-fcm.service');

const router = express.Router();

<<<<<<< HEAD
// Medicine Taken
=======
// ----------------------
// Medicine Taken
// ----------------------
>>>>>>> origin/cabinet-feature-bk
router.post('/taken/:medicineId', authMiddleware, async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const { medicineId } = req.params;

        const medicine = await Medicine.findOne({ _id: medicineId, userId });
        if (!medicine) return res.status(404).json({ success: false, error: 'Medicine not found' });

        medicine.quantity -= 1;
        await medicine.save();

<<<<<<< HEAD
=======
        // FCM Notification
>>>>>>> origin/cabinet-feature-bk
        await ProductionFCMService.sendNotification(userId, '✅ Medicine Taken',
            `${medicine.medicineName} marked as taken. Remaining: ${medicine.quantity} doses`,
            { medicineId, userId });

        // Low stock alert
        if (medicine.quantity <= 2 && medicine.quantity > 0) {
            await ProductionFCMService.sendNotification(userId, '⚠️ Low Stock Alert',
                `${medicine.medicineName} is running low. Only ${medicine.quantity} doses remaining.`,
                { medicineId, userId });
        }

        // Out of stock
        if (medicine.quantity === 0) {
            await ProductionFCMService.sendNotification(userId, '🚫 Out of Stock',
                `${medicine.medicineName} is out of stock. Please refill your prescription.`,
                { medicineId, userId });
        }

<<<<<<< HEAD
=======
        // ---- Save to DoseHistory ----
        await DoseHistory.create({
            userId,
            medicineId,
            medicineName: medicine.medicineName,
            scheduledTime: medicine.schedule.time,
            scheduledAt: new Date(),
            status: 'TAKEN'
        });

>>>>>>> origin/cabinet-feature-bk
        res.json({
            success: true,
            message: 'Medicine marked as taken',
            medicine: {
                name: medicine.medicineName,
                remainingQuantity: medicine.quantity,
                status: medicine.quantity === 0 ? 'Out of Stock' :
                        medicine.quantity <= 2 ? 'Low Stock' : 'Available'
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

<<<<<<< HEAD
// Medicine Missed
=======
// ----------------------
// Medicine Missed
// ----------------------
>>>>>>> origin/cabinet-feature-bk
router.post('/missed/:medicineId', authMiddleware, async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const { medicineId } = req.params;

        const medicine = await Medicine.findOne({ _id: medicineId, userId });
        if (!medicine) return res.status(404).json({ success: false, error: 'Medicine not found' });

<<<<<<< HEAD
=======
        // FCM Notification
>>>>>>> origin/cabinet-feature-bk
        await ProductionFCMService.sendNotification(userId, '⏭️ Dose Missed',
            `${medicine.medicineName} dose missed. Don't forget next scheduled time: ${medicine.schedule.time}`,
            { medicineId, userId });

<<<<<<< HEAD
=======
        // ---- Save to DoseHistory ----
        await DoseHistory.create({
            userId,
            medicineId,
            medicineName: medicine.medicineName,
            scheduledTime: medicine.schedule.time,
            scheduledAt: new Date(),
            status: 'MISSED'
        });

>>>>>>> origin/cabinet-feature-bk
        res.json({
            success: true,
            message: 'Medicine marked as missed',
            medicine: {
                name: medicine.medicineName,
                quantity: medicine.quantity,
                nextReminder: medicine.schedule.time,
                note: 'Quantity unchanged - dose was missed'
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

<<<<<<< HEAD
// Get medicine status
=======
// ----------------------
// Get medicine status
// ----------------------
>>>>>>> origin/cabinet-feature-bk
router.get('/status/:medicineId', authMiddleware, async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const { medicineId } = req.params;

        const medicine = await Medicine.findOne({ _id: medicineId, userId });
        if (!medicine) return res.status(404).json({ success: false, error: 'Medicine not found' });

        const today = new Date();
        const expiryDate = new Date(medicine.expiryDate);
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

        let stockStatus = 'Available';
        if (medicine.quantity === 0) stockStatus = 'Out of Stock';
        else if (medicine.quantity <= 2) stockStatus = 'Low Stock';

        let expiryStatus = 'Good';
        if (daysUntilExpiry <= 0) expiryStatus = 'Expired';
        else if (daysUntilExpiry <= 7) expiryStatus = 'Expiring Soon';

        res.json({
            success: true,
            medicine: {
                id: medicine._id,
                name: medicine.medicineName,
                quantity: medicine.quantity,
                scheduleTime: medicine.schedule.time,
                expiryDate: medicine.expiryDate,
                stockStatus,
                expiryStatus,
                daysUntilExpiry: daysUntilExpiry > 0 ? daysUntilExpiry : 0
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
