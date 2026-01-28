// src/services/registerFcmToken.js
import { messaging } from '../firebase';
import { getToken, onMessage } from "firebase/messaging";
import axios from 'axios';

// VAPID Key from Firebase Console
const VAPID_KEY = 'BCDVAB6Kcn6GyveyDK3XmHbwmkEDmqBhQkl8ko0m14Lh7UxgYOd2hwQJB-bao-JqSYR9q6d5h3sboXkywL--QMA';

/**
 * Register real FCM token for the logged-in user
 * @param {string} jwtToken - JWT token after user login
 * @returns {Promise<boolean>} - Success status
 */
export async function registerFcmToken(jwtToken) {
  try {
    console.log('🔔 Requesting notification permission...');
    
    // Request notification permission
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('❌ Notification permission denied');
      return false;
    }
    
    console.log('✅ Notification permission granted');
    
    // Generate real FCM token
    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY
    });

    if (currentToken) {
      console.log('✅ Real FCM Token generated:', currentToken.substring(0, 20) + '...');

      // Send token to backend
      const response = await axios.post(
        'http://localhost:5000/auth/fcm-token',
        { fcmToken: currentToken },
        { 
          headers: { 
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data.success) {
        console.log('💾 FCM Token registered with backend successfully');
        
        // Setup foreground message listener
        setupForegroundListener();
        
        return true;
      } else {
        console.error('❌ Backend registration failed:', response.data.error);
        return false;
      }

    } else {
      console.log('⚠️ No FCM token available. Check Firebase configuration.');
      return false;
    }

  } catch (error) {
    console.error('❌ Error registering FCM token:', error);
    return false;
  }
}

/**
 * Setup foreground message listener
 */
function setupForegroundListener() {
  onMessage(messaging, (payload) => {
    console.log('📱 Foreground message received:', payload);
    
    // Show custom notification
    if (payload.notification) {
      showCustomNotification(
        payload.notification.title,
        payload.notification.body,
        payload.data
      );
    }
  });
}

/**
 * Show custom notification
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Additional data
 */
function showCustomNotification(title, body, data = {}) {
  // Create notification element (customize as needed)
  const notification = document.createElement('div');
  notification.className = 'fcm-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <h4>${title}</h4>
      <p>${body}</p>
      <button onclick="this.parentElement.parentElement.remove()">✕</button>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
  
  // Play notification sound (optional)
  playNotificationSound();
}

/**
 * Play notification sound
 */
function playNotificationSound() {
  try {
    const audio = new Audio('/notification-sound.mp3'); // Add sound file to public folder
    audio.play().catch(e => console.log('Sound play failed:', e));
  } catch (error) {
    console.log('Notification sound not available');
  }
}

/**
 * Auto-register FCM token on app initialization
 * Call this after user login
 * @param {string} jwtToken - JWT token
 */
export async function initializeFCMForUser(jwtToken) {
  try {
    console.log('🚀 Initializing FCM for user...');
    
    const success = await registerFcmToken(jwtToken);
    
    if (success) {
      console.log('🎉 FCM initialization complete - notifications enabled!');
      
      // Store FCM status in localStorage
      localStorage.setItem('fcm_enabled', 'true');
      localStorage.setItem('fcm_initialized_at', new Date().toISOString());
      
      return true;
    } else {
      console.log('⚠️ FCM initialization failed');
      localStorage.setItem('fcm_enabled', 'false');
      return false;
    }
    
  } catch (error) {
    console.error('❌ FCM initialization error:', error);
    return false;
  }
}

/**
 * Check if FCM is already enabled
 * @returns {boolean}
 */
export function isFCMEnabled() {
  return localStorage.getItem('fcm_enabled') === 'true';
}

/**
 * Test notification (for development)
 * @param {string} jwtToken - JWT token
 */
export async function sendTestNotification(jwtToken) {
  try {
    const response = await axios.post(
      'http://localhost:5000/notification/test',
      {
        title: '🧪 Test Notification',
        message: 'MediScan FCM system is working!'
      },
      { 
        headers: { 
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    console.log('🧪 Test notification sent:', response.data);
    return response.data.success;
    
  } catch (error) {
    console.error('❌ Test notification failed:', error);
    return false;
  }
}