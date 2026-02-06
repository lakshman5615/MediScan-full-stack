import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";

import { 
  Search, 
  Filter, 
  AlertCircle, 
  Calendar, 
  Pill, 
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Bell,
  History,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Camera,
  Upload,
  Zap,
  ChevronRight,
  Shield,
  Thermometer,
  Scissors,
  Droplets,
  Heart,
  Info,
  X,
  Clock,
  Sun,
  Moon,
  Save,
  ArrowLeft,
  CalendarDays
} from 'lucide-react';

import {
  getMedicines,
  addMedicine,
  deleteMedicine,
  updateMedicine,
  markDoseTaken,
  markDoseMissed
} from "../../services/medicine.service";
import {
  getStatusConfig,
  isMedicineExpired,
  getMedicineStatus
} from "../../utils/medicineUtils";

import EditMedicineModal from '../../components/common/EditMedicineModal';


const MedicineCabinet = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMedicineId, setEditingMedicineId] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showAllMedicines, setShowAllMedicines] = useState(false);
  
  // Load medicines from backend
  // useEffect(() => {
  //   const loadMedicines = async () => {
  //     try {
  //       // const data = await getCabinet();
  //       const updatedMedicines = data.medicines?.map(medicine => ({
  //         ...medicine,
  //         status: getMedicineStatus(medicine)
  //       })) || [];
  //       setMedicines(updatedMedicines);
  //       calculateNotificationCount(updatedMedicines);
  //     } catch (error) {
  //       console.error('Error loading medicines:', error);
  //       // Fallback to localStorage for offline mode
  //       const savedMedicines = localStorage.getItem('medicines');
  //       if (savedMedicines) {
  //         try {
  //           const parsedMedicines = JSON.parse(savedMedicines);
  //           const updatedMedicines = parsedMedicines.map(medicine => ({
  //             ...medicine,
  //             status: getMedicineStatus(medicine)
  //           }));
  //           setMedicines(updatedMedicines);
  //           calculateNotificationCount(updatedMedicines);
  //         } catch (parseError) {
  //           console.error('Error parsing saved medicines:', parseError);
  //         }
  //       }
  //     }
  //   };
    
  //   loadMedicines();
    
  //   // Refresh every minute for real-time updates
  //   const interval = setInterval(() => {
  //     loadMedicines();
  //   }, 60000);
    
  //   return () => clearInterval(interval);
  // }, []);


  useEffect(() => {
  loadMedicines();
}, []);

// const loadMedicines = async () => {
//   try {
//     const res = await getMedicines();

//     const formatted = res.data.map((med) => ({
//       ...med,
//       id: med._id,
//       name: med.medicineName,
//       remaining: `${med.quantity} units`,
//       status: getMedicineStatus({
//         expiryDate: med.expiryDate,
//         quantity: med.quantity,
//       }),
//     }));

