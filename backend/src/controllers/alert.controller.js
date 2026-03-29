const Alert = require('../models/Alert');
const AlertService = require('../services/alert.service');

// GET /api/alerts - Fetch all alerts for UI
exports.getAlerts = async (req, res) => {
    try {
        console.log(`\n🔍 GET /api/alerts called by user: ${req.user._id}`);
        
        // 🔍 YAHAN FILTER: Sirf PENDING status aur showInUI = true wale alerts
        const alerts = await Alert.find({ 
            userId: req.user._id,
            showInUI: true,  // ← NOTIFICATION SE ACTION LENE PAR YE FALSE HO JAYEGA
            status: 'PENDING' // ← SIRF PENDING ALERTS
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
                    remainingQuantity: a.medicineId.remainingQuantity,
                    expiryDate: a.medicineId.expiryDate
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
        
        // 🔍 STEP 1: Validate action
        console.log(`\n🎯 ACTION REQUEST:`);
        console.log(`   Alert ID: ${alertId}`);
        console.log(`   Action: ${action}`);
        console.log(`   User: ${req.user._id}`);
        
        if (!['TAKEN', 'MISSED', 'DISMISSED'].includes(action)) {
            return res.status(400).json({ success: false, error: 'Invalid action' });
        }
        
        // 🔍 STEP 2: AlertService.handleAction() call - Yahan quantity -1 hoti hai
        console.log(`📞 Calling AlertService.handleAction()...`);
        const alert = await AlertService.handleAction(alertId, action, req.user._id);
        
        if (!alert) {
            console.log(`❌ Alert not found or already processed`);
            return res.status(404).json({ success: false, error: 'Alert not found' });
        }
        
        // 🔍 STEP 3: Response bhejo
        console.log(`✅ Action completed:`);
        console.log(`   Status: ${alert.status}`);
        console.log(`   ShowInUI: ${alert.showInUI}`);
        console.log(`   Resolved At: ${alert.resolvedAt}\n`);
        
        res.json({ 
            success: true, 
            message: `Alert marked as ${action}`,
            data: alert 
        });
    } catch (error) {
        console.error('❌ handleAction error:', error);
        if (error.message && error.message.includes('expired medicine')) {
            return res.status(400).json({ success: false, error: error.message });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};
