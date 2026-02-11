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
  console.log('   Notification data:', event.notification.data);
  console.log('   Alert ID:', event.notification.data?.alertId);
  
  event.notification.close();
  
  const alertId = event.notification.data?.alertId;
  const action = event.action || 'open';
  const FRONTEND_URL = self.location.origin;

  console.log('🔍 Processing action:', action);
  console.log('🔍 Alert ID:', alertId);
  console.log('🔍 Frontend URL:', FRONTEND_URL);

  // 🔍 STEP 1: User ne action button click kiya (taken/missed)
  if (action === 'taken' || action === 'missed') {
    console.log(`🎯 User clicked: ${action.toUpperCase()}`);
    
    if (!alertId) {
      console.error('❌ No alertId found in notification data!');
      console.log('Available data:', event.notification.data);
      return;
    }
    
    // 🔍 STEP 2: Open alerts page with action data in URL
    const alertsUrl = `${FRONTEND_URL}/dashboard/alerts?action=${action}&alertId=${alertId}`;
    console.log(`📤 Opening alerts page with action: ${alertsUrl}`);
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
        console.log(`🔍 Found ${windowClients.length} open windows`);
        
        // Check if any window is already open
        for (let client of windowClients) {
          console.log(`🔍 Checking window: ${client.url}`);
          if (client.url.includes('/dashboard') && 'focus' in client) {
            console.log('✅ Focusing existing window and navigating...');
            client.focus();
            return client.navigate(alertsUrl);
          }
        }
        
        // If no window open, open new one
        console.log('🆕 Opening new window...');
        if (clients.openWindow) {
          return clients.openWindow(alertsUrl);
        }
      }).catch(err => {
        console.error('❌ Error opening window:', err);
      })
    );
  } else {
    // User ne notification body click kiya (action button nahi)
    console.log('🏠 Opening alerts page (body clicked)...');
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
        for (let client of windowClients) {
          if (client.url.includes('/dashboard/alerts') && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(`${FRONTEND_URL}/dashboard/alerts`);
        }
      })
    );
  }
});