//     setMedicines(formatted);
//     calculateNotificationCount(formatted);
//   } catch (err) {
//     console.error("Failed to load medicines", err);
//   }
// };
const loadMedicines = async () => {
  try {
    const res = await getMedicines();

    // 🔥 SAFE extraction
    const medicinesArray = res?.data || res?.medicines || [];

    if (!Array.isArray(medicinesArray)) {
      console.error("Medicines is not an array", res);
      return;
    }

    const formatted = medicinesArray.map((med) => {
      const schedule = med.schedule || {};
      const scheduleEnabled = {
        morning: !!schedule.morning?.enabled,
        afternoon: !!schedule.afternoon?.enabled,
        evening: !!schedule.evening?.enabled,
        night: !!schedule.night?.enabled
      };

      return {
        id: med._id,
        name: med.name || med.medicineName,
        brand: med.brand || "",
        type: med.medicineType || med.type,
        strength: med.dosage || "",
        quantity: med.remainingQuantity ?? med.totalQuantity ?? med.quantity ?? 0,
        totalQuantity: med.totalQuantity ?? 0,
        expiryDate: med.expiryDate,
        schedule: {
          morning: schedule.morning?.time || "08:00",
          afternoon: schedule.afternoon?.time || "13:00",
          evening: schedule.evening?.time || "18:00",
          night: schedule.night?.time || "22:00"
        },
        scheduleEnabled,
        remaining: `${med.remainingQuantity ?? med.totalQuantity ?? med.quantity ?? 0} units`,
        status: getMedicineStatus({
          expiryDate: med.expiryDate,
          quantity: med.remainingQuantity ?? med.totalQuantity ?? med.quantity ?? 0
        })
      };
    });

    setMedicines(formatted);
    calculateNotificationCount(formatted);
  } catch (err) {
    console.error("Failed to load medicines", err);
  }
};


  // Calculate notification count
  const calculateNotificationCount = (medicinesList) => {
    let count = 0;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const now = new Date();
    const savedActions = localStorage.getItem('medicineActions') || '{}';
    const actionHistory = JSON.parse(savedActions);
    
    medicinesList.forEach(medicine => {
      // Check for schedule alerts (at exact time or after until action taken)
      if (medicine.schedule && medicine.scheduleEnabled) {
        Object.entries(medicine.schedule).forEach(([period, time]) => {
          if (medicine.scheduleEnabled[period] && time) {
            const [hours, minutes] = time.split(':').map(Number);
            const alertTime = new Date();
            alertTime.setHours(hours, minutes, 0, 0);

            const alertId = `${medicine.id}-${period}-${todayStr}`;
            const actionKey = `${alertId}-action`;

            // Count if scheduled time has passed and no action has been taken
            if (now >= alertTime && !actionHistory[actionKey]) {
              count++;
            }
          }
        });
      }
      
      // Check for expiry alerts (within 30 days)
      const expiryDate = new Date(medicine.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry <= 30) {
        count++;
      }
      
      // Check for low stock alerts
      if (medicine.quantity <= 10) {
        count++;
      }
    });
    
    setNotificationCount(count);
  };

  // Handle adding/editing medicine
  const handleSaveMedicine = async (medicineData) => {
  try {
    if (isEditing && editingMedicineId) {
      // ✅ UPDATE VIA API
      const schedule = {
        morning: {
          enabled: !!medicineData.scheduleEnabled?.morning,
          time: medicineData.schedule?.morning || "08:00"
        },
        afternoon: {
          enabled: !!medicineData.scheduleEnabled?.afternoon,
          time: medicineData.schedule?.afternoon || "13:00"
        },
        evening: {
          enabled: !!medicineData.scheduleEnabled?.evening,
          time: medicineData.schedule?.evening || "18:00"
        },
        night: {
          enabled: !!medicineData.scheduleEnabled?.night,
          time: medicineData.schedule?.night || "22:00"
        }
      };

      await updateMedicine(editingMedicineId, {
        name: medicineData.name,
        brand: medicineData.brand || "",
        medicineType: medicineData.type,
        dosage: medicineData.dosage || "",
        totalQuantity: parseInt(medicineData.totalQuantity),
        expiryDate: medicineData.expiryDate,
        lowStockThreshold: medicineData.lowStockThreshold || 5,
        schedule
      });

      await loadMedicines(); // ✅ DB se fresh data load
      alert(`${medicineData.name} updated in database!`);
      
    } else {
      // ✅ ADD NEW MEDICINE
      const normalizedType = medicineData.type === "Prescription" ? "OTC" : (medicineData.type || "OTC");
      
      const schedule = {
        morning: {
          enabled: !!medicineData.scheduleEnabled?.morning,
          time: medicineData.schedule?.morning || "08:00"
        },
        afternoon: {
          enabled: !!medicineData.scheduleEnabled?.afternoon,
          time: medicineData.schedule?.afternoon || "13:00"
        },
        evening: {
          enabled: !!medicineData.scheduleEnabled?.evening,
          time: medicineData.schedule?.evening || "18:00"
        },
        night: {
          enabled: !!medicineData.scheduleEnabled?.night,
          time: medicineData.schedule?.night || "22:00"
        }
      };

      await addMedicine({
        name: medicineData.name,
        brand: medicineData.brand || "",
        medicineType: normalizedType,
        dosage: medicineData.dosage || "",
        totalQuantity: Number(medicineData.totalQuantity),
        expiryDate: medicineData.expiryDate,
        lowStockThreshold: medicineData.lowStockThreshold || 5,
        schedule
      });

      await loadMedicines(); // ✅ DB se fresh data load
      alert(`${medicineData.name} added to database!`);
    }
  } catch (error) {
    console.error('Error saving medicine:', error);
    alert('Failed to save medicine. Check console for details.');
  }
  
  resetForm();
};

  // const handleSaveMedicine = async (medicineData) => {
  //   try {

  //     ///
      
  //     ///
  //     if (isEditing && editingMedicineId) {
  //       // For editing, we'll update locally for now
  //       // TODO: Implement update API endpoint
  //       const updatedMedicines = medicines.map(medicine => 
  //         medicine.id === editingMedicineId ? {
  //           ...medicine,
  //           name: medicineData.name,
  //           brand: medicineData.brand,
  //           type: medicineData.type,
  //           strength: medicineData.dosage,
  //           quantity: parseInt(medicineData.totalQuantity),
  //           unit: medicineData.dosage.includes('mg') ? 'tablets' : 
  //                 medicineData.dosage.includes('ml') ? 'ml' : 'units',
  //           expiryDate: medicineData.expiryDate,
  //           lotNumber: medicineData.lotNumber,
  //           dailyDoses: parseInt(medicineData.dailyDoses) || 1,
  //           schedule: medicineData.schedule,
  //           scheduleEnabled: medicineData.scheduleEnabled,
  //           remaining: `${medicineData.totalQuantity} ${medicineData.dosage.includes('mg') ? 'tablets' : medicineData.dosage.includes('ml') ? 'ml' : 'units'} remaining`,
  //           status: getMedicineStatus({
  //             expiryDate: medicineData.expiryDate,
  //             quantity: parseInt(medicineData.totalQuantity)
  //           })
  //         } : medicine
  //       );
        
  //       setMedicines(updatedMedicines);
  //       localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
  //       calculateNotificationCount(updatedMedicines);
  //       alert(`${medicineData.name} updated successfully!`);
  //     } else {
  //       // Add new medicine via API
  //       const unit = medicineData.dosage.includes('mg') ? 'tablets' : 
  //                   medicineData.dosage.includes('ml') ? 'ml' : 'units';
  //       const normalizedType = medicineData.type === "Prescription" ? "OTC" : (medicineData.type || "OTC");
                    
  //       const newMedicineData = {
  //         name: medicineData.name,
  //         brand: medicineData.brand,
  //         type: normalizedType,
  //         strength: medicineData.dosage,
  //         quantity: parseInt(medicineData.totalQuantity),
  //         unit: unit,
  //         expiryDate: medicineData.expiryDate,
  //         lotNumber: medicineData.lotNumber,
  //         dailyDoses: parseInt(medicineData.dailyDoses) || 1,
  //         schedule: medicineData.schedule,
  //         scheduleEnabled: medicineData.scheduleEnabled
  //       };
        
  //       // await addToCabinet(newMedicineData);
  //       // await addMedicine({
  //       //   medicineName: medicineData.name,
  //       //   type: medicineData.type,
  //       //   strength: medicineData.dosage,
  //       //   quantity: Number(medicineData.totalQuantity),
  //       //   expiryDate: medicineData.expiryDate,
  //       // });
  //       const schedule = {
  //         morning: {
  //           enabled: !!medicineData.scheduleEnabled?.morning,
  //           time: medicineData.schedule?.morning || "08:00"
  //         },
  //         afternoon: {
  //           enabled: !!medicineData.scheduleEnabled?.afternoon,
  //           time: medicineData.schedule?.afternoon || "13:00"
  //         },
  //         evening: {
  //           enabled: !!medicineData.scheduleEnabled?.evening,
  //           time: medicineData.schedule?.evening || "18:00"
  //         },
  //         night: {
  //           enabled: !!medicineData.scheduleEnabled?.night,
  //           time: medicineData.schedule?.night || "22:00"
  //         }
  //       };

  //       await addMedicine({
  //         name: medicineData.name,
  //         brand: medicineData.brand || "",
  //         medicineType: normalizedType,
  //         dosage: medicineData.dosage || "",
  //         totalQuantity: Number(medicineData.totalQuantity),
  //         expiryDate: medicineData.expiryDate,
  //         lowStockThreshold: medicineData.lowStockThreshold || 5,
  //         schedule
  //       });

  //       await loadMedicines();
  //       alert(`${medicineData.name} added successfully!`);
  //     }
  //   } catch (error) {
  //     console.error('Error saving medicine:', error);
  //     alert('Error saving medicine. Please try again.');
  //   }
    
  //   resetForm();
  // };

  // Handle edit medicine
  const handleEditMedicine = (medicine) => {
    setIsEditing(true);
    setEditingMedicineId(medicine.id);
    setShowAddMedicineModal(true);
  };

  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setEditingMedicineId(null);
    setShowAddMedicineModal(false);
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = searchQuery === '' || 
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (medicine.activeIngredients && medicine.activeIngredients.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'low_stock') return matchesSearch && medicine.quantity <= 2;
    if (selectedFilter === 'expiring') return matchesSearch && isMedicineExpired(medicine.expiryDate);
    if (selectedFilter === 'prescription') return matchesSearch && medicine.quantity > 2;
    return matchesSearch;
  });

  const displayedMedicines = showAllMedicines ? filteredMedicines : filteredMedicines.slice(0, 4);
  const displayedGridMedicines = showAllMedicines ? filteredMedicines : filteredMedicines.slice(0, 6);

  const handleViewAllMedicines = () => {
    setShowAllMedicines(true);
  };

  const medicinesRequiringAttention = medicines.filter(m => m.requiresAttention).length;
  const lowStockCount = medicines.filter(m => m.quantity <= 2).length;
  const expiringSoonCount = medicines.filter(m => isMedicineExpired(m.expiryDate)).length;
  const prescriptionCount = medicines.filter(m => m.quantity > 2).length;

  const handleViewMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setShowMedicineModal(true);
  };



  // const handleDiscard = (medicineId) => {
  //   if (window.confirm('Are you sure you want to discard this medicine?')) {
  //     const updatedMedicines = medicines.filter(m => m.id !== medicineId);
  //     setMedicines(updatedMedicines);
  //     localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
  //     calculateNotificationCount(updatedMedicines);
  //     alert('Medicine discarded successfully');
  //   }
  // };
  const handleDiscard = async (medicineId) => {
  if (!window.confirm("Delete this medicine?")) return;

  try {
    await deleteMedicine(medicineId);
    loadMedicines();
  } catch (err) {
    console.error("Delete failed", err);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-screen overflow-y-auto hidden lg:block">
        <div className="p-6">
          {/* Back Button */}
          <div>
            <button 
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-md mb-4"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Pill className="text-white" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-gray-900 text-lg">Mediscan</h1>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                INVENTORY VIEW
              </h2>
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedFilter('all');
                    setShowAllMedicines(false);
                  }}
                  className="flex items-center gap-3 w-full p-2 rounded-lg bg-blue-50 text-blue-700"
                >
                  <Package size={18} />
                  <span className="font-medium">All Medicines</span>
                  <ChevronRight className="ml-auto" size={16} />
                </button>
              </nav>
            </div>

            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                QUICK FILTERS
              </h2>
              <nav className="space-y-2">
                <button 
                  onClick={() => {
                    setSelectedFilter('low_stock');
                    setShowAllMedicines(false);
                  }}
                  className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors duration-200 ${selectedFilter === 'low_stock' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <span>Low Stock</span>
                  <span className="text-sm font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    {lowStockCount}
                  </span>
                </button>
                <button 
                  onClick={() => {
                    setSelectedFilter('expiring');
                    setShowAllMedicines(false);
                  }}
                  className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors duration-200 ${selectedFilter === 'expiring' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <span>Expired/Expiring</span>
                  <span className="text-sm font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    {expiringSoonCount}
                  </span>
                </button>
                <button 
                  onClick={() => {
                    setSelectedFilter('prescription');
                    setShowAllMedicines(false);
                  }}
                  className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors duration-200 ${selectedFilter === 'prescription' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <span>High Stock</span>
                  <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {prescriptionCount}
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-4 lg:p-6">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-blue-200 shadow-sm"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Pill className="text-white" size={20} />
            </div>
            <h1 className="font-bold text-gray-900 text-lg">Medicine Cabinet</h1>
          </div>
          <div className="relative">
            <NavLink to="/dashboard/alerts"
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-sm relative"
            >
              <Bell size={18} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Medicine Cabinet</h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">
                Showing {filteredMedicines.length} items. {medicinesRequiringAttention} require your attention.
              </p>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">
                Today's Date: {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              {/* Add Medicine Button */}
              <button 
                onClick={() => {
                  resetForm();
                  setShowAddMedicineModal(true);
                }}
                className="flex items-center justify-center gap-2 px-3 lg:px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg shadow-blue-200 flex-1 lg:flex-none text-sm lg:text-base"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add Medicine</span>
                <span className="sm:hidden">Add</span>
              </button>
              
              {/* Notification Bell Button - Hidden on mobile (shown in mobile header) */}
              <div className="relative hidden lg:block">
                <NavLink to="/dashboard/alerts"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-sm relative"
                >
                  <Bell size={18} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </NavLink>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search your medicine cabinet (Name, Symptoms, Active ingredients...)"
                    className="text-gray-400 w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors text-sm lg:text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setSelectedFilter('all');
                    setShowAllMedicines(false);
                  }}
                  className={`px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${selectedFilter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'}`}
                >
                  All Medicines
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('table')}
              className={`px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${viewMode === 'table' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'}`}
            >
              <span className="hidden sm:inline">Table View</span>
              <span className="sm:hidden">Table</span>
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 text-sm lg:text-base ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'}`}
            >
              <span className="hidden sm:inline">Grid View</span>
              <span className="sm:hidden">Grid</span>
            </button>
          </div>
          <div className="text-xs lg:text-sm text-gray-600">
            <span className="hidden sm:inline">Showing 1 to {displayedMedicines.length} of {filteredMedicines.length} results</span>
            <span className="sm:hidden">{displayedMedicines.length}/{filteredMedicines.length}</span>
          </div>
        </div>

        {/* Medicine List */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 lg:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">MEDICINE</th>
                    <th className="px-3 lg:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">STATUS</th>
                    <th className="px-3 lg:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">QUANTITY</th>
                    <th className="px-3 lg:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">EXPIRY</th>
                    <th className="px-3 lg:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedMedicines.length > 0 ? (
                    displayedMedicines.map(medicine => {
                      const statusConfig = getStatusConfig(medicine.status);
                      const isExpired = isMedicineExpired(medicine.expiryDate);
                      
                      return (
                        <tr key={medicine.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-3 lg:px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900 text-sm lg:text-base">{medicine.name}</div>
                              <div className="text-xs lg:text-sm text-gray-500">{medicine.strength}</div>
                              {/* Mobile: Show status and quantity inline */}
                              <div className="sm:hidden mt-2 space-y-1">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                  {statusConfig.text}
                                </span>
                                <div className="text-xs text-gray-600">{medicine.remaining}</div>
                                {isExpired && (
                                  <div className="text-xs text-red-600">Expired on {new Date(medicine.expiryDate).toLocaleDateString()}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 lg:px-6 py-4 hidden sm:table-cell">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${statusConfig.color}`}>
                              {statusConfig.text}
                            </span>
                            {isExpired && (
                              <div className="text-xs text-red-600 mt-1">Expired on {new Date(medicine.expiryDate).toLocaleDateString()}</div>
                            )}
                          </td>
                          <td className="px-3 lg:px-6 py-4 hidden md:table-cell">
                            <div className="text-gray-900 text-sm lg:text-base">{medicine.remaining}</div>
                          </td>
                          <td className="px-3 lg:px-6 py-4 hidden lg:table-cell">
                            <div>
                              <div className="text-gray-900 text-sm lg:text-base">
                                {new Date(medicine.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                              <div className={`text-sm ${isExpired ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                {isExpired ? 'Expired' : 'Valid'}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 lg:px-6 py-4">
                            <div className="flex gap-1 lg:gap-2">
                              <button 
                                onClick={() => handleEditMedicine(medicine)}
                                className="p-1.5 lg:p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                                title="Edit"
                              >
                                <Edit size={16} className="lg:w-[18px] lg:h-[18px]" />
                              </button>
                              <button 
                                onClick={() => handleViewMedicine(medicine)}
                                className="p-1.5 lg:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="View Details"
                              >
                                <Eye size={16} className="lg:w-[18px] lg:h-[18px]" />
                              </button>
                              <button 
                                onClick={() => handleDiscard(medicine.id)}
                                className="p-1.5 lg:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                title="Delete"
                              >
                                <Trash2 size={16} className="lg:w-[18px] lg:h-[18px]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <Package className="mx-auto text-gray-300 mb-4" size={48} />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines found</h3>
                          <p className="text-gray-600 text-sm lg:text-base">There are no medicines in this category. Add some medicines to get started.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            {displayedGridMedicines.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {displayedGridMedicines.map(medicine => {
                  const statusConfig = getStatusConfig(medicine.status);
                  const isExpired = isMedicineExpired(medicine.expiryDate);
                  
                  return (
                    <div key={medicine.id} className={`bg-white rounded-xl border ${isExpired ? 'border-red-200' : 'border-gray-200'} p-4 lg:p-5 hover:shadow-lg transition-all duration-300`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-base lg:text-lg truncate">{medicine.name}</h3>
                        <p className="text-gray-600 text-xs lg:text-sm truncate">{medicine.strength}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color} ml-2 flex-shrink-0`}>
                          {statusConfig.text}
                        </span>
                      </div>
                      
                      <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                        <div className="flex items-center gap-2">
                          <Package size={14} className="text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700 text-sm lg:text-base truncate">{medicine.remaining}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className={`${isExpired ? 'text-red-500' : 'text-gray-400'} flex-shrink-0`} />
                          <div className="min-w-0">
                            <span className={`text-gray-700 text-sm lg:text-base ${isExpired ? 'line-through text-red-600' : ''}`}>
                              {new Date(medicine.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        {medicine.schedule && (
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700 text-xs lg:text-sm truncate">
                              {Object.entries(medicine.scheduleEnabled)
                                .filter(([_, enabled]) => enabled)
                                .map(([period]) => period.charAt(0).toUpperCase() + period.slice(1))
                                .join(', ')}
                            </span>
                          </div>
                        )}
                        {isExpired && (
                          <div className="p-2 bg-red-50 border border-red-100 rounded-lg">
                            <div className="flex items-center gap-2">
                              <AlertTriangle size={12} className="text-red-600 flex-shrink-0" />
                              <p className="text-red-700 text-xs lg:text-sm font-medium">Expired Medicine</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditMedicine(medicine)}
                          className="flex-1 py-2 lg:py-2.5 text-center border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors duration-200 text-xs lg:text-sm"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleViewMedicine(medicine)}
                          className="flex-1 py-2 lg:py-2.5 text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-xs lg:text-sm"
                        >
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 lg:py-16">
                <Package className="mx-auto text-gray-300 mb-4 lg:w-16 lg:h-16" size={48} />
                <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-2">No medicines found</h3>
                <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base px-4">There are no medicines in this category. Add some medicines to get started.</p>
                <button 
                  onClick={() => {
                    resetForm();
                    setShowAddMedicineModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
                >
                  <Plus size={18} className="lg:w-5 lg:h-5" />
                  Add Your First Medicine
                </button>
              </div>
            )}
          </div>
        )}

        {/* View All Button */}
        {!showAllMedicines && filteredMedicines.length > 4 && (
          <div className="text-center mb-8">
            <button 
              onClick={handleViewAllMedicines}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-2 mx-auto hover:gap-3 transition-all duration-200"
            >
              View all {filteredMedicines.length} medicines
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Medicine Detail Modal */}
      {showMedicineModal && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMedicine.name}</h2>
                  <p className="text-gray-600">{selectedMedicine.strength}</p>
                </div>
                <button 
                  onClick={() => setShowMedicineModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Active Ingredients</label>
                      <p className="text-gray-900">{selectedMedicine.activeIngredients}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Schedule</label>
                      {selectedMedicine.schedule && (
                        <div className="mt-2 space-y-2">
                          {Object.entries(selectedMedicine.scheduleEnabled).map(([period, enabled]) => {
                            if (enabled && selectedMedicine.schedule[period]) {
                              return (
                                <div key={period} className="flex items-center gap-2 text-sm">
                                  <span className="capitalize">{period}:</span>
                                  <span className="font-medium">{selectedMedicine.schedule[period]}</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Inventory</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Status</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedMedicine.status).color}`}>
                          {getStatusConfig(selectedMedicine.status).text}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Quantity Remaining</label>
                      <p className="text-gray-900 text-lg font-medium">{selectedMedicine.remaining}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Expiry Date</label>
                      <p className="text-gray-900">
                        {new Date(selectedMedicine.expiryDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      {isMedicineExpired(selectedMedicine.expiryDate) && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-lg">
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={14} className="text-red-600" />
                            <p className="text-red-700 text-sm font-medium">This medicine has expired</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedMedicine.requiresAttention && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-yellow-600" size={20} />
                    <p className="text-yellow-800 font-medium">Attention Required</p>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">{selectedMedicine.attentionText}</p>
                </div>
              )}
              
              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setShowMedicineModal(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEditMedicine(selectedMedicine);
                    setShowMedicineModal(false);
                  }}
                  className="px-6 py-2.5 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors"
                >
                  Edit Medicine
                </button>
                {isMedicineExpired(selectedMedicine.expiryDate) && (
                  <button
                    onClick={() => {
                      handleDiscard(selectedMedicine.id);
                      setShowMedicineModal(false);
                    }}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Mark as Discarded
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Medicine Modal */}
      <EditMedicineModal
        medicine={isEditing ? medicines.find(m => m.id === editingMedicineId) : null}
        isOpen={showAddMedicineModal}
        onClose={resetForm}
        onSave={handleSaveMedicine}
        isEditing={isEditing}
      />
    </div>
  );
};

export default MedicineCabinet;
