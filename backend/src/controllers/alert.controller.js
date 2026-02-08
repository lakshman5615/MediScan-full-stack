const Alert = require('../models/Alert');
const AlertService = require('../services/alert.service');

// GET /api/alerts - Fetch all alerts for UI
exports.getAlerts = async (req, res) => {
    try {
        console.log(`\n🔍 GET /api/alerts called by user: ${req.user._id}`);
        
        const alerts = await Alert.find({ 
            userId: req.user._id,
            showInUI: true,
            status: 'PENDING' // ✅ Only PENDING alerts
        })
        .populate('medicineId') // ✅ Medicine details populate karo
        .sort({ createdAt: -1 });
        
        console.log(`📊 Found ${alerts.length} alerts in database`);
        console.log(`   - REMINDER: ${alerts.filter(a => a.type === 'REMINDER').length}`);
        console.log(`   - EXPIRY: ${alerts.filter(a => a.type === 'EXPIRY').length}`);
        console.log(`   - LOW_STOCK: ${alerts.filter(a => a.type === 'LOW_STOCK').length}`);
        
        // ✅ Frontend ke liye proper format mein transform karo
        const reminders = alerts
            .filter(a => a.type === 'REMINDER')
            .map(a => ({
                _id: a._id,
                type: 'REMINDER',
                medicineName: a.medicineName,
                dosage: a.dosage,
                status: a.status,
                scheduledTime: a.meta?.scheduledTime || 'morning',
                createdAt: a.createdAt,
                medicineId: a.medicineId?._id,
                // ✅ Frontend ke liye extra fields
                medicine: a.medicineId ? {
                    _id: a.medicineId._id,
                    name: a.medicineId.name,
                    dosage: a.medicineId.dosage,
                    remainingQuantity: a.medicineId.remainingQuantity
                } : null
            }));
        
        const expiry = alerts
            .filter(a => a.type === 'EXPIRY')
            .map(a => ({
                _id: a._id,
                type: 'EXPIRY',
                medicineName: a.medicineName,
                status: a.status,
                severity: a.severity,
                expiryDate: a.meta?.expiryDate,
                createdAt: a.createdAt,
                medicineId: a.medicineId?._id,
                medicine: a.medicineId ? {
                    _id: a.medicineId._id,
                    name: a.medicineId.name,
                    expiryDate: a.medicineId.expiryDate,
                    remainingQuantity: a.medicineId.remainingQuantity
                } : null
            }));
        
        const lowStock = alerts
            .filter(a => a.type === 'LOW_STOCK')
            .map(a => ({
                _id: a._id,
                type: 'LOW_STOCK',
                medicineName: a.medicineName,
                status: a.status,
                severity: a.severity,
                stockLeft: a.meta?.stockLeft,
                threshold: a.meta?.threshold,
                createdAt: a.createdAt,
                medicineId: a.medicineId?._id,
                medicine: a.medicineId ? {
                    _id: a.medicineId._id,
                    name: a.medicineId.name,
                    remainingQuantity: a.medicineId.remainingQuantity,
                    lowStockThreshold: a.medicineId.lowStockThreshold
                } : null
            }));
        
        console.log(`✅ Sending response: ${reminders.length} reminders, ${expiry.length} expiry, ${lowStock.length} lowStock\n`);
        
        res.json({ 
            success: true, 
            data: { reminders, expiry, lowStock } 
        });
    } catch (error) {
        console.error('❌ getAlerts error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// POST /api/alerts/action - Handle actions from UI or FCM
exports.handleAction = async (req, res) => {
    try {
        const { alertId, action } = req.body;
        
        if (!['TAKEN', 'MISSED', 'DISMISSED'].includes(action)) {
            return res.status(400).json({ success: false, error: 'Invalid action' });
        }
        
        const alert = await AlertService.handleAction(alertId, action, req.user._id);
        
        res.json({ 
            success: true, 
            message: `Alert marked as ${action}`,
            data: alert 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};