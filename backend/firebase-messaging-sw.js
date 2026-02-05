// Firebase Messaging Service Worker
// Handle background notifications and action buttons

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

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background Message:', payload);
  
  const { title, body } = payload.notification;
  const { medicineId, userId, type } = payload.data;
  
  // Only show action buttons for medicine reminders
  const notificationOptions = {
    body: body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    requireInteraction: true,
    data: {
      medicineId,
      userId,
      type
    }
  };
  
  // Add action buttons for medicine reminders
  if (type === 'medicine_reminder') {
    notificationOptions.actions = [
      {
        action: 'taken',
        title: '✅ TAKEN'
      },
      {
        action: 'missed', 
        title: '❌ MISSED'
      }
    ];
  }
  
  self.registration.showNotification(title, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click:', event);
  
  const { action } = event;
  const { medicineId, userId, type } = event.notification.data;
  
  event.notification.close();
  
  if (type === 'medicine_reminder') {
    if (action === 'taken') {
      handleMedicineAction(medicineId, 'taken');
    } else if (action === 'missed') {
      handleMedicineAction(medicineId, 'missed');
    } else {
      // Default click - open app
      clients.openWindow('/');
    }
  } else {
    // Other notifications - open app
    clients.openWindow('/');
  }
});

// Handle medicine action API calls
async function handleMedicineAction(medicineId, action) {
  try {
    // Get JWT token from IndexedDB or localStorage
    const token = await getAuthToken();
    
    if (!token) {
      showErrorNotification('Please login to the app first');
      return;
    }
    
    const response = await fetch(`http://localhost:5000/api/medicine-action/${action}/${medicineId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Show success notification
      self.registration.showNotification(`✅ Medicine ${action.toUpperCase()}`, {
        body: result.message || `Medicine marked as ${action}`,
        icon: '/success-icon.png',
        badge: '/badge-72x72.png',
        tag: 'medicine-action-success'
      });
    } else {
      showErrorNotification(result.message || 'Action failed');
    }
    
  } catch (error) {
    console.error('Action failed:', error);
    showErrorNotification('Network error. Please try again.');
  }
}

// Show error notification
function showErrorNotification(message) {
  self.registration.showNotification('❌ Action Failed', {
    body: message,
    icon: '/error-icon.png',
    badge: '/badge-72x72.png',
    tag: 'medicine-action-error'
  });
}

// Get stored JWT token
async function getAuthToken() {
  try {
    // Try to get from IndexedDB first
    const db = await openDB();
    const token = await getFromDB(db, 'authToken');
    
    if (token) return token;
    
    // Fallback: try localStorage (if available in service worker context)
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

// Simple IndexedDB helpers
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MediScanDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('auth')) {
        db.createObjectStore('auth');
      }
    };
  });
}

function getFromDB(db, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['auth'], 'readonly');
    const store = transaction.objectStore('auth');
    const request = store.get(key);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}