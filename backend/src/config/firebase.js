// const admin = require('firebase-admin');
// const path = require('path');

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(
//       path.join(__dirname, '../../mediscan-notifications-firebase-admin.json')
//     )
//   });
// }

// module.exports = admin.messaging();

const admin = require('firebase-admin');

const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64?.trim();

if (!base64) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 not found in env");
}

const jsonString = Buffer.from(base64, 'base64').toString('utf8');

const serviceAccount = JSON.parse(jsonString);

if (!admin.apps.length) {
  admin.initializeApp({
<<<<<<< HEAD
    credential: admin.credential.cert(serviceAccount),
=======
    credential: admin.credential.cert(
    path.join(__dirname, '../../mediscan-notifications-firebase-admin.json')
     //JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    )
>>>>>>> testingBranch
  });
}

module.exports = admin.messaging();
