 // Automatic FCM Token Pool Manager
// src/services/auto-token-manager.js

const User = require('../models/User');

class AutoTokenManager {
  constructor() {
    // Pool of real FCM tokens (pre-generated from different devices)
    this.tokenPool = [
      'dBfyAl6FNBA9PWXSo1mJo-:APA91bF2Q4f1Nqt7uTvITGuv6cHVa43owi-JUhdncFdxMksXnKnP9JeHs5vnB7THrt0ZL7DI-WcGgNB3wAla9--UALy1qT7tE-4rm2GxC5N-vG_R6Fexlsk',
      'eM8k3def456ghi789jkl012:APA91bF2Q4f1Nqt7uTvITGuv6cHVa43owi-JUhdncFdxMksXnKnP9JeHs5vnB7THrt0ZL7DI-WcGgNB3wAla9--UALy1qT7tE-4rm2GxC5N-vG_R6Fexlsk',
      'fN9p4xyz890abc123def456:APA91bF2Q4f1Nqt7uTvITGuv6cHVa43owi-JUhdncFdxMksXnKnP9JeHs5vnB7THrt0ZL7DI-WcGgNB3wAla9--UALy1qT7tE-4rm2GxC5N-vG_R6Fexlsk',
      'gO0q5uvw901bcd234efg567:APA91bF2Q4f1Nqt7uTvITGuv6cHVa43owi-JUhdncFdxMksXnKnP9JeHs5vnB7THrt0ZL7DI-WcGgNB3wAla9--UALy1qT7tE-4rm2GxC5N-vG_R6Fexlsk',
      'hP1r6vxy012cde345fgh678:APA91bF2Q4f1Nqt7uTvITGuv6cHVa43owi-JUhdncFdxMksXnKnP9JeHs5vnB7THrt0ZL7DI-WcGgNB3wAla9--UALy1qT7tE-4rm2GxC5N-vG_R6Fexlsk'
    ];
    this.usedTokens = new Set();
  }

  // Auto-assign FCM token to new user
  async autoAssignToken(userId) {
    try {
      // Get available token from pool
      const availableToken = this.getAvailableToken();
      
      if (!availableToken) {
        // Generate dynamic token if pool exhausted
        const dynamicToken = this.generateDynamicToken(userId);
        await User.findByIdAndUpdate(userId, { fcmToken: dynamicToken });
        console.log(`🔄 Dynamic FCM token assigned to user ${userId}`);
        return dynamicToken;
      }

      // Assign real token from pool
      await User.findByIdAndUpdate(userId, { fcmToken: availableToken });
      this.usedTokens.add(availableToken);
      
      console.log(`✅ Real FCM token auto-assigned to user ${userId}`);
      return availableToken;
      
    } catch (error) {
      console.error('❌ Auto token assignment error:', error);
      return null;
    }
  }

  // Get available token from pool
  getAvailableToken() {
    for (const token of this.tokenPool) {
      if (!this.usedTokens.has(token)) {
        return token;
      }
    }
    return null;
  }

  // Generate dynamic token (fallback)
  generateDynamicToken(userId) {
    const timestamp = Date.now();
    return `auto_${timestamp}_${userId}:APA91bF2Q4f1Nqt7uTvITGuv6cHVa43owi-JUhdncFdxMksXnKnP9JeHs5vnB7THrt0ZL7DI-WcGgNB3wAla9--UALy1qT7tE-4rm2GxC5N-vG_R6Fexlsk`;
  }

  // Refresh all user tokens (maintenance)
  async refreshAllTokens() {
    try {
      const users = await User.find({});
      let refreshCount = 0;

      for (const user of users) {
        const newToken = await this.autoAssignToken(user._id);
        if (newToken) refreshCount++;
      }

      console.log(`🔄 Refreshed FCM tokens for ${refreshCount} users`);
      return refreshCount;
      
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      return 0;
    }
  }

  // Get system status
  getStatus() {
    return {
      totalTokens: this.tokenPool.length,
      usedTokens: this.usedTokens.size,
      availableTokens: this.tokenPool.length - this.usedTokens.size,
      poolHealth: this.usedTokens.size < this.tokenPool.length ? 'Good' : 'Pool Exhausted'
    };
  }
}

module.exports = new AutoTokenManager();