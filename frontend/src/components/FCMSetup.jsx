// React Component - FCM Integration
// src/components/FCMSetup.jsx

import React, { useEffect, useState } from 'react';
import FCMService from '../services/fcmService';

const FCMSetup = ({ user }) => {
  const [fcmStatus, setFcmStatus] = useState('checking');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      setupNotifications();
    }
  }, [user]);

  const setupNotifications = async () => {
    try {
      setFcmStatus('setting-up');
      
      const success = await FCMService.setupFCM();
      
      if (success) {
        setFcmStatus('enabled');
        console.log('🔔 Notifications enabled for', user.name);
      } else {
        setFcmStatus('failed');
      }
    } catch (error) {
      console.error('FCM setup error:', error);
      setFcmStatus('failed');
    }
  };

  const requestPermission = async () => {
    await setupNotifications();
  };

  return (
    <div className="fcm-setup">
      {fcmStatus === 'checking' && (
        <div className="notification-status">
          <span>🔄 Checking notification permissions...</span>
        </div>
      )}
      
      {fcmStatus === 'setting-up' && (
        <div className="notification-status">
          <span>⚙️ Setting up notifications...</span>
        </div>
      )}
      
      {fcmStatus === 'failed' && (
        <div className="notification-prompt">
          <h3>🔔 Enable Medicine Reminders</h3>
          <p>Get notified when it's time to take your medicines</p>
          <button onClick={requestPermission} className="enable-btn">
            Enable Notifications
          </button>
        </div>
      )}
      
      {fcmStatus === 'enabled' && (
        <div className="notification-success">
          <span>✅ Medicine reminders enabled!</span>
          <small>You'll get notifications when medicines are due</small>
        </div>
      )}
    </div>
  );
};

export default FCMSetup;