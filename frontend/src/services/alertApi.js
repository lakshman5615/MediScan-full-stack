// ============================================
// ALERT API SERVICE - Backend se alerts fetch karne ke liye
// ============================================

import axiosInstance from "./axios";

// ✅ GET /api/alerts - Saare alerts fetch karo (reminders, expiry, low stock)
export const getAlerts = async () => {
  const res = await axiosInstance.get("/api/alerts");
  return res.data; // { success: true, data: { reminders: [], expiry: [], lowStock: [] } }
};

// ✅ POST /api/alerts/action - Alert pe action lo (TAKEN/MISSED/DISMISSED)
export const handleAlertAction = async (alertId, action) => {
  const res = await axiosInstance.post("/api/alerts/action", {
    alertId,
    action // "TAKEN" | "MISSED" | "DISMISSED"
  });
  return res.data; // { success: true, message: "Alert marked as TAKEN", data: {...} }
};
