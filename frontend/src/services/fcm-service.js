// React Frontend - FCM Integration for Real Deployment
// src/services/fcmService.js

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your Firebase Config (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyAX3A-Vc102Xx-uoAvIyh3sX4gzfGojXD4",
  authDomain: "mediscan-notifications.firebaseapp.com",
  projectId: "mediscan-notifications",
  storageBucket: "mediscan-notifications.firebasestorage.app",
  messagingSenderId: "1094554203665",
  appId: "1:1094554203665:web:7b8d495c93d08416e8a3b0"
};

// VAPID Key from Firebase Console
const VAPID_KEY = "BCDVAB6Kcn6GyveyDK3XmHbwmkEDmqBhQkl8ko0m14Lh7UxgYOd2hwQJB-bao-JqSYR9q6d5h3sboXkywL--QMA";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

class FCMService {

  // Request notification permission and get FCM token
  async requestPermissionAndGetToken() {
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
        
        // Get FCM registration token
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY
        });
        
        if (token) {
          console.log('✅ FCM Token generated:', token);
          return token;
        } else {
          console.log('❌ No registration token available');
          return null;
        }
      } else {
        console.log('❌ Notification permission denied');
        return null;
      }
    } catch (error) {
      console.error('❌ FCM Error:', error);
      return null;
    }
  }
  
  // Send FCM token to backend
  async registerTokenWithBackend(token) {
    try {
      const jwtToken = localStorage.getItem('authToken'); // Your JWT token
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/fcm-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ fcmToken: token })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ FCM token registered with backend');
        return true;
      } else {
        console.error('❌ Backend registration failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Backend registration error:', error);
      return false;
    }
  }
  
  // Complete FCM setup (call this after user login)
  async setupFCM() {
    try {
      // Get FCM token
      const token = await this.requestPermissionAndGetToken();
      
      if (token) {
        // Register with backend
        const registered = await this.registerTokenWithBackend(token);
        
        if (registered) {
          // Setup foreground message listener
          this.setupForegroundListener();
          
          console.log('🎉 FCM setup complete - notifications enabled!');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('❌ FCM setup failed:', error);
      return false;
    }
  }
  
  // Listen for foreground messages
  setupForegroundListener() {
    onMessage(messaging, (payload) => {
      console.log('📱 Foreground message received:', payload);
      
      // Show custom notification or update UI
      if (payload.notification) {
        this.showCustomNotification(
          payload.notification.title,
          payload.notification.body
        );
      }
    });
  }
  
  // Show custom notification
  showCustomNotification(title, body) {
    // You can customize this based on your UI
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body: body,
          icon: '/mediscan-icon.png',
          badge: '/mediscan-badge.png',
          tag: 'mediscan-notification',
          requireInteraction: true
        });
      });
    }
  }
}

export default new FCMService();