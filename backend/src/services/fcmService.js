// src/services/fcmService.js

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAX3A-Vc102Xx-uoAvIyh3sX4gzfGojXD4",
  authDomain: "mediscan-notifications.firebaseapp.com",
  projectId: "mediscan-notifications",
  storageBucket: "mediscan-notifications.firebasestorage.app",
  messagingSenderId: "1094554203665",
  appId: "1:1094554203665:web:7b8d495c93d08416e8a3b0"
};

const VAPID_KEY =
  "BCDVAB6Kcn6GyveyDK3XmHbwmkEDmqBhQkl8ko0m14Lh7UxgYOd2hwQJB-bao-JqSYR9q6d5h3sboXkywL--QMA";

// Init Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

class FCMService {
<<<<<<< HEAD


  async requestPermissionAndGetToken() {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("❌ Notification permission denied");
      return null;
    }

    // 🔥 IMPORTANT PART
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (!token) {
      console.log("❌ No FCM token received");
      return null;
    }

    console.log("✅ FCM Token:", token);
    return token;
  } catch (error) {
    console.error("❌ FCM error:", error);
    return null;
  }
}


=======
  async requestPermissionAndGetToken() {
    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        console.log("❌ Notification permission denied");
        return null;
      }

      const token = await getToken(messaging, { vapidKey: VAPID_KEY });

      if (!token) {
        console.log("❌ No FCM token received");
        return null;
      }

      console.log("✅ FCM Token:", token);
      return token;
    } catch (error) {
      console.error("❌ FCM error:", error);
      return null;
    }
  }
>>>>>>> d637b79a2160b37a5134a5e60c0f52cd95df72c3

  async registerTokenWithBackend(token) {
    try {
      const jwt = localStorage.getItem("authToken");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/fcm-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
          },
          body: JSON.stringify({ fcmToken: token })
        }
      );

      const data = await res.json();
      return data.success === true;
    } catch (error) {
      console.error("❌ Backend FCM register error:", error);
      return false;
    }
  }

  async setupFCM() {
    const token = await this.requestPermissionAndGetToken();
    if (!token) return false;

    const saved = await this.registerTokenWithBackend(token);
    if (!saved) return false;

    this.listenForegroundMessages();
    return true;
  }

  listenForegroundMessages() {
    onMessage(messaging, (payload) => {
      console.log("📩 Foreground message:", payload);
    });
  }
}

export default new FCMService();
