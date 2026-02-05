// Generate FCM token for testing
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      path.join(__dirname, 'mediscan-notifications-firebase-admin.json')
    )
  });
}

// Generate a test FCM token
async function generateTestToken() {
  try {
    // This is a mock token for testing - in real app, frontend generates this
    const testToken = "dBfyAl6FNBA9PWXSo1mJo-:APA91bF2Q4f1Nqt7uTvITGuv6cHVa43owi-JUhdncFdxMksXnKnP9JeHs5vnB7THrt0ZL7DI-WcGgNB3wAla9--UALy1qT7tE-4rm2GxC5N-vG_R6Fexlsk_NEW_" + Date.now();
    
    console.log('🔑 Generated test FCM token:', testToken);
    return testToken;
    
  } catch (error) {
    console.error('❌ Token generation error:', error);
    return null;
  }
}

module.exports = { generateTestToken };