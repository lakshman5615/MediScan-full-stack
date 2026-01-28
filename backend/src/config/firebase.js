const admin = require('firebase-admin');
const path = require('path');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      path.join(__dirname, '../../mediscan-notifications-firebase-admin.json')
    )
  });
}

module.exports = admin.messaging();
