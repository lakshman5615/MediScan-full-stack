# 🔥 Firebase FCM Setup Instructions

## Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Enter project name: "mediscan-fcm"
4. Enable Google Analytics (optional)
5. Create project

## Step 2: Enable Cloud Messaging
1. In Firebase Console, go to "Project Settings" (gear icon)
2. Click on "Cloud Messaging" tab
3. Note down the "Server key" (for legacy HTTP API)

## Step 3: Generate Service Account Key
1. Go to "Project Settings" → "Service accounts"
2. Click "Generate new private key"
3. Download the JSON file
4. Rename it to `fcmServiceAccountKey.json`
5. Place it in the project root directory: `MediScan-full-stack/fcmServiceAccountKey.json`

## Step 4: Install Firebase Admin SDK
```bash
npm install firebase-admin
```

## Step 5: Test FCM
After setup, test with:
```bash
POST /api/medicine/notify-token
{
  "fcmToken": "your_device_token",
  "title": "Test Notification",
  "message": "Firebase FCM is working!"
}
```

## Security Note
- Never commit `fcmServiceAccountKey.json` to version control
- Add it to `.gitignore`
- Use environment variables in production

## Frontend Integration
Frontend needs to:
1. Initialize Firebase SDK
2. Get FCM registration token
3. Send token to backend via `/auth/fcm-token`
4. Handle incoming notifications