// import { getToken, onMessage } from 'firebase/messaging';
// import { messaging } from '../firebase-config';
// import axiosInstance from './axios';

// const VAPID_KEY = 'BCDVAB6Kcn6GyveyDK3XmHbwmkEDmqBhQkl8ko0m14Lh7UxgYOd2hwQJB-bao-JqSYR9q6d5h3sboXkywL--QMA';

// export const requestFCMToken = async () => {
//   try {
//     console.log('🔔 Step 1: Requesting notification permission...');
    
//     if (!('Notification' in window)) {
//       console.error('❌ Browser does not support notifications');
//       return null;
//     }

//     const permission = await Notification.requestPermission();
//     console.log('📱 Permission result:', permission);
    
//     if (permission !== 'granted') {
//       console.log('❌ Notification permission denied');
//       return null;
//     }

//     console.log('🔔 Step 2: Registering service worker...');
    
//     if (!('serviceWorker' in navigator)) {
//       console.error('❌ Service Worker not supported');
//       return null;
//     }

//     // Unregister old service workers
//     const registrations = await navigator.serviceWorker.getRegistrations();
//     for (let registration of registrations) {
//       await registration.unregister();
//     }
//     console.log('🧹 Old service workers cleared');

//     // Register new service worker
//     const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
//       scope: '/'
//     });
    
//     // Wait for service worker to be ready
//     await navigator.serviceWorker.ready;
//     console.log('✅ Service Worker active and ready');

//     console.log('🔔 Step 3: Getting FCM token...');
//     const token = await getToken(messaging, {
//       vapidKey: VAPID_KEY,
//       serviceWorkerRegistration: registration
//     });
    
//     if (token) {
//       console.log('✅ FCM Token received:', token.substring(0, 20) + '...');
      
//       console.log('🔔 Step 4: Saving token to backend...');
//       await axiosInstance.post('/auth/fcm-token', { fcmToken: token });
//       console.log('✅ FCM Token saved to backend');
      
//       return token;
//     } else {
//       console.log('⚠️ No FCM token received');
//       return null;
//     }
//   } catch (err) {
//     console.error('❌ FCM Token error:', err);
//     console.error('Error details:', err.message);
//     console.error('Error stack:', err.stack);
//     return null;
//   }
// };

// export const setupForegroundListener = () => {
//   onMessage(messaging, (payload) => {
//     console.log('📩 Foreground message received:', payload);
    
//     // ✅ Show notification when app is in foreground
//     const title = payload.data?.title || payload.notification?.title || 'Medicine Alert';
//     const body = payload.data?.body || payload.notification?.body || '';
//     const showActions = payload.data?.showActions === 'true';
    
//     if (title && body) {
//       // Ask service worker to show notification
//       navigator.serviceWorker.ready.then((registration) => {
//         const notificationOptions = {
//           body: body,
//           icon: '/logo.png',
//           data: payload.data,
//           requireInteraction: true,
//           tag: payload.data?.alertId || 'medicine-alert'
//         };
        
//         // Only REMINDER type has action buttons
//         if (showActions) {
//           notificationOptions.actions = [
//             { action: 'taken', title: '✅ Confirm Taken' },
//             { action: 'missed', title: '⏭️ Mark Missed' }
//           ];
//         }
        
//         registration.showNotification(title, notificationOptions);
//       });
//     }
//   });
// };




import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase-config';
import axiosInstance from './axios';

const VAPID_KEY = 'BCDVAB6Kcn6GyveyDK3XmHbwmkEDmqBhQkl8ko0m14Lh7UxgYOd2hwQJB-bao-JqSYR9q6d5h3sboXkywL--QMA';

export const requestFCMToken = async () => {
  try {
    console.log('🔔 Step 1: Requesting notification permission...');
    
    if (!('Notification' in window)) {
      console.error('❌ Browser does not support notifications');
      return null;
    }

    const permission = await Notification.requestPermission();
    console.log('📱 Permission result:', permission);
    
    if (permission !== 'granted') {
      console.log('❌ Notification permission denied');
      return null;
    }

    console.log('🔔 Step 2: Registering service worker...');
    
    if (!('serviceWorker' in navigator)) {
      console.error('❌ Service Worker not supported');
      return null;
    }

    // Unregister old service workers
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (let registration of registrations) {
      await registration.unregister();
    }
    console.log('🧹 Old service workers cleared');

    // Register new service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    
    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;
    console.log('✅ Service Worker active and ready');

    console.log('🔔 Step 3: Getting FCM token...');
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });
    
    if (token) {
      console.log('✅ FCM Token received:', token.substring(0, 20) + '...');
      
      console.log('🔔 Step 4: Saving token to backend...');
      await axiosInstance.post('/auth/fcm-token', { fcmToken: token });
      console.log('✅ FCM Token saved to backend');
      
      return token;
    } else {
      console.log('⚠️ No FCM token received');
      return null;
    }
  } catch (err) {
    console.error('❌ FCM Token error:', err);
    console.error('Error details:', err.message);
    console.error('Error stack:', err.stack);
    return null;
  }
};

export const setupForegroundListener = () => {
  onMessage(messaging, (payload) => {
    console.log('📩 Foreground message received:', payload);
    
    // ✅ Show notification when app is in foreground
    const title = payload.data?.title || payload.notification?.title || 'Medicine Alert';
    const body = payload.data?.body || payload.notification?.body || '';
    const showActions = payload.data?.showActions === 'true';
    
    if (title && body) {
      // Ask service worker to show notification
      navigator.serviceWorker.ready.then((registration) => {
        const notificationOptions = {
          body: body,
          icon: '/logo.png',
          data: payload.data,
          requireInteraction: true,
          tag: payload.data?.alertId || 'medicine-alert'
        };
        
        // Only REMINDER type has action buttons
        if (showActions) {
          notificationOptions.actions = [
            { action: 'taken', title: '✅ Confirm Taken' },
            { action: 'missed', title: '⏭️ Mark Missed' }
          ];
        }
        
        registration.showNotification(title, notificationOptions);
      });
    }
  });
};