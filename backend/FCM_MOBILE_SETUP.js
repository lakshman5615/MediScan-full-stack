// React Native Firebase FCM Setup (100% Free)

// 1. Install React Native Firebase
// npm install @react-native-firebase/app @react-native-firebase/messaging

// 2. FCM Token Generator Component
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

const FCMTokenGenerator = () => {
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    getFCMToken();
    setupNotificationListeners();
  }, []);

  // Get FCM Token (Free)
  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      setFcmToken(token);
      console.log('FCM Token:', token);
      
      // Send token to backend
      await sendTokenToBackend(token);
    } catch (error) {
      console.error('FCM Token Error:', error);
    }
  };

  // Send token to MediScan backend
  const sendTokenToBackend = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/auth/fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_JWT_TOKEN'
        },
        body: JSON.stringify({ fcmToken: token })
      });
      
      const result = await response.json();
      console.log('Token sent to backend:', result);
    } catch (error) {
      console.error('Backend error:', error);
    }
  };

  // Setup notification listeners
  const setupNotificationListeners = () => {
    // Foreground notifications
    messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body
      );
    });

    // Background notifications
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message:', remoteMessage);
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        MediScan FCM Setup
      </Text>
      
      <Text>FCM Token:</Text>
      <Text style={{ fontSize: 10, marginBottom: 20 }}>
        {fcmToken.substring(0, 50)}...
      </Text>
      
      <Button 
        title="Refresh Token" 
        onPress={getFCMToken} 
      />
    </View>
  );
};

export default FCMTokenGenerator;