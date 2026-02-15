const express = require('express');
const authMiddleware = require('../middlewares/auth.jwt');
const Medicine = require('../models/Medicine');
const DoseHistory = require('../models/doseHistory');
const Alert = require('../models/Alert');
const ProductionFCMService = require('../services/production-fcm.service');

const router = express.Router();

// ----------------------
// NEW: YouTube-style Action Handler (Unified)
// ----------------------
router.post('/action', authMiddleware, async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const { alertId, medicineId, action, source } = req.body; // source: 'notification' or 'alert'

        console.log('🎯 Medicine action request:', { userId, alertId, medicineId, action, source });

        const medicine = await Medicine.findOne({ _id: medicineId, userId });
        if (!medicine) {
            return res.status(404).json({ success: false, error: 'Medicine not found' });
        }

        // Handle action
        let result;
        if (action === 'taken') {
            result = await handleTakenAction(userId, medicine, source);
        } else if (action === 'missed') {
            result = await handleMissedAction(userId, medicine, source);
        } else {
            return res.status(400).json({ success: false, error: 'Invalid action' });
        }

        // Update both Alert and Notification (YouTube-style sync)
        await ProductionFCMService.handleAction(alertId, action, source);

        res.json({
            success: true,
            message: `Medicine ${action} successfully`,
            data: result,
            syncedFrom: source
        });

    } catch (error) {
        console.error('❌ Medicine action error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Helper: Handle taken action
async function handleTakenAction(userId, medicine, source) {
    // Update quantity
    medicine.quantity -= 1;
    await medicine.save();
    console.log('✅ Medicine quantity updated to:', medicine.quantity);

    // Save to DoseHistory
    const doseRecord = await DoseHistory.create({
        userId,
        medicineId: medicine._id,
        medicineName: medicine.medicineName,
        scheduledTime: medicine.schedule?.time || 'Unknown',
        scheduledAt: new Date(),
        status: 'TAKEN',
        actionSource: source
    });

    // Check for low stock
    if (medicine.quantity <= 2 && medicine.quantity > 0) {
        await ProductionFCMService.sendNotificationWithAlert(userId, {
            title: '⚠️ Low Stock Alert',
            message: `${medicine.medicineName} is running low. Only ${medicine.quantity} doses remaining.`,
            alertType: 'LOW_STOCK',
            medicineId: medicine._id,
            medicineName: medicine.medicineName,
            severity: 'WARNING'
        });
    }

    // Check for out of stock
    if (medicine.quantity === 0) {
        await ProductionFCMService.sendNotificationWithAlert(userId, {
            title: '🚫 Out of Stock',
            message: `${medicine.medicineName} is out of stock. Please refill your prescription.`,
            alertType: 'LOW_STOCK',
            medicineId: medicine._id,
            medicineName: medicine.medicineName,
            severity: 'CRITICAL'
        });
    }

    return {
        medicine: {
            name: medicine.medicineName,
            remainingQuantity: medicine.quantity,
            status: medicine.quantity === 0 ? 'Out of Stock' :
                    medicine.quantity <= 2 ? 'Low Stock' : 'Available'
        },
        doseHistoryId: doseRecord._id
    };
}

// Helper: Handle missed action
async function handleMissedAction(userId, medicine, source) {
    // Save to DoseHistory (no quantity change)
    const doseRecord = await DoseHistory.create({
        userId,
        medicineId: medicine._id,
        medicineName: medicine.medicineName,
        scheduledTime: medicine.schedule?.time || 'Unknown',
        scheduledAt: new Date(),
        status: 'MISSED',
        actionSource: source
    });

    return {
        medicine: {
            name: medicine.medicineName,
            quantity: medicine.quantity,
            nextReminder: medicine.schedule?.time,
            note: 'Quantity unchanged - dose was missed'
        },
        doseHistoryId: doseRecord._id
    };
}

// ----------------------
// Medicine Taken
// ----------------------
router.post('/taken/:medicineId', authMiddleware, async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const { medicineId } = req.params;

        console.log('🎯 Medicine taken request:', { userId, medicineId });

        const medicine = await Medicine.findOne({ _id: medicineId, userId });
        if (!medicine) {
            console.log('❌ Medicine not found:', medicineId);
            return res.status(404).json({ success: false, error: 'Medicine not found' });
        }

        console.log('💊 Found medicine:', medicine.medicineName, 'Quantity:', medicine.quantity);

        // Update quantity
        medicine.quantity -= 1;
        await medicine.save();
        console.log('✅ Medicine quantity updated to:', medicine.quantity);

        // FCM Notification
        await ProductionFCMService.sendNotification(userId, '✅ Medicine Taken',
            `${medicine.medicineName} marked as taken. Remaining: ${medicine.quantity} doses`,
            { medicineId, userId });

//         // Low stock alert
//         if (medicine.quantity <= 2 && medicine.quantity > 0) {
//             await ProductionFCMService.sendNotification(userId, '⚠️ Low Stock Alert',
//                 `${medicine.medicineName} is running low. Only ${medicine.quantity} doses remaining.`,
//                 { medicineId, userId });
//         }

//         // Out of stock
//         if (medicine.quantity === 0) {
//             await ProductionFCMService.sendNotification(userId, '🚫 Out of Stock',
//                 `${medicine.medicineName} is out of stock. Please refill your prescription.`,
//                 { medicineId, userId });
//         }

        // ---- Save to DoseHistory ----
        console.log('💾 Saving to DoseHistory:', {
            userId: userId.toString(),
            medicineId: medicineId.toString(),
            medicineName: medicine.medicineName,
            scheduledTime: medicine.schedule.time,
            status: 'TAKEN'
        });
        
        try {
            const doseRecord = await DoseHistory.create({
                userId,
                medicineId,
                medicineName: medicine.medicineName,
                scheduledTime: medicine.schedule.time,
                scheduledAt: new Date(),
                status: 'TAKEN'
            });
            
            console.log('✅ DoseHistory saved successfully:', doseRecord._id);
        } catch (doseError) {
            console.error('❌ DoseHistory save error:', doseError);
            // Don't fail the whole request if dose history fails
        }

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
        console.error('❌ Medicine taken error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ----------------------
// Medicine Missed
// ----------------------
router.post('/missed/:medicineId', authMiddleware, async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const { medicineId } = req.params;

        console.log('🎯 Medicine missed request:', { userId, medicineId });

        const medicine = await Medicine.findOne({ _id: medicineId, userId });
        if (!medicine) {
            console.log('❌ Medicine not found:', medicineId);
            return res.status(404).json({ success: false, error: 'Medicine not found' });
        }

        console.log('💊 Found medicine for missed:', medicine.medicineName);

        // FCM Notification
        await ProductionFCMService.sendNotification(userId, '⏭️ Dose Missed',
            `${medicine.medicineName} dose missed. Don't forget next scheduled time: ${medicine.schedule.time}`,
            { medicineId, userId });

        // ---- Save to DoseHistory ----
        console.log('💾 Saving MISSED to DoseHistory:', {
            userId: userId.toString(),
            medicineId: medicineId.toString(),
            medicineName: medicine.medicineName,
            scheduledTime: medicine.schedule.time,
            status: 'MISSED'
        });
        
        try {
            const doseRecord = await DoseHistory.create({
                userId,
                medicineId,
                medicineName: medicine.medicineName,
                scheduledTime: medicine.schedule.time,
                scheduledAt: new Date(),
                status: 'MISSED'
            });
            
            console.log('✅ MISSED DoseHistory saved successfully:', doseRecord._id);
        } catch (doseError) {
            console.error('❌ MISSED DoseHistory save error:', doseError);
            // Don't fail the whole request if dose history fails
        }

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
        console.error('❌ Medicine missed error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ----------------------
// Get medicine status
// ----------------------
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

// ----------------------
// Test DoseHistory (for debugging)
// ----------------------
router.post('/test-dose-history', authMiddleware, async (req, res) => {
    try {
        const { _id: userId } = req.user;
        
        console.log('🧪 Testing DoseHistory creation for user:', userId);
        
        const testRecord = await DoseHistory.create({
            userId,
            medicineId: new require('mongoose').Types.ObjectId(),
            medicineName: 'Test Medicine',
            scheduledTime: '08:00',
            scheduledAt: new Date(),
            status: 'TAKEN'
        });
        
        console.log('✅ Test DoseHistory created:', testRecord);
        
        res.json({
            success: true,
            message: 'Test dose history created',
            record: testRecord
        });
        
    } catch (error) {
        console.error('❌ Test DoseHistory error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
