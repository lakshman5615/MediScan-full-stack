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
  const body = payload.data?.body || '';
  const showActions = payload.data?.showActions === 'true';
  
  const options = {
    body: body,
    icon: '/logo.png',
    badge: '/badge.png',
    data: payload.data,
    requireInteraction: true,
    tag: payload.data?.alertId || 'alert',
    vibrate: [200, 100, 200]
  };

  // ✅ Add action buttons for REMINDER type
  if (showActions) {
    options.actions = [
      { action: 'taken', title: '✅ Confirm Taken' },
      { action: 'missed', title: '⏭️ Mark Missed' }
    ];
  }

  return self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', async (event) => {
  console.log('\n👆 NOTIFICATION CLICKED:');
  console.log('   Action:', event.action);
  console.log('   Alert ID:', event.notification.data?.alertId);
  
  event.notification.close();
  
  const alertId = event.notification.data?.alertId;
  const action = event.action || 'open';

  // 🔍 STEP 1: User ne action button click kiya (taken/missed)
  if (action === 'taken' || action === 'missed') {
    console.log(`🎯 User clicked: ${action.toUpperCase()}`);
    
    const token = localStorage.getItem('token');
    if (token && alertId) {
      // Auto-detect backend URL
      const API_URL = self.location.origin.includes('localhost') 
        ? 'http://localhost:5000'
        : self.location.origin.replace('5173', '5000');
      
      console.log(`📤 Sending request to: ${API_URL}/api/alerts/action`);
      console.log(`   Alert ID: ${alertId}`);
      console.log(`   Action: ${action.toUpperCase()}`);
      
      // 🔍 STEP 2: Backend ko action bhejo - /api/alerts/action endpoint
      fetch(`${API_URL}/api/alerts/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ alertId: alertId, action: action.toUpperCase() })
      }).then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log('✅ Action processed from notification:', action);
            console.log('   Response:', data);
            // 🔍 STEP 3: Backend ne alert.showInUI = false kar diya
            // 🔍 STEP 4: Backend ne quantity -1 kar diya (agar TAKEN tha)
            // 🔍 STEP 5: Alert UI automatically refresh hoga aur alert hat jayega
            console.log('✅ Alert will disappear from UI on next refresh\n');
          } else {
            console.error('❌ Action failed:', data.error);
          }
        })
        .catch(err => {
          console.error('❌ Fetch error:', err);
        });
    } else {
      console.log('⚠️ Missing token or alertId');
    }
  } else {
    // User ne notification body click kiya (action button nahi)
    console.log('🏠 Opening app...');
    const FRONTEND_URL = self.location.origin;
    event.waitUntil(clients.openWindow(FRONTEND_URL));
  }
});

