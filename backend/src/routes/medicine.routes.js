const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.jwt'); 
const Medicine = require('../models/Medicine');

// Add medicine
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { medicineName, quantity, expiryDate, schedule } = req.body;
        const { _id: userId } = req.user;

        const medicine = new Medicine({
            userId,
            medicineName,
            quantity,
            expiryDate: new Date(expiryDate),
            schedule,
            status: 'accepted'
        });

        await medicine.save();

        res.status(201).json({
            success: true,
            message: 'Medicine added successfully',
            medicine
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get user medicines
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const medicines = await Medicine.find({ userId });
        res.json({ success: true, medicines });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Mark medicine as taken
// router.put('/taken/:medicineId', authMiddleware, async (req, res) => {
//     try {
//         const { _id: userId } = req.user;
//         const { medicineId } = req.params;

//         const medicine = await Medicine.findOne({ _id: medicineId, userId });
//         if (!medicine) return res.status(404).json({ success: false, error: 'Medicine not found' });

//         medicine.quantity -= 1;
//         await medicine.save();

//         res.json({
//             success: true,
//             message: 'Medicine marked as taken',
//             medicine: { name: medicine.medicineName, remainingQuantity: medicine.quantity }
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

module.exports = router;
