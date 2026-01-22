const twilio = require('twilio');

class WhatsAppService {
  constructor() {
    // Twilio credentials (add to .env file)
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || 'your_account_sid';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || 'your_auth_token';
    this.whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
    
    try {
      this.client = twilio(this.accountSid, this.authToken);
      console.log('📱 WhatsApp Service initialized');
    } catch (error) {
      console.log('⚠️ WhatsApp Service initialization failed:', error.message);
      this.client = null;
    }
  }

  // Send WhatsApp message
  async sendWhatsAppMessage(phoneNumber, message) {
    try {
      if (!this.client) {
        // Fallback to console if Twilio not configured
        console.log('\n📱 WHATSAPP MESSAGE (MOCK):');
        console.log(`📞 To: ${phoneNumber}`);
        console.log(`💬 Message: ${message}`);
        console.log(`⏰ Time: ${new Date().toISOString()}`);
        console.log('✅ Status: Would be sent via WhatsApp');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        return { success: true, messageId: `mock_${Date.now()}`, mock: true };
      }

      const response = await this.client.messages.create({
        body: message,
        from: this.whatsappNumber,
        to: `whatsapp:+91${phoneNumber.replace(/^\+91/, '')}`
      });

      console.log('\n📱 WHATSAPP MESSAGE SENT:');
      console.log(`📞 To: ${phoneNumber}`);
      console.log(`💬 Message: ${message}`);
      console.log(`🆔 Message ID: ${response.sid}`);
      console.log(`✅ Status: ${response.status}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      return { success: true, messageId: response.sid, status: response.status };
    } catch (error) {
      console.error('📱 WhatsApp Error:', error);
      
      // Fallback to console
      console.log('\n📱 WHATSAPP FALLBACK:');
      console.log(`📞 To: ${phoneNumber}`);
      console.log(`💬 Message: ${message}`);
      console.log(`⚠️ Error: ${error.message}`);
      
      return { success: false, error: error.message, fallback: true };
    }
  }

  // Send medicine reminder via WhatsApp
  async sendMedicineReminder(phoneNumber, medicineName, time) {
    const message = `⏰ *Medicine Reminder*\n\n💊 ${medicineName}\n🕐 Time: ${time}\n\n📱 MediScan Cabinet`;
    return await this.sendWhatsAppMessage(phoneNumber, message);
  }

  // Send low stock alert via WhatsApp
  async sendLowStockAlert(phoneNumber, medicineName, quantity) {
    const message = `⚠️ *Low Stock Alert*\n\n💊 ${medicineName}\n📦 Only ${quantity} doses left\n\n🛒 Please restock soon!\n📱 MediScan Cabinet`;
    return await this.sendWhatsAppMessage(phoneNumber, message);
  }

  // Send expiry alert via WhatsApp
  async sendExpiryAlert(phoneNumber, medicineName, daysLeft) {
    const message = `⏰ *Expiry Alert*\n\n💊 ${medicineName}\n📅 Expires in ${daysLeft} days\n\n⚠️ Please check expiry date!\n📱 MediScan Cabinet`;
    return await this.sendWhatsAppMessage(phoneNumber, message);
  }
}

module.exports = new WhatsAppService();