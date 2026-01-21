# 🧠 MediScan Backend - Text Processing Role

## 🎯 **BACKEND KA EXACT ROLE**

### **Frontend Dega:**
```json
{
  "rawText": "Paracetamol EXP 06/2026"
}
```

### **Backend Karega:**
- Text parsing
- Medicine name extraction  
- Expiry date detection
- Validation & AI analysis
- Database storage

---

## 📋 **API ENDPOINTS**

### **(A) POST /api/medicine/parse-text**
**Frontend OCR se text bhejega, backend parse karega**

**Request:**
```json
{
  "rawText": "Paracetamol EXP 06/2026"
}
```

**Response:**
```json
{
  "success": true,
  "medicineName": "Paracetamol",
  "expiryDate": "2026-06-01T00:00:00.000Z",
  "needsUserInput": false,
  "message": "Medicine info extracted successfully"
}
```

**Missing Info Example:**
```json
{
  "success": true,
  "medicineName": null,
  "expiryDate": null,
  "needsUserInput": true,
  "message": "Medicine name and expiry date not found"
}
```

### **(C) POST /api/medicine/save**
**User verify karne ke baad data save**

**Request:**
```json
{
  "medicineName": "Paracetamol",
  "expiryDate": "2026-06-01",
  "quantity": 10
}
```

**Response (Logged In):**
```json
{
  "success": true,
  "message": "Medicine saved to database",
  "medicineId": "64f8a1b2c3d4e5f6g7h8i9j0",
  "validation": {
    "isValid": true,
    "category": "Pain reliever"
  }
}
```

**Response (Not Logged In):**
```json
{
  "success": true,
  "message": "Medicine validated (not saved - user not logged in)",
  "validation": {
    "isValid": true,
    "category": "Pain reliever"
  }
}
```

### **(D) POST /api/medicine/analyze**
**Gemini AI se medicine analysis**

**Request:**
```json
{
  "medicineName": "Paracetamol",
  "expiryDate": "2026-06-01"
}
```

**Response:**
```json
{
  "success": true,
  "medicineName": "Paracetamol",
  "expiryDate": "2026-06-01",
  "explanation": {
    "usage": "Used to treat pain and reduce fever",
    "dosage": "Adults: 500mg-1g every 4-6 hours",
    "warnings": "Do not exceed 4g daily",
    "safetyStatus": "safe"
  },
  "safetyCheck": {
    "status": "safe",
    "message": "Medicine is valid for 500+ days"
  },
  "stored": true
}
```

### **GET /api/medicine/history**
**User ki medicine history (Auth required)**

**Response:**
```json
{
  "success": true,
  "count": 3,
  "history": [
    {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "medicineName": "Paracetamol",
      "expiryDate": "2026-06-01",
      "quantity": 10,
      "createdAt": "2024-01-15"
    }
  ]
}
```

---

## 🔄 **BACKEND FLOW**

```
1. Frontend OCR → rawText → Backend parse-text API
2. Backend extracts → medicineName + expiryDate
3. Frontend shows → User verifies/edits
4. Frontend sends → Backend save API
5. Backend validates → Saves to MongoDB
6. Frontend requests → Backend analyze API  
7. Backend calls Gemini → Returns AI explanation
```

---

## ❌ **BACKEND NAHI KAREGA**

- ❌ Image upload handling
- ❌ Camera access
- ❌ OCR processing (Tesseract.js)
- ❌ UI/Frontend logic

---

## ✅ **BACKEND KAREGA**

- ✅ Text parsing from OCR output
- ✅ Medicine name extraction
- ✅ Expiry date detection
- ✅ Data validation
- ✅ MongoDB storage
- ✅ Gemini AI integration
- ✅ User authentication
- ✅ History management

---

## 🎯 **INTERVIEW ANSWER**

> **"OCR was handled on the frontend using Tesseract.js. My role was backend logic — parsing extracted text, validation, database storage, and Gemini AI integration."**

---

## 🚀 **TECH STACK**

- **Node.js + Express** - API server
- **MongoDB + Mongoose** - Database
- **Gemini AI API** - Medicine analysis
- **JWT** - Authentication
- **Text Processing** - Custom parsing logic

**Perfect! Backend sirf text processing aur business logic handle karega! 🎉**