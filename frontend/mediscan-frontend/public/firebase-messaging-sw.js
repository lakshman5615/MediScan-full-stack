// public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAX3A-Vc102Xx-uoAvIyh3sX4gzfGojXD4",
  authDomain: "mediscan-notifications.firebaseapp.com",
  projectId: "mediscan-notifications",
  messagingSenderId: "1094554203665",
  appId: "1:1094554203665:web:7b8d495c93d08416e8a3b0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification?.title || "💊 MediScan Reminder",
    {
      body: payload.notification?.body || "Time to take medicine",
      icon: "/mediscan-icon.png",
      badge: "/mediscan-badge.png",
      requireInteraction: true
    }
  );
});
