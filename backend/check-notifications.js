// Check Notification Delivery Status
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Medicine = require('./src/models/Medicine');
const Notification = require('./src/models/Notification');
require('dotenv').config();

async function checkNotificationStatus() {
  try {
    console.log('🔔 Checking notification delivery status...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Get all users with their FCM tokens
    const users = await User.find({}).select('name email phone fcmToken createdAt');
    
    if (users.length === 0) {
      console.log('👥 No users found in database');
      process.exit(0);
    }
    
    console.log(`👥 Total users: ${users.length}\n`);
    
    // Check FCM token status
    console.log('📱 FCM TOKEN STATUS:');
    console.log('═══════════════════════════════════════════════════════════');
    
    let usersWithTokens = 0;
    let usersWithoutTokens = 0;
    
    users.forEach((user, index) => {
      const hasToken = user.fcmToken && user.fcmToken.length > 50;
      const tokenStatus = hasToken ? '✅ HAS TOKEN' : '❌ NO TOKEN';
      const tokenPreview = hasToken ? user.fcmToken.substring(0, 20) + '...' : 'None';
      
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   📧 ${user.email}`);
      console.log(`   📱 ${user.phone || 'No phone'}`);
      console.log(`   🔑 ${tokenStatus}`);
      console.log(`   🎫 ${tokenPreview}`);
      console.log('   ─────────────────────────────────────────────────────────');
      
      if (hasToken) usersWithTokens++;
      else usersWithoutTokens++;
    });
    
    // Get notification history
    console.log('\n📋 NOTIFICATION HISTORY (Last 24 hours):');
    console.log('═══════════════════════════════════════════════════════════');
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentNotifications = await Notification.find({
      createdAt: { $gte: yesterday }
    }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    
    if (recentNotifications.length === 0) {
      console.log('📭 No notifications sent in last 24 hours');
    } else {
      recentNotifications.forEach((notif, index) => {
        const user = notif.userId;
        const deliveryStatus = notif.deliveryStatus || 'unknown';
        const statusIcon = deliveryStatus === 'delivered' ? '✅' : 
                          deliveryStatus === 'failed' ? '❌' : '⏳';
        
        console.log(`${index + 1}. ${statusIcon} ${notif.title}`);
        console.log(`   👤 User: ${user?.name || 'Unknown'}`);
        console.log(`   📧 Email: ${user?.email || 'Unknown'}`);
        console.log(`   💬 Message: ${notif.message}`);
        console.log(`   📊 Status: ${deliveryStatus.toUpperCase()}`);
        console.log(`   🕐 Time: ${notif.createdAt.toLocaleString()}`);
        console.log(`   📖 Read: ${notif.isRead ? 'Yes' : 'No'}`);
        console.log('   ─────────────────────────────────────────────────────────');
      });
    }
    
    // Get all notifications summary
    const totalNotifications = await Notification.countDocuments();
    const deliveredNotifications = await Notification.countDocuments({ deliveryStatus: 'delivered' });
    const failedNotifications = await Notification.countDocuments({ deliveryStatus: 'failed' });
    const readNotifications = await Notification.countDocuments({ isRead: true });
    
    // Check current medicines ready for notifications
    console.log('\n💊 CURRENT MEDICINE STATUS:');
    console.log('═══════════════════════════════════════════════════════════');
    
    const activeMedicines = await Medicine.find({ quantity: { $gt: 0 } })
      .populate('userId', 'name email phone fcmToken');
    
    const medicinesByTime = {};
    activeMedicines.forEach(med => {
      const time = med.schedule.time;
      if (!medicinesByTime[time]) {
        medicinesByTime[time] = [];
      }
      medicinesByTime[time].push({
        name: med.medicineName,
        user: med.userId?.name || 'Unknown',
        hasToken: med.userId?.fcmToken && med.userId.fcmToken.length > 50,
        quantity: med.quantity
      });
    });
    
    // Sort times
    const sortedTimes = Object.keys(medicinesByTime).sort((a, b) => {
      const [aHours, aMinutes] = a.split(':').map(Number);
      const [bHours, bMinutes] = b.split(':').map(Number);
      return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
    });
    
    const currentTime = new Date().toTimeString().slice(0, 5);
    
    sortedTimes.forEach(time => {
      const medicines = medicinesByTime[time];
      const readyCount = medicines.filter(m => m.hasToken).length;
      const totalCount = medicines.length;
      const status = readyCount === totalCount ? '✅ READY' : 
                    readyCount > 0 ? '⚠️ PARTIAL' : '❌ NOT READY';
      
      console.log(`${time} - ${status} (${readyCount}/${totalCount} users ready)`);
      medicines.forEach(med => {
        const tokenStatus = med.hasToken ? '✅' : '❌';
        console.log(`   ${tokenStatus} ${med.name} (${med.user}) - Qty: ${med.quantity}`);
      });
    });
    
    // Summary statistics
    console.log('\n📊 NOTIFICATION SYSTEM SUMMARY:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`👥 Total Users: ${users.length}`);
    console.log(`✅ Users with FCM Tokens: ${usersWithTokens}`);
    console.log(`❌ Users without FCM Tokens: ${usersWithoutTokens}`);
    console.log(`📊 Token Coverage: ${Math.round((usersWithTokens / users.length) * 100)}%`);
    console.log(`\n🔔 Total Notifications: ${totalNotifications}`);
    console.log(`✅ Delivered: ${deliveredNotifications}`);
    console.log(`❌ Failed: ${failedNotifications}`);
    console.log(`📖 Read: ${readNotifications}`);
    console.log(`📊 Delivery Rate: ${totalNotifications > 0 ? Math.round((deliveredNotifications / totalNotifications) * 100) : 0}%`);
    console.log(`📊 Read Rate: ${totalNotifications > 0 ? Math.round((readNotifications / totalNotifications) * 100) : 0}%`);
    
    console.log(`\n🕐 Current Time: ${currentTime}`);
    console.log(`💊 Active Medicines: ${activeMedicines.length}`);
    console.log(`⏰ Unique Schedule Times: ${sortedTimes.length}`);
    
    // Next notification check
    const nextTimes = sortedTimes.filter(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
      const timeMinutes = hours * 60 + minutes;
      const currentTimeMinutes = currentHours * 60 + currentMinutes;
      return timeMinutes > currentTimeMinutes;
    });
    
    if (nextTimes.length > 0) {
      console.log(`🎯 Next Notification: ${nextTimes[0]}`);
    } else {
      console.log(`🎯 Next Notification: Tomorrow at ${sortedTimes[0] || 'No schedules'}`);
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkNotificationStatus();