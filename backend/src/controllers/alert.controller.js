const Alert = require('../models/Alert');
const AlertService = require('../services/alert.service');

// GET /api/alerts - Fetch all alerts for UI
exports.getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ 
            userId: req.user._id,
            showInUI: true 
        }).sort({ createdAt: -1 });
        
        // Group by type for UI sections
        const grouped = {
            reminders: alerts.filter(a => a.type === 'REMINDER'),
            expiry: alerts.filter(a => a.type === 'EXPIRY'),
            lowStock: alerts.filter(a => a.type === 'LOW_STOCK')
        };
        
        res.json({ success: true, data: grouped });
    } catch (error) {
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