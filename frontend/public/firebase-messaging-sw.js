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

// Helper function to get auth token
async function getAuthToken() {
  try {
    // Try to get from all open clients
    const allClients = await clients.matchAll({ includeUncontrolled: true });
    
    for (const client of allClients) {
      // Send message to client to get token
      const response = await new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => {
          resolve(event.data);
        };
        client.postMessage({ type: 'GET_AUTH_TOKEN' }, [channel.port2]);
        
        // Timeout after 1 second
        setTimeout(() => resolve(null), 1000);
      });
      
      if (response?.token) {
        return response.token;
      }
    }
    
    return null;
  } catch (err) {
    console.error('Error getting auth token:', err);
    return null;
  }
}

messaging.onBackgroundMessage((payload) => {
  console.log('📩 Background notification:', payload);
  
  const title = payload.data?.title || 'Medicine Alert';
  const body = payload.data?.body || '';
  const showActions = payload.data?.showActions === 'true';
  
  const options = {
    body: body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data,
    requireInteraction: true,
    tag: payload.data?.alertId || 'alert',
    vibrate: [200, 100, 200, 100, 200],
    silent: false,
    renotify: true
  };

  // ✅ Add action buttons for REMINDER type
  if (showActions) {
    options.actions = [
      { action: 'taken', title: '✅ Confirm Taken', icon: '/icon-192.png' },
      { action: 'missed', title: '⏭️ Mark Missed', icon: '/icon-192.png' }
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
  // const FRONTEND_URL = self.location.origin;
const FRONTEND_URL = self.location.origin;
const BACKEND_URL = "https://mediscan-full-stack-backend.onrender.com";


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
    
    // 🔍 STEP 2: Process action in background via API
    console.log(`📤 Processing ${action} action in background...`);
    
    event.waitUntil(
      (async () => {
        try {
          // Get auth token from IndexedDB or localStorage
          const token = await getAuthToken();
          
          if (!token) {
            console.error('❌ No auth token found');
            return;
          }
          
          // Call backend API to process action
          // const response = await fetch(`${FRONTEND_URL}/api/alerts/${alertId}/action`, {
          const response = await fetch(`${BACKEND_URL}/api/alerts/${alertId}/action`, {

          method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ action: action.toUpperCase() })
          });
          
          if (response.ok) {
            console.log(`✅ Action ${action} processed successfully`);
            // Show success notification with vibration
            self.registration.showNotification('✅ Success', {
              body: `Medicine marked as ${action}`,
              icon: '/icon-192.png',
              badge: '/icon-192.png',
              tag: 'action-success',
              requireInteraction: false,
              vibrate: [100, 50, 100]
            });
          } else {
            console.error('❌ Failed to process action:', response.status);
          }
        } catch (err) {
          console.error('❌ Error processing action:', err);
        }
      })()
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

