const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
try {
  const serviceAccount = require('../../fcmServiceAccountKey.json');
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  
  console.log('🔥 Firebase Admin initialized successfully');
} catch (error) {
  console.log('⚠️ Firebase Admin initialization failed:', error.message);
  console.log('📄 Please add fcmServiceAccountKey.json file to project root');
}

const messaging = admin.messaging();

module.exports = messaging;