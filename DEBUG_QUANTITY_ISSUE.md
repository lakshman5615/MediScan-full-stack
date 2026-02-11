# Medicine Quantity Debug Guide

## Issue: Medicine add karte time quantity -1 ho jati hai

### Steps to Debug:

1. **Backend Restart Karo**
   ```bash
   cd backend
   npm start
   ```

2. **Frontend Restart Karo**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Medicine Add Karo**
   - Quantity: 10 enter karo
   - Browser Console (F12) open karo
   - Backend Terminal check karo

4. **Console Logs Check Karo**

   **Frontend Console me dikhega:**
   ```
   🔍 FRONTEND - Adding medicine:
      totalQuantity from form: "10" string
      lowStockThreshold: 2
   📤 Sending to backend: {totalQuantity: 10, ...}
   ```

   **Backend Terminal me dikhega:**
   ```
   🔍 ADD MEDICINE REQUEST:
      totalQuantity from frontend: 10 number
      lowStockThreshold from frontend: 2 number
   💾 Saving medicine with:
      totalQuantity: 10
      remainingQuantity: 10
      lowStockThreshold: 2
   ✅ Medicine saved to DB:
      totalQuantity: 10
      remainingQuantity: 10
      lowStockThreshold: 2
   ```

5. **Agar abhi bhi 9 save ho raha hai:**
   - Check karo koi aur file se medicine add ho rahi hai
   - MongoDB Compass me directly check karo
   - Browser cache clear karo (Ctrl+Shift+Delete)
   - Service worker unregister karo:
     - Chrome DevTools → Application → Service Workers → Unregister

### Possible Causes:

1. ❌ **Old Code Cache**: Browser me purana code cached hai
   - Solution: Hard refresh (Ctrl+Shift+R)

2. ❌ **Multiple API Calls**: Ek se zyada API call ho rahi hai
   - Solution: Network tab me check karo

3. ❌ **Database Issue**: MongoDB me koi trigger/hook hai
   - Solution: MongoDB logs check karo

4. ❌ **Cron Job**: Koi cron job quantity change kar raha hai
   - Solution: Cron jobs temporarily disable karo

### Quick Fix Test:

Backend me direct test karo:
```javascript
// Test route add karo medicine.routes.js me
router.post('/test-add', authMiddleware, async (req, res) => {
  const medicine = new Medicine({
    userId: req.user._id,
    name: 'Test Medicine',
    medicineType: 'OTC',
    totalQuantity: 10,
    remainingQuantity: 10,
    expiryDate: new Date('2026-12-31'),
    lowStockThreshold: 2
  });
  await medicine.save();
  res.json({ success: true, data: medicine });
});
```

Agar yeh 10 save karta hai to frontend issue hai.
Agar yeh bhi 9 save karta hai to database/model issue hai.
