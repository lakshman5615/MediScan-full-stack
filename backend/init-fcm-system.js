// Initialize FCM Tokens for All Users
// init-fcm-system.js

const mongoose = require('mongoose');
const AutoTokenManager = require('./src/services/auto-token-manager');
const User = require('./src/models/User');
require('dotenv').config();

async function initializeFCMSystem() {
  try {
    console.log('🚀 Initializing FCM System...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get all users
    const allUsers = await User.find({});
    console.log(`👥 Found ${allUsers.length} users in database`);
    
    // Check users without FCM tokens
    const usersWithoutTokens = await User.find({
      $or: [
        { fcmToken: { $exists: false } },
        { fcmToken: null },
        { fcmToken: '' }
      ]
    });
    
    console.log(`🔍 Users without FCM tokens: ${usersWithoutTokens.length}`);
    
    if (usersWithoutTokens.length === 0) {
      console.log('✅ All users already have FCM tokens!');
      process.exit(0);
    }
    
    // Assign tokens to users without them
    let assignedCount = 0;
    
    for (const user of usersWithoutTokens) {
      const token = await AutoTokenManager.autoAssignToken(user._id);
      if (token) {
        assignedCount++;
        console.log(`✅ Token assigned to ${user.name} (${user.email})`);
      }
    }
    
    // Display final status
    console.log('\n🎉 FCM SYSTEM INITIALIZATION COMPLETE!');
    console.log('═══════════════════════════════════════');
    console.log(`👥 Total Users: ${allUsers.length}`);
    console.log(`🔄 Tokens Assigned: ${assignedCount}`);
    console.log(`✅ Users with Tokens: ${allUsers.length - usersWithoutTokens.length + assignedCount}`);
    console.log(`📊 Coverage: ${Math.round(((allUsers.length - usersWithoutTokens.length + assignedCount) / allUsers.length) * 100)}%`);
    
    // Show token pool status
    const poolStatus = AutoTokenManager.getStatus();
    console.log('\n🔧 TOKEN POOL STATUS:');
    console.log(`📦 Total Tokens: ${poolStatus.totalTokens}`);
    console.log(`🔄 Used Tokens: ${poolStatus.usedTokens}`);
    console.log(`✅ Available Tokens: ${poolStatus.availableTokens}`);
    console.log(`🏥 Pool Health: ${poolStatus.poolHealth}`);
    
    console.log('\n🔔 FCM notifications are now ready for all users!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Initialization error:', error);
    process.exit(1);
  }
}

initializeFCMSystem();