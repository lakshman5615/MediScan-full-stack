# MediScan Backend API Documentation

## 🏗️ Architecture Overview

```
Frontend → API Gateway → Controllers → Services → Database
                    ↓
                AI Service (Gemini) + OCR Service (Tesseract)
```

## 📋 API Endpoints

### 1. **Image Scan & OCR Processing**
```
POST /api/medicine/scan
Content-Type: multipart/form-data
```

**Request:**
```javascript
FormData: {
  image: File (jpg, png, gif - max 5MB)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "medicineName": "Paracetamol 500mg",
    "expiryDate": "2025-12-31T00:00:00.000Z",
    "isValidMedicine": true,
    "category": "Pain reliever",
    "confidence": 0.8,
    "safetyStatus": {
      "status": "safe",
      "message": "This medicine is valid for 365 more days",
      "recommendation": "Safe to use as prescribed"
    },
    "rawOcrText": "PARACETAMOL 500MG\nEXP: 12/2025\n..."
  }
}
```

### 2. **Manual Medicine Input**
```
POST /api/medicine/manual
Content-Type: application/json
```

**Request:**
```json
{
  "medicineName": "Aspirin",
  "expiryDate": "2024-06-15"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "medicineName": "Aspirin",
    "expiryDate": "2024-06-15T00:00:00.000Z",
    "isValidMedicine": true,
    "category": "Anti-inflammatory",
    "safetyStatus": {
      "status": "safe",
      "message": "This medicine is valid for 180 more days",
      "recommendation": "Safe to use as prescribed"
    }
  }
}
```

### 3. **Medicine Verification**
```
POST /api/medicine/verify
Content-Type: application/json
```

**Request:**
```json
{
  "medicineName": "Ibuprofen",
  "expiryDate": "2023-01-01"
}
```

**Response:**
```json
{
  "success": true,
  "validation": {
    "isValid": true,
    "correctedName": "Ibuprofen",
    "category": "NSAID"
  },
  "safety": {
    "status": "expired",
    "message": "This medicine expired 365 days ago",
    "recommendation": "DO NOT USE - Dispose of safely"
  }
}
```

### 4. **AI Medicine Explanation**
```
GET /api/medicine/explain/:medicineName?expiryDate=2024-12-31
```

**Response:**
```json
{
  "success": true,
  "medicineName": "Paracetamol",
  "expiryDate": "2024-12-31",
  "explanation": {
    "usage": "Used to treat pain and reduce fever",
    "dosage": "Adults: 500mg-1g every 4-6 hours, max 4g daily",
    "warnings": "Do not exceed recommended dose. Avoid alcohol.",
    "safetyStatus": "safe"
  },
  "safetyCheck": {
    "status": "safe",
    "message": "This medicine is valid for 300 more days",
    "recommendation": "Safe to use as prescribed"
  }
}
```

### 5. **Save Medicine (Protected Route)**
```
POST /api/medicine/save
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request:**
```json
{
  "medicineName": "Vitamin D3",
  "expiryDate": "2025-03-15",
  "quantity": 30,
  "schedule": ["morning", "evening"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Medicine saved successfully",
  "medicine": {
    "id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "medicineName": "Vitamin D3",
    "expiryDate": "2025-03-15T00:00:00.000Z",
    "quantity": 30,
    "schedule": ["morning", "evening"]
  }
}
```

### 6. **Get User Medicines (Protected Route)**
```
GET /api/medicine/list
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "medicines": [
    {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "medicineName": "Vitamin D3",
      "expiryDate": "2025-03-15T00:00:00.000Z",
      "quantity": 30,
      "schedule": ["morning", "evening"],
      "currentSafetyStatus": {
        "status": "safe",
        "message": "This medicine is valid for 120 more days"
      }
    }
  ]
}
```

## 🔄 Backend Flow Diagram

```
1. IMAGE SCAN FLOW:
   Upload Image → Multer → OCR (Tesseract) → Extract Info → AI Validation → Safety Check → Response

2. MANUAL INPUT FLOW:
   User Input → Validation → AI Verification → Safety Check → Response

3. SAVE MEDICINE FLOW:
   Auth Check → AI Explanation → MongoDB Save → Response

4. VERIFICATION FLOW:
   Medicine Name → AI Validation → Safety Analysis → Response
```

## 🛡️ Security Features

- **File Upload Security**: Size limits, type validation
- **JWT Authentication**: Protected routes for user data
- **Input Validation**: Sanitization and validation
- **Error Handling**: Comprehensive error responses

## 🚀 Quick Start

1. **Install Dependencies:**
```bash
cd backend
npm install
```

2. **Environment Setup:**
```bash
# Update .env file with your keys
GEMINI_API_KEY=your_actual_gemini_key
JWT_SECRET=your_secure_jwt_secret
```

3. **Start Server:**
```bash
npm run dev
```

## 📊 API Response Codes

- `200` - Success
- `201` - Created (medicine saved)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth required)
- `404` - Not Found
- `500` - Server Error

## 🔧 Testing Endpoints

Use tools like Postman or curl to test:

```bash
# Test image scan
curl -X POST -F "image=@medicine.jpg" http://localhost:5000/api/medicine/scan

# Test manual input
curl -X POST -H "Content-Type: application/json" \
  -d '{"medicineName":"Aspirin","expiryDate":"2024-12-31"}' \
  http://localhost:5000/api/medicine/manual
```