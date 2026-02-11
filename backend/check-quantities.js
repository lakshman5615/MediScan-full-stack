// Debug script to check medicine quantities
const mongoose = require('mongoose');
const Medicine = require('./src/models/Medicine');
require('dotenv').config();

async function checkQuantities() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const medicines = await Medicine.find({}).sort({ createdAt: -1 }).limit(5);
    
    console.log('📋 Last 5 medicines:\n');
    medicines.forEach(med => {
      console.log(`Medicine: ${med.name}`);
      console.log(`  Total: ${med.totalQuantity}`);
      console.log(`  Remaining: ${med.remainingQuantity}`);
      console.log(`  Created: ${med.createdAt}`);
      console.log(`  Updated: ${med.updatedAt}`);
      console.log('---');
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

checkQuantities();
