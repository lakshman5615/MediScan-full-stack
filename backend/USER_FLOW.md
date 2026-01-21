# MediScan User Flow

## 🔄 Exact Flow Jo Aapko Chahiye

### **STEP 1: Input** 
```
Option A: Image Scan
POST /api/medicine/scan
- Upload image → OCR extract → Return medicine name & expiry

Option B: Manual Input  
POST /api/medicine/manual
- User types medicine name & expiry date
```

### **STEP 2: User Verification & Edit**
```
Frontend shows:
Medicine Name: [Paracetamol] [Edit button]
Expiry Date: [2024-12-31] [Edit button]

User can edit if needed, then click "Confirm"

POST /api/medicine/verify
{
  "medicineName": "Paracetamol", 
  "expiryDate": "2024-12-31"
}
```

### **STEP 3: AI Explanation**
```
POST /api/medicine/explain
{
  "medicineName": "Paracetamol",
  "expiryDate": "2024-12-31"  
}

Response: AI explanation + safety status
```

### **STEP 4: Save (Optional)**
```
POST /api/medicine/save
- If user logged in → Save to DB history
- If not logged in → Just show "Process complete"
```

## 📱 Frontend Flow Example

```javascript
// Step 1: Scan or Manual
const scanResult = await fetch('/api/medicine/scan', formData);

// Step 2: Show verification screen
// User edits if needed, then confirms
const verifyResult = await fetch('/api/medicine/verify', {
  method: 'POST',
  body: JSON.stringify({ medicineName, expiryDate })
});

// Step 3: Get AI explanation  
const explanation = await fetch('/api/medicine/explain', {
  method: 'POST', 
  body: JSON.stringify({ medicineName, expiryDate })
});

// Step 4: Save (if logged in)
const saveResult = await fetch('/api/medicine/save', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` }, // Optional
  body: JSON.stringify({ medicineName, expiryDate, explanation })
});
```

## 🎯 API Endpoints

1. `POST /api/medicine/scan` - Image upload
2. `POST /api/medicine/manual` - Manual input  
3. `POST /api/medicine/verify` - User confirmation
4. `POST /api/medicine/explain` - AI explanation
5. `POST /api/medicine/save` - Save to history (optional auth)
6. `GET /api/medicine/history` - View history (auth required)

**Perfect! Ab aapka exact flow ready hai! 🚀**