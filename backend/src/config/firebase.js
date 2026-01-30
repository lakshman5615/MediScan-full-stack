const admin = require('firebase-admin');
const path = require('path');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      path.join(__dirname, '../../mediscan-notifications-firebase-adminsdk-fbsvc-9a0df5f507.json')
    )
  });
}

module.exports = admin.messaging();
