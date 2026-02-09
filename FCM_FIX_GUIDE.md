# Fix FCM "Requested entity was not found" Error

## Problem
```
❌ FCM send error: Requested entity was not found
```

**Cause:** Invalid/expired FCM token in database. Frontend never generated a real token because service worker was missing.

## Solution

### Step 1: Service Worker (✅ DONE)
Created `frontend/public/firebase-messaging-sw.js`

### Step 2: Clear Invalid Token from Database
```javascript
// In MongoDB or via backend
db.users.updateOne(
  { email: "radha@gmail.com" },
  { $set: { fcmToken: null } }
)
```

### Step 3: Frontend - Request New Token

Add to login page after successful login:
```javascript
import { requestFCMToken } from './services/fcmService';

// After login success
const token = await requestFCMToken();
console.log('New FCM token:', token);
```

### Step 4: Test Flow

1. **Restart frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Login as user (radha@gmail.com)**

3. **Check browser console for:**
   ```
   ✅ Service Worker active and ready
   ✅ FCM Token received: ...
   ✅ FCM Token saved to backend
   ```

4. **Verify in database:**
   ```javascript
   db.users.findOne({ email: "radha@gmail.com" })
   // fcmToken should be 150+ characters
   ```

5. **Wait for next cron trigger** (medicine scheduled time)

6. **Check backend logs:**
   ```
   ✅ FCM notification sent successfully to radha
   ```

## Expected Logs (After Fix)

```
🔔 Creating reminder alert for gryclomet (Morning)...
✅ Alert created with ID: xxx
👤 User FCM Token: EXISTS (152 chars)
📤 Sending FCM notification for gryclomet...
✅ FCM notification sent successfully to radha
✅ Alert created for gryclomet (Morning)
```

## Why It Failed Before

1. Service worker missing → No valid FCM token generated
2. Old/test token (142 chars) saved in DB
3. Firebase rejected invalid token → "entity not found"
4. Alert still created in DB (working as designed)
5. Duplicate success log appeared (now fixed)

## Files Changed

- ✅ `frontend/public/firebase-messaging-sw.js` - Created
- ✅ `backend/src/services/production-fcm.service.js` - Fixed logs
- ✅ `backend/src/services/alert.service.js` - Fixed logs
- ✅ `backend/src/cron/alerts.cron.js` - Fixed logs
