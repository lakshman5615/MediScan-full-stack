// src/registerFcmToken.js

import { messaging } from './firebase.js';
import { getToken } from "firebase/messaging";
import axios from 'axios';

/**
 * Register real FCM token for the logged-in user
 * @param {string} jwtToken - JWT token after user login
 */
export async function registerFcmToken(jwtToken) {
  try {
    // Request permission and generate FCM token
    const currentToken = await getToken(messaging, {
      vapidKey: 'BCDVAB6Kcn6GyveyDK3XmHbwmkEDmqBhQkl8ko0m14Lh7UxgYOd2hwQJB-bao-JqSYR9q6d5h3sboXkywL--QMA'
    });

    if (currentToken) {
      console.log('✅ Real FCM Token generated:', currentToken);

      // Send token to backend
      const response = await axios.post(
        'http://localhost:5000/auth/fcm-token',
        { fcmToken: currentToken },
        { headers: { Authorization: `Bearer ${jwtToken}` } }
      );

      console.log('💾 Backend Response:', response.data);
    } else {
      console.log('⚠️ No FCM token available. Make sure permission granted.');
    }

  } catch (error) {
    console.error('❌ Error registering FCM token:', error);
  }
}