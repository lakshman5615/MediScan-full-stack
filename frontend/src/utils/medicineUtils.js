export const isMedicineExpired = (expiryDate) => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

export const getMedicineStatus = (medicine) => {
  if (isMedicineExpired(medicine.expiryDate)) return "Expired";
  if (medicine.quantity === 0) return "Out of Stock";
  if (medicine.quantity <= 5) return "Low Stock";
  return "Active";
};
// src/utils/medicineUtils.js
export const getStatusConfig = (status) => {
  switch (status) {
    case "LOW_STOCK":
      return { label: "Low Stock", color: "orange" };
    case "EXPIRED":
      return { label: "Expired", color: "red" };
    case "EXPIRING":
      return { label: "Expiring Soon", color: "yellow" };
    case "OK":
    default:
      return { label: "Available", color: "green" };
  }
};
