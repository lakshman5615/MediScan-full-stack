// Example: How to use FCM in your React components
// src/components/LoginComponent.js

import React, { useState } from 'react';
import { useFCM } from '../useFCM';
import { registerFcmToken, initializeFCMForUser } from '../src/services/registerFcmToken';

function LoginComponent() {
  const [jwtToken, setJwtToken] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  
  // Use FCM hook
  const { fcmEnabled, fcmLoading, fcmError, enableNotifications, testNotification } = useFCM(jwtToken);

  /**
   * Handle user login
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Your existing login API call
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        const token = data.jwtToken;
        setJwtToken(token);
        
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        // Automatically initialize FCM after login
        console.log('🔔 Auto-initializing FCM after login...');
        await initializeFCMForUser(token);
        
        console.log('✅ Login successful with FCM enabled!');
      }
      
    } catch (error) {
      console.error('❌ Login failed:', error);
    }
  };

  /**
   * Manual FCM enable (if auto-init failed)
   */
  const handleEnableNotifications = async () => {
    await enableNotifications();
  };

  /**
   * Test notification
   */
  const handleTestNotification = async () => {
    const success = await testNotification();
    if (success) {
      alert('🧪 Test notification sent! Check your browser.');
    } else {
      alert('❌ Test notification failed.');
    }
  };

  return (
    <div className="login-container">
      <h2>MediScan Login</h2>
      
      {!jwtToken ? (
        // Login Form
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            required
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        // Post-Login FCM Status
        <div className="fcm-status">
          <h3>✅ Login Successful!</h3>
          
          <div className="notification-status">
            <h4>🔔 Notification Status:</h4>
            
            {fcmLoading && <p>⏳ Setting up notifications...</p>}
            
            {fcmEnabled ? (
              <div>
                <p>✅ Notifications Enabled</p>
                <button onClick={handleTestNotification}>
                  🧪 Send Test Notification
                </button>
              </div>
            ) : (
              <div>
                <p>❌ Notifications Disabled</p>
                <button onClick={handleEnableNotifications} disabled={fcmLoading}>
                  🔔 Enable Notifications
                </button>
              </div>
            )}
            
            {fcmError && (
              <p style={{color: 'red'}}>❌ {fcmError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginComponent;