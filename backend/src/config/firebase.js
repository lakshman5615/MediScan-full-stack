const admin = require('firebase-admin');
const path = require('path');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
    path.join(__dirname, '../../mediscan-notifications-firebase-admin.json')
     //JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    )
  });
}

module.exports = admin.messaging();
