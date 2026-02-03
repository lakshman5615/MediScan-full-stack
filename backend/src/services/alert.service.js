const Alert = require('../models/Alert');
const Medicine = require('../models/Medicine');
const DoseHistory = require('../models/doseHistory');
const ProductionFCMService = require('./production-fcm.service');

class AlertService {
    
    // Create reminder alert
    static async createReminderAlert(medicine, scheduledTime) {
        const today = new Date().toDateString();
        const uniqueKey = `reminder_${medicine._id}_${scheduledTime}_${today}`;
        
        // Check if already exists
        const existing = await Alert.findOne({ uniqueKey });
        if (existing) return existing;
        
        const alert = await Alert.create({
            userId: medicine.userId,
            type: 'REMINDER',
            medicineId: medicine._id,
            medicineName: medicine.name,
            dosage: medicine.dosage,
            status: 'PENDING',
            severity: 'NORMAL',
            meta: { scheduledTime },
            uniqueKey
        });
        
        // Send FCM notification
        await this.sendReminderNotification(alert, medicine);
        
        return alert;
    }
    
    // Create expiry alert
    static async createExpiryAlert(medicine) {
        const today = new Date();
        const expiryDate = new Date(medicine.expiryDate);
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        
        let severity = 'NORMAL';
        if (daysUntilExpiry <= 0) severity = 'CRITICAL'; // EXPIRED
        else if (daysUntilExpiry <= 7) severity = 'WARNING'; // EXPIRING_SOON
        
        const uniqueKey = `expiry_${medicine._id}_${expiryDate.toDateString()}`;
        
        const existing = await Alert.findOne({ uniqueKey });
        if (existing) return existing;
        
        const alert = await Alert.create({
            userId: medicine.userId,
            type: 'EXPIRY',
            medicineId: medicine._id,
            medicineName: medicine.name,
            status: 'PENDING',
            severity,
            meta: { expiryDate },
            uniqueKey
        });
        
        // Send FCM notification
        await this.sendExpiryNotification(alert, daysUntilExpiry);
        
        return alert;
    }
    
    // Create low stock alert
    static async createLowStockAlert(medicine) {
        const uniqueKey = `stock_${medicine._id}_${medicine.remainingQuantity}`;
        
        const existing = await Alert.findOne({ uniqueKey });
        if (existing) return existing;
        
        const alert = await Alert.create({
            userId: medicine.userId,
            type: 'LOW_STOCK',
            medicineId: medicine._id,
            medicineName: medicine.name,
            status: 'PENDING',
            severity: 'WARNING',
            meta: { 
                stockLeft: medicine.remainingQuantity,
                threshold: medicine.lowStockThreshold 
            },
            uniqueKey
        });
        
        // Send FCM notification
        await this.sendLowStockNotification(alert, medicine);
        
        return alert;
    }
    
    // Handle alert actions
    static async handleAction(alertId, action, userId) {
        const alert = await Alert.findOne({ _id: alertId, userId });
        if (!alert) throw new Error('Alert not found');
        
        alert.status = action;
        alert.showInUI = action === 'DISMISSED' ? false : true;
        
        // Handle TAKEN action
        if (action === 'TAKEN' && alert.type === 'REMINDER') {
            const medicine = await Medicine.findById(alert.medicineId);
            if (medicine && medicine.remainingQuantity > 0) {
                medicine.remainingQuantity -= 1;
                await medicine.save();
                
                // Check if now low stock
                if (medicine.remainingQuantity <= medicine.lowStockThreshold) {
                    await this.createLowStockAlert(medicine);
                }
            }
            
            // Create dose history
            await DoseHistory.create({
                userId,
                medicineId: alert.medicineId,
                medicineName: alert.medicineName,
                scheduledTime: alert.meta.scheduledTime,
                scheduledAt: new Date(),
                status: 'TAKEN'
            });
        }
        
        // Handle MISSED action
        if (action === 'MISSED' && alert.type === 'REMINDER') {
            await DoseHistory.create({
                userId,
                medicineId: alert.medicineId,
                medicineName: alert.medicineName,
                scheduledTime: alert.meta.scheduledTime,
                scheduledAt: new Date(),
                status: 'MISSED'
            });
        }
        
        await alert.save();
        return alert;
    }
    
    // FCM Notifications
    static async sendReminderNotification(alert, medicine) {
        try {
            await ProductionFCMService.sendNotification(
                alert.userId,
                '💊 Medicine Reminder',
                `Time to take ${alert.medicineName} (${alert.meta.scheduledTime.toUpperCase()})`,
                {
                    alertId: alert._id.toString(),
                    medicineId: alert.medicineId.toString(),
                    type: 'REMINDER',
                    actions: JSON.stringify([
                        { action: 'TAKEN', title: '✅ Confirm Taken' },
                        { action: 'MISSED', title: '❌ Mark Missed' }
                    ])
                }
            );
            
            alert.sentToDevice = true;
            await alert.save();
        } catch (error) {
            console.error('FCM reminder error:', error);
        }
    }
    
    static async sendExpiryNotification(alert, daysUntilExpiry) {
        try {
            const title = daysUntilExpiry <= 0 ? '🚨 Medicine Expired' : '⚠️ Medicine Expiring Soon';
            const message = daysUntilExpiry <= 0 
                ? `${alert.medicineName} has expired`
                : `${alert.medicineName} expires in ${daysUntilExpiry} days`;
            
            await ProductionFCMService.sendNotification(
                alert.userId,
                title,
                message,
                {
                    alertId: alert._id.toString(),
                    medicineId: alert.medicineId.toString(),
                    type: 'EXPIRY'
                }
            );
            
            alert.sentToDevice = true;
            await alert.save();
        } catch (error) {
            console.error('FCM expiry error:', error);
        }
    }
    
    static async sendLowStockNotification(alert, medicine) {
        try {
            await ProductionFCMService.sendNotification(
                alert.userId,
                '📦 Low Stock Alert',
                `${alert.medicineName} is running low (${medicine.remainingQuantity} left)`,
                {
                    alertId: alert._id.toString(),
                    medicineId: alert.medicineId.toString(),
                    type: 'LOW_STOCK'
                }
            );
            
            alert.sentToDevice = true;
            await alert.save();
        } catch (error) {
            console.error('FCM stock error:', error);
        }
    }
}

module.exports = AlertService;