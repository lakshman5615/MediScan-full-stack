// firebase-messaging-sw.js
// Service Worker for Background FCM Notifications

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAX3A-Vc102Xx-uoAvIyh3sX4gzfGojXD4",
  authDomain: "mediscan-notifications.firebaseapp.com",
  projectId: "mediscan-notifications",
  messagingSenderId: "1094554203665",
  appId: "1:1094554203665:web:7b8d495c93d08416e8a3b0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('📱 Background Message received:', payload);
  
  const notificationTitle = payload.notification?.title || 'MediScan Reminder';
  const notificationOptions = {
    body: payload.notification?.body || 'Time for your medicine!',
    icon: '/mediscan-icon.png',
    badge: '/mediscan-badge.png',
    tag: 'mediscan-medicine-reminder',
    requireInteraction: true,
    actions: [
      {
        action: 'taken',
        title: '✅ Taken'
      },
      {
        action: 'missed',
        title: '⏭️ Missed'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Notification click received:', event);
  
  event.notification.close();
  
  const action = event.action;
  const { medicineId, userId, scheduledAt, token } = event.notification.data || {};

  let status = null;
  if (action === 'taken') {
    status = 'TAKEN';
  } else if (action === 'missed') {
    status = 'MISSED';
  }

  if (status && medicineId && userId && token) {
    // Backend call to mark dose
    event.waitUntil(
      fetch('http://localhost:5000/api/dose/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ medicineId, userId, scheduledAt, status })
      })
      .then(res => res.json())
      .then(data => console.log('✅ Dose updated:', data))
      .catch(err => console.error('❌ Dose update failed:', err))
    );
  } else {
    // Open app
    event.waitUntil(clients.openWindow('/'));
  }
});
