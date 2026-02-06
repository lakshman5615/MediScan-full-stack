export const isMedicineExpired = (expiryDate) => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

export const getMedicineStatus = (medicine) => {
  if (isMedicineExpired(medicine.expiryDate)) return "expired";
  if (medicine.quantity === 0) return "out_of_stock";
  if (medicine.quantity <= 2) return "low_stock";
  return "high_stock";
};

export const getStatusConfig = (status) => {
  switch (status) {
    case "Expired":
    case "EXPIRED":
    case "expired":
      return { text: "EXPIRED", color: "bg-red-100 text-red-800" };
    case "Out of Stock":
    case "OUT_OF_STOCK":
    case "out_of_stock":
      return { text: "OUT OF STOCK", color: "bg-red-100 text-red-800" };
    case "Low Stock":
    case "LOW_STOCK":
    case "low_stock":
      return { text: "LOW STOCK", color: "bg-yellow-100 text-yellow-800" };
    case "Expiring":
    case "EXPIRING":
    case "expiring":
      return { text: "EXPIRING SOON", color: "bg-orange-100 text-orange-800" };
    case "High Stock":
    case "HIGH_STOCK":
    case "high_stock":
    case "Active":
    case "OK":
    case "stocked":
    default:
      return { text: "HIGH STOCK", color: "bg-green-100 text-green-800" };
  }
};
