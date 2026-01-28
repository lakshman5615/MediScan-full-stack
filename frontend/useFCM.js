// src/hooks/useFCM.js
import { useState, useEffect } from 'react';
import { 
  registerFcmToken, 
  initializeFCMForUser, 
  isFCMEnabled, 
  sendTestNotification 
} from '../services/registerFcmToken';

/**
 * React Hook for FCM Management
 * @param {string} jwtToken - JWT token from login
 * @returns {object} FCM state and functions
 */
export function useFCM(jwtToken) {
  const [fcmEnabled, setFcmEnabled] = useState(false);
  const [fcmLoading, setFcmLoading] = useState(false);
  const [fcmError, setFcmError] = useState(null);

  // Initialize FCM on mount if token exists
  useEffect(() => {
    if (jwtToken && !isFCMEnabled()) {
      initializeFCM();
    } else if (jwtToken) {
      setFcmEnabled(true);
    }
  }, [jwtToken]);

  /**
   * Initialize FCM for current user
   */
  const initializeFCM = async () => {
    setFcmLoading(true);
    setFcmError(null);
    
    try {
      const success = await initializeFCMForUser(jwtToken);
      setFcmEnabled(success);
      
      if (!success) {
        setFcmError('Failed to enable notifications. Please check browser permissions.');
      }
    } catch (error) {
      setFcmError('FCM initialization failed: ' + error.message);
    } finally {
      setFcmLoading(false);
    }
  };

  /**
   * Manually register FCM token
   */
  const enableNotifications = async () => {
    setFcmLoading(true);
    setFcmError(null);
    
    try {
      const success = await registerFcmToken(jwtToken);
      setFcmEnabled(success);
      
      if (!success) {
        setFcmError('Failed to register FCM token');
      }
    } catch (error) {
      setFcmError('Notification registration failed: ' + error.message);
    } finally {
      setFcmLoading(false);
    }
  };

  /**
   * Send test notification
   */
  const testNotification = async () => {
    try {
      const success = await sendTestNotification(jwtToken);
      return success;
    } catch (error) {
      setFcmError('Test notification failed: ' + error.message);
      return false;
    }
  };

  return {
    fcmEnabled,
    fcmLoading,
    fcmError,
    enableNotifications,
    testNotification,
    initializeFCM
  };
}