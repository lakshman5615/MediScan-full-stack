// Check User Medicine Schedules Before 4:30 PM
const mongoose = require('mongoose');
const Medicine = require('./src/models/Medicine');
const User = require('./src/models/User');
require('dotenv').config();

async function checkMedicineSchedules() {
  try {
    console.log('🔍 Checking medicine schedules before 4:30 PM...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Get all medicines with their users
    const medicines = await Medicine.find({}).populate('userId', 'name email phone');
    
    if (medicines.length === 0) {
      console.log('📭 No medicines found in database');
      process.exit(0);
    }
    
    console.log(`💊 Total medicines in database: ${medicines.length}\n`);
    
    // Filter medicines scheduled before 4:30 PM (16:30)
    const medicinesBeforeTime = medicines.filter(medicine => {
      const scheduleTime = medicine.schedule.time;
      const [hours, minutes] = scheduleTime.split(':').map(Number);
      const scheduleMinutes = hours * 60 + minutes;
      const targetMinutes = 16 * 60 + 30; // 4:30 PM = 16:30
      
      return scheduleMinutes < targetMinutes;
    });
    
    console.log('⏰ MEDICINES SCHEDULED BEFORE 4:30 PM:');
    console.log('═══════════════════════════════════════════════════════════');
    
    if (medicinesBeforeTime.length === 0) {
      console.log('📭 No medicines scheduled before 4:30 PM');
    } else {
      medicinesBeforeTime.forEach((medicine, index) => {
        console.log(`${index + 1}. 💊 ${medicine.medicineName}`);
        console.log(`   👤 User: ${medicine.userId?.name || 'Unknown'}`);
        console.log(`   📧 Email: ${medicine.userId?.email || 'Unknown'}`);
        console.log(`   📱 Phone: ${medicine.userId?.phone || 'Unknown'}`);
        console.log(`   ⏰ Schedule: ${medicine.schedule.time} (${medicine.schedule.frequency})`);
        console.log(`   📦 Quantity: ${medicine.quantity}`);
        console.log(`   📅 Expiry: ${medicine.expiryDate.toDateString()}`);
        console.log(`   🔔 Status: ${medicine.status}`);
        console.log('   ─────────────────────────────────────────────────────────');
      });
    }
    
    // Show all schedules for reference
    console.log('\n📋 ALL MEDICINE SCHEDULES:');
    console.log('═══════════════════════════════════════════════════════════');
    
    const scheduleGroups = {};
    medicines.forEach(medicine => {
      const time = medicine.schedule.time;
      if (!scheduleGroups[time]) {
        scheduleGroups[time] = [];
      }
      scheduleGroups[time].push({
        name: medicine.medicineName,
        user: medicine.userId?.name || 'Unknown',
        quantity: medicine.quantity
      });
    });
    
    // Sort times
    const sortedTimes = Object.keys(scheduleGroups).sort((a, b) => {
      const [aHours, aMinutes] = a.split(':').map(Number);
      const [bHours, bMinutes] = b.split(':').map(Number);
      return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
    });
    
    sortedTimes.forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const timeMinutes = hours * 60 + minutes;
      const targetMinutes = 16 * 60 + 30;
      const beforeTarget = timeMinutes < targetMinutes ? '✅' : '❌';
      
      console.log(`${beforeTarget} ${time} - ${scheduleGroups[time].length} medicine(s)`);
      scheduleGroups[time].forEach(med => {
        console.log(`   • ${med.name} (${med.user}) - Qty: ${med.quantity}`);
      });
    });
    
    console.log('\n📊 SUMMARY:');
    console.log(`💊 Total medicines: ${medicines.length}`);
    console.log(`✅ Before 4:30 PM: ${medicinesBeforeTime.length}`);
    console.log(`❌ After 4:30 PM: ${medicines.length - medicinesBeforeTime.length}`);
    
    // Current time check
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    console.log(`\n🕐 Current time: ${currentTime}`);
    console.log(`🎯 Target time: 16:30 (4:30 PM)`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkMedicineSchedules();