// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAX3A-Vc102Xx-uoAvIyh3sX4gzfGojXD4",
  authDomain: "mediscan-notifications.firebaseapp.com",
  projectId: "mediscan-notifications",
  storageBucket: "mediscan-notifications.firebasestorage.app",
  messagingSenderId: "1094554203665",
  appId: "1:1094554203665:web:7b8d495c93d08416e8a3b0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('📩 Background notification:', payload);
  
  const title = payload.data?.title || 'Medicine Alert';
  const options = {
    body: payload.data?.body || '',
    icon: '/logo.png',
    data: payload.data,
    requireInteraction: true,
    tag: payload.data?.alertId || 'alert'
  };

  if (payload.data?.showActions === 'true') {
    options.actions = [
      { action: 'taken', title: '✅ Confirm Taken' },
      { action: 'missed', title: '⏭️ Mark Missed' }
    ];
  }

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', async (event) => {
  event.notification.close();
  
  const alertId = event.notification.data?.alertId;
  const action = event.action || 'open';

  if (action === 'taken' || action === 'missed') {
    const token = localStorage.getItem('token');
    if (token && alertId) {
      fetch('http://localhost:5000/api/notifications/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notificationId: alertId, action: action.toUpperCase() })
      }).then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log('✅ Action processed:', action);
          }
        })
        .catch(err => console.error('❌ Action failed:', err));
    }
  } else {
    event.waitUntil(clients.openWindow('http://localhost:5173'));
  }
});

