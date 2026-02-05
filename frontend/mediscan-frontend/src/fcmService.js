// FCM Service for Token Generation
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase-config';

const VAPID_KEY = "BCDVAB6Kcn6GyveyDK3XmHbwmkEDmqBhQkl8ko0m14Lh7UxgYOd2hwQJB-bao-JqSYR9q6d5h3sboXkywL--QMA";

class FCMService {
  
  async generateAndSaveFCMToken() {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.log('❌ Notification permission denied');
        return null;
      }
      
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY
      });
      
      if (!token) {
        console.log('❌ No FCM token received');
        return null;
      }
      
      console.log('✅ FCM Token generated:', token);
      
      const jwt = localStorage.getItem('authToken');
      if (!jwt) {
        console.log('❌ No auth token found');
        return null;
      }
      
      const response = await fetch('http://localhost:5000/api/auth/fcm-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fcmToken: token })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ FCM token saved to backend');
        this.setupForegroundListener();
        return token;
      } else {
        console.log('❌ Failed to save FCM token:', result.error);
        return null;
      }
      
    } catch (error) {
      console.error('❌ FCM token generation error:', error);
      return null;
    }
  }
  
  setupForegroundListener() {
    onMessage(messaging, (payload) => {
      console.log('📩 Foreground notification received:', payload);
      
      if (payload.notification) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/icon.png'
        });
      }
    });
  }
  
  async initializeFCM() {
    console.log('🔔 Initializing FCM...');
    const token = await this.generateAndSaveFCMToken();
    return token !== null;
  }
}

export default new FCMService();