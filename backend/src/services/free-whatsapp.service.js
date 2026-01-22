const { Client, LocalAuth } = require('whatsapp-web.js');

class FreeWhatsAppService {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.initializeClient();
  }

  async initializeClient() {
    try {
      // WhatsApp Web client (free)
      this.client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });

      this.client.on('qr', (qr) => {
        console.log('📱 WhatsApp QR Code generated. Scan with your phone:');
        console.log(qr);
        // You can also generate QR code image here
      });

      this.client.on('ready', () => {
        console.log('✅ WhatsApp Client is ready!');
        this.isReady = true;
      });

      this.client.on('auth_failure', (msg) => {
        console.error('❌ WhatsApp Authentication failed:', msg);
      });

      await this.client.initialize();
    } catch (error) {
      console.log('⚠️ WhatsApp initialization failed:', error.message);
      this.client = null;
    }
  }

  // Send free WhatsApp message
  async sendWhatsAppMessage(phoneNumber, message) {
    try {
      if (!this.client || !this.isReady) {
        // Fallback to console if WhatsApp not ready
        console.log('\n📱 WHATSAPP MESSAGE (MOCK - FREE):');
        console.log(`📞 To: ${phoneNumber}`);
        console.log(`💬 Message: ${message}`);
        console.log(`⏰ Time: ${new Date().toISOString()}`);
        console.log('✅ Status: Would be sent via WhatsApp Web (Free)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        return { success: true, messageId: `free_${Date.now()}`, mock: true };
      }

      // Format phone number for WhatsApp
      const chatId = `91${phoneNumber.replace(/^\+91/, '')}@c.us`;
      
      // Send message via WhatsApp Web
      await this.client.sendMessage(chatId, message);

      console.log('\n📱 FREE WHATSAPP MESSAGE SENT:');
      console.log(`📞 To: ${phoneNumber}`);
      console.log(`💬 Message: ${message}`);
      console.log(`✅ Status: Sent via WhatsApp Web (FREE)`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      return { success: true, messageId: `free_${Date.now()}`, method: 'whatsapp-web' };
    } catch (error) {
      console.error('📱 Free WhatsApp Error:', error);
      
      // Fallback to console
      console.log('\n📱 WHATSAPP FALLBACK (FREE):');
      console.log(`📞 To: ${phoneNumber}`);
      console.log(`💬 Message: ${message}`);
      console.log(`⚠️ Error: ${error.message}`);
      
      return { success: false, error: error.message, fallback: true };
    }
  }

  // Send medicine reminder via free WhatsApp
  async sendMedicineReminder(phoneNumber, medicineName, time) {
    const message = `⏰ *Medicine Reminder*\n\n💊 ${medicineName}\n🕐 Time: ${time}\n\n📱 MediScan Cabinet (Free)`;
    return await this.sendWhatsAppMessage(phoneNumber, message);
  }

  // Send low stock alert via free WhatsApp
  async sendLowStockAlert(phoneNumber, medicineName, quantity) {
    const message = `⚠️ *Low Stock Alert*\n\n💊 ${medicineName}\n📦 Only ${quantity} doses left\n\n🛒 Please restock soon!\n📱 MediScan Cabinet (Free)`;
    return await this.sendWhatsAppMessage(phoneNumber, message);
  }

  // Send expiry alert via free WhatsApp
  async sendExpiryAlert(phoneNumber, medicineName, daysLeft) {
    const message = `⏰ *Expiry Alert*\n\n💊 ${medicineName}\n📅 Expires in ${daysLeft} days\n\n⚠️ Please check expiry date!\n📱 MediScan Cabinet (Free)`;
    return await this.sendWhatsAppMessage(phoneNumber, message);
  }
}

module.exports = new FreeWhatsAppService();