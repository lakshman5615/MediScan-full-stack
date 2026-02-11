// Script to update lowStockThreshold from 5 to 2 for all medicines
const mongoose = require('mongoose');
const Medicine = require('./src/models/Medicine');
require('dotenv').config();

async function updateLowStockThreshold() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mediscan';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find all medicines with lowStockThreshold != 2
    const result = await Medicine.updateMany(
      { $or: [{ lowStockThreshold: { $ne: 2 } }, { lowStockThreshold: { $exists: false } }] },
      { $set: { lowStockThreshold: 2 } }
    );

    console.log(`✅ Updated ${result.modifiedCount} medicines`);
    console.log(`   Matched: ${result.matchedCount}`);
    
    // Verify
    const allMedicines = await Medicine.find({}, 'name lowStockThreshold remainingQuantity');
    console.log('\n📋 All medicines:');
    allMedicines.forEach(med => {
      console.log(`   ${med.name}: threshold=${med.lowStockThreshold}, remaining=${med.remainingQuantity}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
    
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

updateLowStockThreshold();
