import { 
  CalendarX, 
  AlertOctagon, 
  CalendarDays, 
  PackageX, 
  AlertTriangle, 
  Package,
  Sun,
  Moon
} from 'lucide-react';

export const generateAlertsFromMedicines = (medicines) => {
  if (!medicines || medicines.length === 0) return [];

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const now = new Date();
  
  const generatedAlerts = medicines.flatMap(medicine => {
    const alertsForMedicine = [];
    
    // 1. Expiry Alerts
    const expiryDate = new Date(medicine.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 30) {
      alertsForMedicine.push({
        id: `${medicine.id}-expiry-${todayStr}`,
        type: 'expiry',
        title: medicine.name,
        description: medicine.strength,
        medicine: medicine,
        daysUntilExpiry: daysUntilExpiry,
        status: daysUntilExpiry <= 0 ? 'expired' : 
               daysUntilExpiry <= 7 ? 'critical' : 
               daysUntilExpiry <= 30 ? 'warning' : 'normal',
        timestamp: expiryDate,
        icon: daysUntilExpiry <= 0 ? <CalendarX className="text-red-600" size={18} /> : 
              daysUntilExpiry <= 7 ? <AlertOctagon className="text-orange-600" size={18} /> : 
              <CalendarDays className="text-yellow-600" size={18} />
      });
    }
    
    // 2. Low Stock Alerts
    if (medicine.quantity <= 10) {
      const daysLeft = Math.floor(medicine.quantity / (medicine.dailyDoses || 1));
      alertsForMedicine.push({
        id: `${medicine.id}-lowstock-${todayStr}`,
        type: 'low_stock',
        title: medicine.name,
        description: medicine.strength,
        medicine: medicine,
        quantity: medicine.quantity,
        daysLeft: daysLeft,
        status: medicine.quantity <= 3 ? 'critical' : 
               medicine.quantity <= 5 ? 'warning' : 'low',
        timestamp: new Date(),
        icon: medicine.quantity <= 3 ? <PackageX className="text-red-600" size={18} /> : 
              medicine.quantity <= 5 ? <AlertTriangle className="text-orange-600" size={18} /> : 
              <Package className="text-yellow-600" size={18} />
      });
    }
    
    // 3. Schedule Alerts for Today (trigger at exact time and persist until action taken)
    if (medicine.schedule && medicine.scheduleEnabled) {
      Object.entries(medicine.schedule).forEach(([period, time]) => {
        if (medicine.scheduleEnabled[period] && time) {
          const [hours, minutes] = time.split(':').map(Number);
          const alertTime = new Date();
          alertTime.setHours(hours, minutes, 0, 0);

          const alertId = `${medicine.id}-${period}-${todayStr}`;
          const savedActions = localStorage.getItem('medicineActions') || '{}';
          const actionHistory = JSON.parse(savedActions);
          const actionKey = `${alertId}-action`;

          // Show alert exactly at the scheduled time (or anytime after) until user acts
          if (now >= alertTime && !actionHistory[actionKey]) {
            const periodName = period.charAt(0).toUpperCase() + period.slice(1);
            const formattedTime = alertTime.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            });
            
            const getPeriodIcon = () => {
              if (period === 'morning') return <Sun className="text-yellow-500" size={18} />;
              if (period === 'afternoon') return <Sun className="text-orange-500" size={18} />;
              if (period === 'evening') return <Moon className="text-indigo-500" size={18} />;
              return <Moon className="text-purple-500" size={18} />;
            };
            
            alertsForMedicine.push({
              id: alertId,
              type: 'schedule',
              title: `${medicine.name}`,
              description: `${periodName} dose`,
              medicine: medicine,
              period: period,
              time: formattedTime,
              scheduledTime: alertTime,
              status: 'pending',
              timestamp: alertTime,
              icon: getPeriodIcon(),
              timeDiff: 999,
              isUpcoming: false
            });
          }
        }
      });
    }
    
    return alertsForMedicine;
  });

  // Sort alerts
  const scheduleAlerts = generatedAlerts.filter(a => a.type === 'schedule')
    .sort((a, b) => a.scheduledTime - b.scheduledTime);
  const expiryAlerts = generatedAlerts.filter(a => a.type === 'expiry')
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  const lowStockAlerts = generatedAlerts.filter(a => a.type === 'low_stock')
    .sort((a, b) => a.quantity - b.quantity);

  return [...scheduleAlerts, ...expiryAlerts, ...lowStockAlerts];
};

export const getAlertStatusConfig = (status) => {
  const styles = {
    pending: { 
      bg: 'bg-yellow-50', 
      text: 'text-yellow-700', 
      border: 'border-yellow-200',
      icon: 'Clock',
      label: 'Pending'
    },
    taken: { 
      bg: 'bg-green-50', 
      text: 'text-green-700', 
      border: 'border-green-200',
      icon: 'CheckCircle',
      label: 'Taken'
    },
    missed: { 
      bg: 'bg-red-50', 
      text: 'text-red-700', 
      border: 'border-red-200',
      icon: 'X',
      label: 'Missed'
    }
  };
  return styles[status] || styles.pending;
};

export const getExpiryStatusBadge = (days) => {
  if (days <= 0) {
    return {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      label: 'EXPIRED'
    };
  } else if (days <= 7) {
    return {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-200',
      label: 'CRITICAL'
    };
  } else if (days <= 30) {
    return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      label: 'WARNING'
    };
  } else {
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      label: 'NORMAL'
    };
  }
};

export const getLowStockStatusBadge = (quantity) => {
  if (quantity <= 3) {
    return {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      label: 'VERY LOW'
    };
  } else if (quantity <= 5) {
    return {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-200',
      label: 'LOW'
    };
  } else {
    return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      label: 'RUNNING LOW'
    };
  }
};

export const getMedicineStatus = (medicine) => {
  const today = new Date();
  const expiryDate = new Date(medicine.expiryDate);
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry <= 0) {
    return 'expired';
  }
  if (medicine.quantity <= 3) {
    return 'low_stock';
  }
  if (medicine.quantity <= 10) {
    return 'expiring';
  }
  if (medicine.quantity > 10) {
    return 'stocked';
  }
  return 'unknown';
};
