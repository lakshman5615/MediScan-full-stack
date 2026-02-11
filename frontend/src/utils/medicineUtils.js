const MS_PER_DAY = 1000 * 60 * 60 * 24;

const toStartOfDay = (dateLike) => {
  const d = new Date(dateLike);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  const today = toStartOfDay(new Date());
  const expiry = toStartOfDay(expiryDate);
  return Math.ceil((expiry - today) / MS_PER_DAY);
};

export const isMedicineExpired = (expiryDate) => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  if (daysUntilExpiry === null) return false;
  return daysUntilExpiry < 0;
};

export const isMedicineExpiringSoon = (expiryDate, thresholdDays = 5) => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  if (daysUntilExpiry === null) return false;
  return daysUntilExpiry >= 0 && daysUntilExpiry <= thresholdDays;
};

export const getMedicineStatus = (medicine) => {
  if (isMedicineExpired(medicine.expiryDate)) return "expired";
  if (isMedicineExpiringSoon(medicine.expiryDate, 5)) return "expiring";
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
