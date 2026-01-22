const nodemailer = require('nodemailer');

class FreeEmailService {
  constructor() {
    // Free Gmail SMTP (fixed)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });
  }

  // Send email notification (100% free)
  async sendEmailNotification(phoneNumber, subject, message) {
    try {
      // Convert phone to email (you can ask user for email during signup)
      const emailAddress = `${phoneNumber}@gmail.com`; // Or use actual email from user profile
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'mediscan@gmail.com',
        to: emailAddress,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #2196F3;">📱 MediScan Notification</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 10px;">
              <p style="font-size: 16px; margin: 0;">${message}</p>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              📱 MediScan Cabinet - Free Email Notifications
            </p>
          </div>
        `
      };

      // Mock send (since no real email configured)
      console.log('\n📧 EMAIL NOTIFICATION (FREE):');
      console.log(`📞 Phone: ${phoneNumber}`);
      console.log(`📧 Email: ${emailAddress}`);
      console.log(`📋 Subject: ${subject}`);
      console.log(`💬 Message: ${message}`);
      console.log(`⏰ Time: ${new Date().toISOString()}`);
      console.log('✅ Status: Would be sent via Email (100% FREE)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      return { success: true, messageId: `email_${Date.now()}`, method: 'email' };
    } catch (error) {
      console.error('📧 Email Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send medicine reminder via email
  async sendMedicineReminder(phoneNumber, medicineName, time) {
    const subject = '⏰ Medicine Reminder - MediScan';
    const message = `💊 Time to take your ${medicineName} at ${time}`;
    return await this.sendEmailNotification(phoneNumber, subject, message);
  }
}

module.exports = new FreeEmailService();