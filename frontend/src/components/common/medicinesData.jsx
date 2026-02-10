// Common medicine data that can be used across components
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toStartOfDay = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return new Date("Invalid");
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const calculateExpiryText = (expiryDate) => {
  const today = toStartOfDay(new Date());
  const expiry = toStartOfDay(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / MS_PER_DAY);
  
  if (diffDays < 0) return 'EXPIRED';
  if (diffDays < 30) return `${diffDays} DAYS LEFT`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} MONTHS LEFT`;
  return `${Math.floor(diffDays / 365)} YEARS LEFT`;
};

export const isMedicineExpired = (expiryDate) => {
  const today = toStartOfDay(new Date());
  const expiry = toStartOfDay(expiryDate);
  return expiry < today;
};

export const getMedicineStatus = (medicine) => {
  const today = toStartOfDay(new Date());
  const expiryDate = toStartOfDay(medicine.expiryDate);
  const daysUntilExpiry = Math.ceil((expiryDate - today) / MS_PER_DAY);
  
  if (daysUntilExpiry <= 0) {
    return 'expired';
  }
  if (daysUntilExpiry <= 5) {
    return 'expiring';
  }
  if (medicine.quantity <= 2) {
    return 'low_stock';
  }
  if (medicine.quantity > 10) {
    return 'stocked';
  }
  return 'unknown';
};

export const getStatusConfig = (status) => {
  switch(status) {
    case 'stocked':
      return {
        color: 'bg-green-100 text-green-800',
        text: 'STOCKED',
        icon: 'CheckCircle'
      };
    case 'low_stock':
      return {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'LOW STOCK',
        icon: 'AlertTriangle'
      };
    case 'expired':
      return {
        color: 'bg-red-100 text-red-800',
        text: 'EXPIRED',
        icon: 'XCircle'
      };
    case 'expiring':
      return {
        color: 'bg-orange-100 text-orange-800',
        text: 'EXPIRING SOON',
        icon: 'AlertTriangle'
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800',
        text: 'UNKNOWN',
        icon: 'AlertCircle'
      };
  }
};

export const initialMedicines = () => {
  const today = getTodayDate();
  return [
    {
      id: 1,
      name: 'Amoxicillin',
      type: 'Prescription',
      strength: '500mg',
      quantity: 12,
      unit: 'pills',
      remaining: '12 pills remaining',
      expiryDate: '2026-12-14',
      activeIngredients: 'Amoxicillin Trihydrate',
      requiresAttention: false,
      schedule: {
        morning: '08:00',
        afternoon: '13:00',
        evening: '20:00',
        night: '22:00'
      },
      scheduleEnabled: {
        morning: true,
        afternoon: true,
        evening: true,
        night: false
      },
      dailyDoses: 2,
      lotNumber: 'AMX202401'
    },
    {
      id: 2,
      name: 'Advil Liquid Gels',
      type: 'OTC',
      strength: '200mg',
      quantity: 2,
      unit: 'capsules',
      remaining: '2 capsules remaining',
      expiryDate: '2026-05-05',
      activeIngredients: 'Ibuprofen',
      requiresAttention: true,
      attentionText: 'Reorder recommended',
      schedule: {
        morning: '09:00',
        afternoon: '14:00',
        evening: '21:00',
        night: '22:00'
      },
      scheduleEnabled: {
        morning: true,
        afternoon: true,
        evening: false,
        night: false
      },
      dailyDoses: 1,
      lotNumber: 'ADV202402'
    },
    {
      id: 3,
      name: 'Cough Syrup',
      type: 'OTC',
      strength: '',
      quantity: 100,
      unit: 'ml',
      remaining: '100 ml remaining',
      expiryDate: '2024-01-01',
      activeIngredients: 'Dextromethorphan',
      requiresAttention: true,
      attentionText: 'Expired - Discard',
      schedule: {
        morning: '08:00',
        afternoon: '13:00',
        evening: '20:00',
        night: '22:00'
      },
      scheduleEnabled: {
        morning: false,
        afternoon: true,
        evening: false,
        night: false
      },
      dailyDoses: 3,
      lotNumber: 'CS202403'
    },
    {
      id: 4,
      name: 'Vitamin D3',
      type: 'Supplement',
      strength: '1000IU',
      quantity: 60,
      unit: 'capsules',
      remaining: '60 caps remaining',
      expiryDate: '2026-09-15',
      activeIngredients: 'Cholecalciferol',
      requiresAttention: false,
      schedule: {
        morning: '08:00',
        afternoon: '',
        evening: '',
        night: ''
      },
      scheduleEnabled: {
        morning: true,
        afternoon: false,
        evening: false,
        night: false
      },
      dailyDoses: 1,
      lotNumber: 'VD202404'
    },
    {
      id: 5,
      name: 'Metformin',
      type: 'Prescription',
      strength: '850mg',
      quantity: 90,
      unit: 'tablets',
      remaining: '90 tablets remaining',
      expiryDate: '2025-08-20',
      activeIngredients: 'Metformin Hydrochloride',
      requiresAttention: false,
      schedule: {
        morning: '08:00',
        afternoon: '14:00',
        evening: '20:00',
        night: ''
      },
      scheduleEnabled: {
        morning: true,
        afternoon: true,
        evening: true,
        night: false
      },
      dailyDoses: 3,
      lotNumber: 'MET202405'
    },
    {
      id: 6,
      name: 'Aspirin',
      type: 'OTC',
      strength: '81mg',
      quantity: 5,
      unit: 'tablets',
      remaining: '5 tablets remaining',
      expiryDate: '2025-03-15',
      activeIngredients: 'Acetylsalicylic Acid',
      requiresAttention: true,
      attentionText: 'Low stock - Consider refill',
      schedule: {
        morning: '07:00',
        afternoon: '',
        evening: '',
        night: ''
      },
      scheduleEnabled: {
        morning: true,
        afternoon: false,
        evening: false,
        night: false
      },
      dailyDoses: 1,
      lotNumber: 'ASP202406'
    },
    {
      id: 7,
      name: 'Expired Painkiller',
      type: 'OTC',
      strength: '500mg',
      quantity: 10,
      unit: 'tablets',
      remaining: '10 tablets remaining',
      expiryDate: today,
      activeIngredients: 'Paracetamol',
      requiresAttention: true,
      attentionText: 'Expired - Discard',
      schedule: {
        morning: '08:00',
        afternoon: '13:00',
        evening: '20:00',
        night: '22:00'
      },
      scheduleEnabled: {
        morning: true,
        afternoon: true,
        evening: true,
        night: false
      },
      dailyDoses: 2,
      lotNumber: 'EP202407'
    }
  ].map(medicine => ({
    ...medicine,
    expiryText: calculateExpiryText(medicine.expiryDate),
    status: getMedicineStatus(medicine)
  }));
};
