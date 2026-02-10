import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Bell, 
  Clock, 
  Pill, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  X,
  ChevronRight,
  Sun,
  Moon,
  Package,
  Search,
  RefreshCw,
  ArrowLeft,
  Shield,
  Thermometer,
  Heart,
  Info,
  Zap,
  CheckSquare,
  XSquare,
  CalendarDays,
  TrendingUp,
  Battery,
  Droplets,
  AlertCircle,
  Trash2,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Clock4,
  Clock8,
  Clock12,
  Clock3,
  Clock9,
  TrendingDown,
  ThermometerSnowflake,
  BatteryCharging,
  CalendarX,
  CalendarCheck,
  PackageX,
  PackageCheck,
  AlertOctagon,
  BellRing,
  ClockAlert,
  Edit,
  Save,
  Eye,
  FileText
} from 'lucide-react';
import EditMedicineModal from "../../components/common/EditMedicineModal";
import { 
  generateAlertsFromMedicines,
  getAlertStatusConfig,
  getExpiryStatusBadge,
  getLowStockStatusBadge,
  getMedicineStatus 
} from '../../components/common/alertUtils';
// ✅ Backend Alert API import - Backend se alerts fetch karne ke liye
import { getAlerts, handleAlertAction } from "../../services/alertApi";

const AlertsPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedExpiry, setExpandedExpiry] = useState(true);
  const [expandedLowStock, setExpandedLowStock] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  
  const normalizeAlertsPayload = (res) => {
    const data = res?.data ?? res ?? {};
    const payload = data.data ?? data;
    return {
      reminders: Array.isArray(payload.reminders) ? payload.reminders : [],
      expiry: Array.isArray(payload.expiry) ? payload.expiry : [],
      lowStock: Array.isArray(payload.lowStock) ? payload.lowStock : []
    };
  };

  // ✅ Load alerts from BACKEND API (not localStorage)
  useEffect(() => {
    const loadAlertsFromBackend = async () => {
      try {
        console.log('🔄 Fetching alerts from backend...');
        const res = await getAlerts();
        console.log('✅ Backend response:', res);
        const payload = normalizeAlertsPayload(res);
        
        // Backend response: { success: true, data: { reminders: [], expiry: [], lowStock: [] } }
        const allAlerts = [
          ...payload.reminders.map(a => ({ ...a, type: 'schedule' })),
          ...payload.expiry.map(a => ({ ...a, type: 'expiry' })),
          ...payload.lowStock.map(a => ({ ...a, type: 'low_stock' }))
        ];
        
        console.log('📋 Total alerts:', allAlerts.length);
        console.log('  - Reminders:', payload.reminders.length);
        console.log('  - Expiry:', payload.expiry.length);
        console.log('  - Low Stock:', payload.lowStock.length);
        
        setAlerts(allAlerts);
      } catch (err) {
        console.error("❌ Failed to load alerts from backend", err);
      }
    };
    
    loadAlertsFromBackend();
    
    // 🔍 Refresh alerts every 1 second for instant sync (notification se action lene par turant update)
    const intervalId = setInterval(loadAlertsFromBackend, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // ✅ Handle dose action - Backend API call (TAKEN/MISSED)
  const handleDoseAction = async (alertId, action) => {
    try {
      console.log(`\n🎯 UI ACTION CLICKED:`);
      console.log(`   Alert ID: ${alertId}`);
      console.log(`   Action: ${action}`);
      
      // 🔍 STEP 1: Backend ko action bhejo - yeh medicine quantity bhi update karega
      console.log(`📤 Calling handleAlertAction API...`);
      const response = await handleAlertAction(alertId, action.toUpperCase());
      console.log(`✅ API Response:`, response);
      
      // 🔍 STEP 2: Local state immediately update karo (UI se hat jayega)
      setAlerts(prev => prev.map(alert => 
        alert._id === alertId 
          ? { ...alert, status: action.toUpperCase(), showInUI: false }
          : alert
      ));
      console.log(`✅ Local state updated - alert hidden from UI`);
      
      // Success message
      const message = action === 'taken' 
        ? '✅ Dose marked as taken! Medicine quantity updated.'
        : '⏭️ Dose marked as missed.';
      
      console.log(message);
      
      // 🔍 STEP 3: Backend se fresh alerts fetch karo (1 second baad)
      console.log(`🔄 Refreshing alerts from backend in 1 second...`);
      setTimeout(async () => {
        const res = await getAlerts();
        const payload = normalizeAlertsPayload(res);
        const allAlerts = [
          ...payload.reminders.map(a => ({ ...a, type: 'schedule' })),
          ...payload.expiry.map(a => ({ ...a, type: 'expiry' })),
          ...payload.lowStock.map(a => ({ ...a, type: 'low_stock' }))
        ];
        setAlerts(allAlerts);
        console.log(`✅ Alerts refreshed - total: ${allAlerts.length}\n`);
      }, 1000);
      
    } catch (err) {
      console.error("❌ Failed to handle alert action", err);
    }
  };

  // Handle edit medicine
  const handleEditMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setShowEditModal(true);
  };

  // Handle save edited medicine
  const handleSaveMedicine = (medicineData) => {
    const updatedMedicines = medicines.map(medicine => {
      if (medicine.id === selectedMedicine.id) {
        const updatedMedicine = {
          ...medicine,
          name: medicineData.name,
          brand: medicineData.brand,
          type: medicineData.type,
          strength: medicineData.dosage,
          quantity: parseInt(medicineData.totalQuantity),
          unit: medicineData.dosage.includes('mg') ? 'tablets' : 
                medicineData.dosage.includes('ml') ? 'ml' : 'units',
          expiryDate: medicineData.expiryDate,
          lotNumber: medicineData.lotNumber,
          dailyDoses: parseInt(medicineData.dailyDoses) || 1,
          schedule: medicineData.schedule,
          scheduleEnabled: medicineData.scheduleEnabled,
          remaining: `${medicineData.totalQuantity} ${medicineData.dosage.includes('mg') ? 'tablets' : medicineData.dosage.includes('ml') ? 'ml' : 'units'} remaining`,
          status: getMedicineStatus({
            expiryDate: medicineData.expiryDate,
            quantity: parseInt(medicineData.totalQuantity)
          })
        };
        
        return updatedMedicine;
      }
      return medicine;
    });

    setMedicines(updatedMedicines);
    localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
    
    setSelectedMedicine(null);
    setShowEditModal(false);
    
    alert('Medicine updated successfully!');
  };

  // ✅ Handle dismiss action - Expiry aur Low Stock alerts ke liye
  const handleDismissAlert = async (alertId) => {
    try {
      // Backend ko DISMISSED action bhejo
      await handleAlertAction(alertId, 'DISMISSED');
      
      // Local state se remove karo
      setAlerts(prev => prev.filter(alert => alert._id !== alertId));
      
    } catch (err) {
      console.error("❌ Failed to dismiss alert", err);
    }
  };

  // Refresh alerts
  const handleRefresh = () => {
    const savedMedicines = localStorage.getItem('medicines');
    if (savedMedicines) {
      const parsedMedicines = JSON.parse(savedMedicines);
      const updatedMedicines = parsedMedicines.map(medicine => ({
        ...medicine,
        status: getMedicineStatus(medicine)
      }));
      setMedicines(updatedMedicines);
    }
  };

  // Filter alerts - Only show PENDING alerts
  const scheduleAlerts = alerts.filter(a => a.type === 'schedule' && a.status === 'PENDING');
  const expiryAlerts = alerts.filter(a => a.type === 'expiry' && a.status === 'PENDING');
  const lowStockAlerts = alerts.filter(a => a.type === 'low_stock' && a.status === 'PENDING');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-2 lg:p-4">
      {/* Back Button */}
      <div className="mb-4 lg:mb-6">
        <NavLink 
          to="/dashboard"
          className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 text-gray-700 hover:text-blue-600 shadow-sm hover:shadow-md text-sm lg:text-base font-medium"
        >
          <ArrowLeft size={18} className="lg:w-5 lg:h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>Back to Home</span>
        </NavLink>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-8">
          {/* Left Column: Today's Schedule */}
          <div>
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200 mb-4 lg:mb-6">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 lg:w-10 h-8 lg:h-10 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-center">
                    <Clock className="text-blue-600 lg:w-[22px] lg:h-[22px]" size={18}  />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-xl font-bold text-gray-900">Alert's & Notification</h2>
                    <p className="text-xs lg:text-sm text-gray-600">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl lg:text-2xl font-bold text-gray-900">
                    {scheduleAlerts.length} <span className="hidden sm:inline">Pending</span>
                  </div>
                  <div className="text-xs lg:text-sm text-gray-500">
                    <span className="hidden sm:inline">Dose reminders</span>
                    <span className="sm:hidden">Doses</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 lg:space-y-4">
                {scheduleAlerts.length > 0 ? (
                  scheduleAlerts.map(alert => {
                    // Backend data ko UI format mein convert karo
                    const statusBadge = getAlertStatusConfig(alert.status);
                    const alertDate = new Date(alert.createdAt);
                    const today = new Date();
                    const isToday = alertDate.toDateString() === today.toDateString();
                    
                    return (
                      <div key={alert._id} className="p-3 lg:p-5 rounded-xl border border-blue-200 bg-blue-50 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 lg:gap-4 flex-1 min-w-0">
                            <div className="p-2 lg:p-3 rounded-lg bg-blue-100 border border-blue-200 flex-shrink-0">
                              <Pill className="text-blue-600" size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                                <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                                  <h3 className="font-bold text-gray-900 text-sm lg:text-base truncate">{alert.medicineName}</h3>
                                  <span className="text-xs lg:text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex-shrink-0">
                                    {alert.dosage}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500 flex-shrink-0">
                                  <CalendarDays size={12} className="lg:w-[14px] lg:h-[14px]" />
                                  <span>
                                    {isToday ? 'Today' : alertDate.toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="text-gray-600 text-xs lg:text-sm mb-2 lg:mb-3 capitalize">
                                    {alert.scheduledTime} dose reminder
                                  </p>
                                  
                                  <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                                    <span className={`inline-flex items-center gap-1 px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                                      {alert.status === 'PENDING' ? <Clock size={10} className="lg:w-3 lg:h-3" /> : 
                                      alert.status === 'TAKEN' ? <CheckCircle size={10} className="lg:w-3 lg:h-3" /> : 
                                      <X size={10} className="lg:w-3 lg:h-3" />}
                                      {statusBadge.label}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="text-right flex-shrink-0">
                                  <div className="text-sm lg:text-base font-medium text-gray-900 capitalize">
                                    {alert.scheduledTime}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-blue-200">
                          {alert.status === 'PENDING' ? (
                            <>
                              <button
                                onClick={() => handleDoseAction(alert._id, 'taken')}
                                className="flex-1 px-3 lg:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs lg:text-sm font-medium flex items-center gap-1 lg:gap-2 justify-center shadow-sm hover:shadow"
                              >
                                <CheckSquare size={14} className="lg:w-4 lg:h-4" />
                                <span className="hidden sm:inline">Confirm Taken</span>
                                <span className="sm:hidden">Taken</span>
                              </button>
                              <button
                                onClick={() => handleDoseAction(alert._id, 'missed')}
                                className="flex-1 px-3 lg:px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-xs lg:text-sm font-medium flex items-center gap-1 lg:gap-2 justify-center"
                              >
                                <XSquare size={14} className="lg:w-4 lg:h-4" />
                                <span className="hidden sm:inline">Mark Missed</span>
                                <span className="sm:hidden">Missed</span>
                              </button>
                            </>
                          ) : (
                            <div className="w-full text-center">
                              <div className={`text-xs lg:text-sm font-medium ${alert.status === 'TAKEN' ? 'text-green-600' : 'text-red-600'}`}>
                                {alert.status === 'TAKEN' ? '✓ Confirmed' : '✗ Missed'}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 lg:py-12">
                    <Clock className="mx-auto text-gray-300 mb-4 lg:w-12 lg:h-12" size={40}  />
                    <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No scheduled doses</h3>
                    <p className="text-gray-600 max-w-sm mx-auto text-sm lg:text-base px-4">
                      All doses for today are completed or no medicines are scheduled.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Expiry & Low Stock Lists */}
          <div className="space-y-4 lg:space-y-6">
            {/* Expiry Medicines List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div 
                className="p-4 lg:p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedExpiry(!expandedExpiry)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 lg:w-10 h-8 lg:h-10 bg-red-50 rounded-xl border border-red-200 flex items-center justify-center">
                      <AlertTriangle className="text-red-600 lg:w-[22px] lg:h-[22px]" size={18}  />
                    </div>
                    <div>
                      <h2 className="text-lg lg:text-xl font-bold text-gray-900">Expiry Medicines</h2>
                      <p className="text-xs lg:text-sm text-gray-600">Track and manage expiry dates</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xl lg:text-2xl font-bold text-gray-900">{expiryAlerts.length}</div>
                      <div className="text-xs lg:text-sm text-gray-500">
                        <span className="hidden sm:inline">Total items</span>
                        <span className="sm:hidden">Items</span>
                      </div>
                    </div>
                    {expandedExpiry ? <ChevronUp size={18} className="lg:w-5 lg:h-5" /> : <ChevronDown size={18} className="lg:w-5 lg:h-5" />}
                  </div>
                </div>
              </div>
              
              {expandedExpiry && (
                <div className="p-4 lg:p-6">
                  <div className="space-y-3 lg:space-y-4">
                    {expiryAlerts.length > 0 ? (
                      expiryAlerts.map(alert => {
                        // Backend data ko UI format mein convert karo
                        const expiryDate = alert.expiryDate || alert.medicine?.expiryDate;
                        const daysUntilExpiry = expiryDate ? Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
                        const statusBadge = getExpiryStatusBadge(daysUntilExpiry);
                        
                        return (
                          <div key={alert._id} className="p-3 lg:p-4 border border-red-200 rounded-xl hover:shadow-sm transition-all duration-200 bg-red-50">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 lg:gap-4 flex-1 min-w-0">
                                <div className="p-2 rounded-lg bg-red-100 flex-shrink-0">
                                  <AlertTriangle className="text-red-600" size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                                    <div className="min-w-0">
                                      <h3 className="font-bold text-gray-900 text-sm lg:text-base truncate">{alert.medicineName}</h3>
                                      <p className="text-gray-600 text-xs lg:text-sm mt-1">
                                        {daysUntilExpiry <= 0 ? 'Medicine has expired' : `Expires in ${daysUntilExpiry} days`}
                                      </p>
                                    </div>
                                    <span className={`inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border} flex-shrink-0`}>
                                      {statusBadge.label}
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                                    <div className="bg-white p-2 lg:p-3 rounded-lg border border-red-100">
                                      <div className="flex items-center gap-2 mb-1">
                                        <CalendarDays size={12} className="text-gray-500 lg:w-[14px] lg:h-[14px]" />
                                        <span className="text-xs font-medium text-gray-700">Expiry Date</span>
                                      </div>
                                      <div className="text-xs lg:text-sm text-gray-900">
                                        {expiryDate ? new Date(expiryDate).toLocaleDateString() : 'N/A'}
                                      </div>
                                      <div className={`text-xs font-medium ${daysUntilExpiry <= 0 ? 'text-red-600' : 'text-orange-600'}`}>
                                        {daysUntilExpiry <= 0 
                                          ? `${Math.abs(daysUntilExpiry)} days ago` 
                                          : `In ${daysUntilExpiry} days`}
                                      </div>
                                    </div>
                                    
                                    <div className="bg-white p-2 lg:p-3 rounded-lg border border-red-100">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Package size={12} className="text-gray-500 lg:w-[14px] lg:h-[14px]" />
                                        <span className="text-xs font-medium text-gray-700">Quantity</span>
                                      </div>
                                      <div className="text-xs lg:text-sm text-gray-900">
                                        {alert.medicine?.remainingQuantity || 'N/A'}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {alert.medicine?.dosage || 'N/A'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 lg:gap-3 mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-red-200">
                              <button
                                onClick={() => alert.medicine && handleEditMedicine(alert.medicine)}
                                className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs lg:text-sm font-medium flex items-center gap-1 lg:gap-2 flex-1 justify-center"
                              >
                                <Edit size={14} className="lg:w-4 lg:h-4" />
                                <span className="hidden sm:inline">Edit Details</span>
                                <span className="sm:hidden">Edit</span>
                              </button>
                             
                              <button
                                onClick={() => handleDismissAlert(alert._id)}
                                className="px-3 lg:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs lg:text-sm font-medium"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6 lg:py-8">
                        <CalendarCheck className="mx-auto text-green-300 mb-3 lg:w-10 lg:h-10" size={32}  />
                        <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No Expiry Alerts</h3>
                        <p className="text-gray-600 text-sm lg:text-base">
                          All medicines have valid expiry dates.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Low Stock Medicines List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div 
                className="p-4 lg:p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedLowStock(!expandedLowStock)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 lg:w-10 h-8 lg:h-10 bg-yellow-50 rounded-xl border border-yellow-200 flex items-center justify-center">
                      <Package className="text-yellow-600 lg:w-[22px] lg:h-[22px]" size={18}  />
                    </div>
                    <div>
                      <h2 className="text-lg lg:text-xl font-bold text-gray-900">Low Stock Medicines</h2>
                      <p className="text-xs lg:text-sm text-gray-600">Track and manage stock levels</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xl lg:text-2xl font-bold text-gray-900">{lowStockAlerts.length}</div>
                      <div className="text-xs lg:text-sm text-gray-500">
                        <span className="hidden sm:inline">Total items</span>
                        <span className="sm:hidden">Items</span>
                      </div>
                    </div>
                    {expandedLowStock ? <ChevronUp size={18} className="lg:w-5 lg:h-5" /> : <ChevronDown size={18} className="lg:w-5 lg:h-5" />}
                  </div>
                </div>
              </div>
              
              {expandedLowStock && (
                <div className="p-6">
                  <div className="space-y-4">
                    {lowStockAlerts.length > 0 ? (
                      lowStockAlerts.map(alert => {
                        // Backend data ko UI format mein convert karo
                        const quantity = alert.stockLeft || alert.medicine?.remainingQuantity || 0;
                        const threshold = alert.threshold || 2;
                        const statusBadge = getLowStockStatusBadge(quantity);
                        
                        return (
                          <div key={alert._id} className="p-4 border border-yellow-200 rounded-xl hover:shadow-sm transition-all duration-200 bg-yellow-50">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-yellow-100">
                                  <Package className="text-yellow-600" size={20} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-bold text-gray-900">{alert.medicineName}</h3>
                                      <p className="text-gray-600 text-sm mt-1">Stock running low - only {quantity} left</p>
                                    </div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                                      {statusBadge.label}
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 mt-3">
                                    <div className="bg-white p-3 rounded-lg border border-yellow-100">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Package size={14} className="text-gray-500" />
                                        <span className="text-xs font-medium text-gray-700">Stock Level</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                          <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                              className={`h-2 rounded-full ${
                                                quantity <= 1 ? 'bg-red-500' :
                                                quantity <= 2 ? 'bg-orange-500' :
                                                'bg-yellow-500'
                                              }`}
                                              style={{ width: `${Math.min((quantity / (alert.medicine?.totalQuantity || quantity)) * 100, 100)}%` }}
                                            ></div>
                                          </div>
                                        </div>
                                        <div className="text-sm font-bold text-gray-900">
                                          {quantity}/{alert.medicine?.totalQuantity || quantity}
                                        </div>
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        Only {quantity} remaining
                                      </div>
                                    </div>
                                    
                                    <div className="bg-white p-3 rounded-lg border border-yellow-100">
                                      <div className="flex items-center gap-2 mb-1">
                                        <CalendarDays size={14} className="text-gray-500" />
                                        <span className="text-xs font-medium text-gray-700">Medicine</span>
                                      </div>
                                      <div className="text-sm text-gray-900">
                                        {alert.medicine?.name || alert.medicineName}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {alert.medicine?.dosage || 'N/A'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-3 mt-4 pt-4 border-t border-yellow-200">
                              <button
                                onClick={() => alert.medicine && handleEditMedicine(alert.medicine)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 flex-1 justify-center"
                              >
                                <Edit size={16} />
                                Edit Stock
                              </button>
                             
                              <button
                                onClick={() => handleDismissAlert(alert._id)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <PackageCheck className="mx-auto text-green-300 mb-3" size={40} />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Stock Levels Good</h3>
                        <p className="text-gray-600">
                          All medicines are well-stocked.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Medicine Modal */}
      <EditMedicineModal
        medicine={selectedMedicine}
        isOpen={showEditModal}
        onClose={() => {
          setSelectedMedicine(null);
          setShowEditModal(false);
        }}
        onSave={handleSaveMedicine}
        isEditing={true}
      />
    </div>
  );
};

export default AlertsPage;
