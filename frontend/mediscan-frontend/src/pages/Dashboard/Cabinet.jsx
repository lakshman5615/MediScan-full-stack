import React, { useState, useEffect } from 'react';
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
  AlertCircle as AlertCircleIcon
} from 'lucide-react';

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
  const [notificationCount, setNotificationCount] = useState(3);
  
  // Add/edit medicine form state
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    brand: '',
    expiryDate: '',
    totalQuantity: '',
    dosage: '',
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
    }
  });

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Helper function to check if a medicine is expired
  const isMedicineExpired = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  // Helper function to calculate expiry text
  const calculateExpiryText = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'EXPIRED';
    if (diffDays < 30) return `${diffDays} DAYS LEFT`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} MONTHS LEFT`;
    return `${Math.floor(diffDays / 365)} YEARS LEFT`;
  };

  // Helper function to determine medicine status
  const getMedicineStatus = (medicine) => {
    if (isMedicineExpired(medicine.expiryDate)) {
      return 'expired';
    }
    if (medicine.quantity < 5) {
      return 'low_stock';
    }
    if (medicine.quantity <= 10) {
      return 'expiring';
    }
    return 'stocked';
  };

  // Initialize dummy medicines with proper status based on today's date
  const initializeMedicines = () => {
    const today = new Date();
    return [
      {
        id: 1,
        name: 'Amoxicillin',
        type: 'Prescription',
        strength: '500mg',
        status: 'stocked',
        quantity: 12,
        unit: 'pills',
        remaining: '12 pills remaining',
        expiryDate: '2024-12-14',
        activeIngredients: 'Amoxicillin Trihydrate',
        requiresAttention: false
      },
      {
        id: 2,
        name: 'Advil Liquid Gels',
        type: 'OTC',
        strength: '200mg',
        status: 'low_stock',
        quantity: 2,
        unit: 'capsules',
        remaining: '2 capsules remaining',
        expiryDate: '2025-05-05',
        activeIngredients: 'Ibuprofen',
        requiresAttention: true,
        attentionText: 'Reorder recommended'
      },
      {
        id: 3,
        name: 'Cough Syrup',
        type: 'OTC',
        strength: '',
        status: 'expired',
        quantity: 100,
        unit: 'ml',
        remaining: '100 ml remaining',
        expiryDate: '2024-01-01',
        activeIngredients: 'Dextromethorphan',
        requiresAttention: true,
        attentionText: 'Expired - Discard'
      },
      {
        id: 4,
        name: 'Vitamin D3',
        type: 'Supplement',
        strength: '1000IU',
        status: 'stocked',
        quantity: 60,
        unit: 'capsules',
        remaining: '60 caps remaining',
        expiryDate: '2026-09-15',
        activeIngredients: 'Cholecalciferol',
        requiresAttention: false
      },
      {
        id: 5,
        name: 'Metformin',
        type: 'Prescription',
        strength: '850mg',
        status: 'stocked',
        quantity: 90,
        unit: 'tablets',
        remaining: '90 tablets remaining',
        expiryDate: '2025-08-20',
        activeIngredients: 'Metformin Hydrochloride',
        requiresAttention: false
      },
      {
        id: 6,
        name: 'Aspirin',
        type: 'OTC',
        strength: '81mg',
        status: 'low_stock',
        quantity: 5,
        unit: 'tablets',
        remaining: '5 tablets remaining',
        expiryDate: '2025-03-15',
        activeIngredients: 'Acetylsalicylic Acid',
        requiresAttention: true,
        attentionText: 'Low stock - Consider refill'
      },
      // Add an expired medicine for testing
      {
        id: 7,
        name: 'Expired Painkiller',
        type: 'OTC',
        strength: '500mg',
        status: 'expired',
        quantity: 10,
        unit: 'tablets',
        remaining: '10 tablets remaining',
        expiryDate: getTodayDate(),
        activeIngredients: 'Paracetamol',
        requiresAttention: true,
        attentionText: 'Expired - Discard'
      }
    ].map(medicine => ({
      ...medicine,
      expiryText: calculateExpiryText(medicine.expiryDate),
      status: getMedicineStatus(medicine)
    }));
  };

  useEffect(() => {
    const initializedMedicines = initializeMedicines();
    setMedicines(initializedMedicines);
  }, []);

  const getStatusConfig = (status) => {
    switch(status) {
      case 'stocked':
        return {
          color: 'bg-green-100 text-green-800',
          text: 'STOCKED',
          icon: <CheckCircle size={14} />
        };
      case 'low_stock':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          text: 'LOW STOCK',
          icon: <AlertTriangle size={14} />
        };
      case 'expired':
        return {
          color: 'bg-red-100 text-red-800',
          text: 'EXPIRED',
          icon: <XCircle size={14} />
        };
      case 'expiring':
        return {
          color: 'bg-orange-100 text-orange-800',
          text: 'EXPIRING SOON',
          icon: <AlertTriangle size={14} />
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'UNKNOWN',
          icon: <AlertCircle size={14} />
        };
    }
  };

  // Handle input change for new medicine form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedicine(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle schedule time change
  const handleScheduleTimeChange = (period, time) => {
    setNewMedicine(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [period]: time
      }
    }));
  };

  // Handle schedule toggle
  const handleScheduleToggle = (period) => {
    setNewMedicine(prev => ({
      ...prev,
      scheduleEnabled: {
        ...prev.scheduleEnabled,
        [period]: !prev.scheduleEnabled[period]
      }
    }));
  };

  // Handle adding new medicine
  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.expiryDate || !newMedicine.totalQuantity || !newMedicine.dosage) {
      alert('Please fill in all required fields');
      return;
    }

    // Format expiry date to YYYY-MM-DD
    const expiryDate = newMedicine.expiryDate;
    const expiryText = calculateExpiryText(expiryDate);
    const status = getMedicineStatus({ 
      expiryDate, 
      quantity: parseInt(newMedicine.totalQuantity) 
    });

    if (isEditing) {
      // Update existing medicine
      setMedicines(prev => prev.map(medicine => 
        medicine.id === editingMedicineId ? {
          ...medicine,
          name: newMedicine.name,
          strength: newMedicine.dosage,
          quantity: parseInt(newMedicine.totalQuantity),
          unit: newMedicine.dosage.includes('mg') ? 'tablets' : 'units',
          remaining: `${newMedicine.totalQuantity} remaining`,
          expiryDate: expiryDate,
          expiryText: expiryText,
          status: status,
          brand: newMedicine.brand,
          schedule: newMedicine.schedule,
          scheduleEnabled: newMedicine.scheduleEnabled,
          requiresAttention: status === 'expired' || status === 'low_stock',
          attentionText: status === 'expired' ? 'Expired - Discard' : 
                       status === 'low_stock' ? 'Low stock - Consider refill' : ''
        } : medicine
      ));
      
      alert(`${newMedicine.name} updated successfully!`);
    } else {
      // Generate a new medicine object
      const newMedicineObj = {
        id: medicines.length + 1,
        name: newMedicine.name,
        type: 'Prescription',
        strength: newMedicine.dosage,
        status: status,
        quantity: parseInt(newMedicine.totalQuantity),
        unit: newMedicine.dosage.includes('mg') ? 'tablets' : 'units',
        remaining: `${newMedicine.totalQuantity} remaining`,
        expiryDate: expiryDate,
        expiryText: expiryText,
        activeIngredients: 'To be determined',
        requiresAttention: status === 'expired' || status === 'low_stock',
        attentionText: status === 'expired' ? 'Expired - Discard' : 
                     status === 'low_stock' ? 'Low stock - Consider refill' : '',
        brand: newMedicine.brand,
        schedule: newMedicine.schedule,
        scheduleEnabled: newMedicine.scheduleEnabled
      };
      
      // Add to medicines list
      setMedicines(prev => [...prev, newMedicineObj]);
      
      alert(`${newMedicine.name} added successfully!`);
    }
    
    // Reset form and close modal
    resetForm();
  };

  // Handle edit medicine
  const handleEditMedicine = (medicine) => {
    setIsEditing(true);
    setEditingMedicineId(medicine.id);
    setNewMedicine({
      name: medicine.name,
      brand: medicine.brand || '',
      expiryDate: medicine.expiryDate,
      totalQuantity: medicine.quantity.toString(),
      dosage: medicine.strength,
      schedule: medicine.schedule || {
        morning: '08:00',
        afternoon: '13:00',
        evening: '20:00',
        night: '22:00'
      },
      scheduleEnabled: medicine.scheduleEnabled || {
        morning: true,
        afternoon: true,
        evening: true,
        night: false
      }
    });
    setShowAddMedicineModal(true);
  };

  // Reset form
  const resetForm = () => {
    setNewMedicine({
      name: '',
      brand: '',
      expiryDate: '',
      totalQuantity: '',
      dosage: '',
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
      }
    });
    setIsEditing(false);
    setEditingMedicineId(null);
    setShowAddMedicineModal(false);
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = searchQuery === '' || 
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.activeIngredients.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'low_stock') return matchesSearch && medicine.status === 'low_stock';
    if (selectedFilter === 'expiring') return matchesSearch && (medicine.status === 'expiring' || medicine.status === 'expired');
    if (selectedFilter === 'prescription') return matchesSearch && medicine.type === 'Prescription';
    
    return matchesSearch;
  });

  const medicinesRequiringAttention = medicines.filter(m => m.requiresAttention).length;
  const lowStockCount = medicines.filter(m => m.status === 'low_stock').length;
  const expiringSoonCount = medicines.filter(m => m.status === 'expiring' || m.status === 'expired').length;
  const prescriptionCount = medicines.filter(m => m.type === 'Prescription').length;

  const handleViewMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setShowMedicineModal(true);
  };

  const handleReorder = (medicineId) => {
    alert(`Reorder initiated for medicine ID: ${medicineId}`);
  };

  const handleDiscard = (medicineId) => {
    if (window.confirm('Are you sure you want to discard this medicine?')) {
      setMedicines(prev => prev.filter(m => m.id !== medicineId));
      alert('Medicine discarded successfully');
    }
  };

  // Render the schedule time input component with improved UI
  const renderScheduleTimeInput = (period, label, icon) => (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-400 transition-all duration-200 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl transition-all duration-200 ${newMedicine.scheduleEnabled[period] ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
          {icon}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{label}</p>
          {newMedicine.scheduleEnabled[period] ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="time"
                value={newMedicine.schedule[period]}
                onChange={(e) => handleScheduleTimeChange(period, e.target.value)}
                className="text-sm text-gray-700 bg-transparent border-none p-0 focus:ring-0 focus:outline-none cursor-pointer hover:text-blue-600 transition-colors font-medium"
              />
              <Clock size={14} className="text-gray-400" />
            </div>
          ) : (
            <p className="text-sm text-gray-400 mt-1">Not scheduled</p>
          )}
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={newMedicine.scheduleEnabled[period]}
          onChange={() => handleScheduleToggle(period)}
        />
        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 hover:bg-gray-300 peer-checked:hover:bg-blue-700 transition-all duration-300 shadow-inner"></div>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-screen overflow-y-auto hidden md:block">
        <div className="p-6">
          
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
          
            {/* Simple Back Button with Text */}

       <div>
    <button 
      onClick={() => window.history.back()}
      className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mb-4"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
          clipRule="evenodd" 
        />
      </svg>
      <span>Back</span>
    </button>
    </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                INVENTORY VIEW
              </h2>
              <nav className="space-y-2">
                <button className="flex items-center gap-3 w-full p-2 rounded-lg bg-blue-50 text-blue-700">
                  <Package size={18} />
                  <button onClick={() => setSelectedFilter('all')}
                   className="font-medium">All Medicines</button>
                  <ChevronRight className="ml-auto" size={16} />
                </button>
                <button className="flex items-center gap-3 w-full p-2 rounded-lg text-gray-700 hover:bg-gray-100">
                  <History size={18} />
                  <span>Dose History</span>
                </button>
              </nav>
            </div>

            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                QUICK FILTERS
              </h2>
              <nav className="space-y-2">
                <button 
                  onClick={() => setSelectedFilter('low_stock')}
                  className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors duration-200 ${selectedFilter === 'low_stock' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <span>Low Stock</span>
                  <span className="text-sm font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    {lowStockCount}
                  </span>
                </button>
                <button 
                  onClick={() => setSelectedFilter('expiring')}
                  className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors duration-200 ${selectedFilter === 'expiring' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <span>Expired/Expiring</span>
                  <span className="text-sm font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    {expiringSoonCount}
                  </span>
                </button>
                <button 
                  onClick={() => setSelectedFilter('prescription')}
                  className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors duration-200 ${selectedFilter === 'prescription' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <span>High Stocked</span>
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
      <div className="flex-1 md:ml-64 p-4 md:p-6">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Pill className="text-white" size={20} />
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronDown size={20} />
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              
              <h1 className="text-2xl font-bold text-gray-900">Medicine Cabinet</h1>
              <p className="text-gray-600 mt-1">
                Showing {filteredMedicines.length} items. {medicinesRequiringAttention} require your attention.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Today's Date: {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="flex gap-3">
            
              
              
              {/* Add Medicine Button */}
              <button 
                onClick={() => {
                  resetForm();
                  setShowAddMedicineModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg shadow-blue-200"
              >
                <Plus size={18} />
                Add Medicine
              </button>
                {/* Notification Bell Button */}
              <div className="relative">
                <button 
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-sm relative"
                >
                  <Bell size={18} />
                  {/* <span className="hidden md:inline">Notifications</span> */}
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
                
              </div>
              
   
              
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search your medicine cabinet (Name, Symptoms, Active ingredients...)"
                    className="text-gray-400 w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${selectedFilter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'}`}
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
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${viewMode === 'table' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'}`}
            >
              Table View
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'}`}
            >
              Grid View
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Showing 1 to {Math.min(4, filteredMedicines.length)} of {filteredMedicines.length} results
          </div>
        </div>

        {/* Medicine List */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">MEDICINE</th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">STATUS</th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">QUANTITY</th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">EXPIRY</th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMedicines.slice(0, 4).map(medicine => {
                    const statusConfig = getStatusConfig(medicine.status);
                    const isExpired = isMedicineExpired(medicine.expiryDate);
                    
                    return (
                      <tr key={medicine.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 md:px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{medicine.name}</div>
                            <div className="text-sm text-gray-500">{medicine.type} • {medicine.strength}</div>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${statusConfig.color}`}>
                            {statusConfig.icon}
                            {statusConfig.text}
                          </span>
                          {isExpired && (
                            <div className="text-xs text-red-600 mt-1">Expired on {new Date(medicine.expiryDate).toLocaleDateString()}</div>
                          )}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="text-gray-900">{medicine.remaining}</div>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div>
                            <div className="text-gray-900">{new Date(medicine.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                            <div className={`text-sm ${isExpired ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                              {medicine.expiryText}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditMedicine(medicine)}
                              className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleViewMedicine(medicine)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => handleDiscard(medicine.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                            {medicine.status === 'low_stock' && (
                              <button 
                                onClick={() => handleReorder(medicine.id)}
                                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200"
                              >
                                Reorder
                              </button>
                            )}
                            {/* {isExpired && (
                              <button 
                                onClick={() => handleDiscard(medicine.id)}
                                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors duration-200"
                              >
                                Discard
                              </button>
                            )} */}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredMedicines.slice(0, 6).map(medicine => {
              const statusConfig = getStatusConfig(medicine.status);
              const isExpired = isMedicineExpired(medicine.expiryDate);
              
              return (
                <div key={medicine.id} className={`bg-white rounded-xl border ${isExpired ? 'border-red-200' : 'border-gray-200'} p-5 hover:shadow-lg transition-all duration-300`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{medicine.name}</h3>
                      <p className="text-gray-600 text-sm">{medicine.type} • {medicine.strength}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                      {statusConfig.icon}
                      {statusConfig.text}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-gray-400" />
                      <span className="text-gray-700">{medicine.remaining}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className={`${isExpired ? 'text-red-500' : 'text-gray-400'}`} />
                      <div>
                        <span className={`text-gray-700 ${isExpired ? 'line-through text-red-600' : ''}`}>
                          {new Date(medicine.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <div className={`text-sm ${isExpired ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                          {medicine.expiryText}
                        </div>
                      </div>
                    </div>
                    {isExpired && (
                      <div className="p-2 bg-red-50 border border-red-100 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={14} className="text-red-600" />
                          <p className="text-red-700 text-sm font-medium">Expired Medicine</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditMedicine(medicine)}
                      className="flex-1 py-2.5 text-center border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleViewMedicine(medicine)}
                      className="flex-1 py-2.5 text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      View Details
                    </button>
                    {medicine.status === 'low_stock' && (
                      <button 
                        onClick={() => handleReorder(medicine.id)}
                        className="flex-1 py-2.5 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        {filteredMedicines.length > 4 && (
          <div className="text-center mb-8">
            <button 
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-2 mx-auto hover:gap-3 transition-all duration-200">
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
                  <p className="text-gray-600">{selectedMedicine.type} • {selectedMedicine.strength}</p>
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
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Inventory</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Status</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedMedicine.status).color}`}>
                          {getStatusConfig(selectedMedicine.status).icon}
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
                      <p className={`text-sm ${isMedicineExpired(selectedMedicine.expiryDate) ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                        {selectedMedicine.expiryText}
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
                {selectedMedicine.status === 'low_stock' && (
                  <button
                    onClick={() => {
                      handleReorder(selectedMedicine.id);
                      setShowMedicineModal(false);
                    }}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reorder Now
                  </button>
                )}
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

      {/* Add/Edit Medicine Modal - UPDATED PROFESSIONAL UI */}
      {showAddMedicineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={resetForm}> 
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Pill className="text-white" size={22} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Medicine' : 'Add New Medicine'}</h2>
                        <p className="text-gray-600 text-sm">Enter medicine details manually</p>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-8">
                {/* Medicine Information Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-white rounded-lg border border-blue-200 flex items-center justify-center">
                      <Pill className="text-blue-600" size={18} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Medicine Information</h3>
                  </div>
                  
                  <div className="space-y-5">
                    {/* Medicine Name */}
                    <div>
                      <label className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        Medicine Name
                        <span className="text-red-500 text-lg">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newMedicine.name}
                        onChange={handleInputChange}
                        placeholder="Enter medicine name"
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200 text-gray-900 placeholder-gray-400"
                        required
                      />
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Brand Name <span className="text-gray-500 text-sm font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={newMedicine.brand}
                        onChange={handleInputChange}
                        placeholder="Enter brand name"
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Dosage & Expiry Section */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-white rounded-lg border border-green-200 flex items-center justify-center">
                      <Package className="text-green-600" size={18} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Dosage & Expiry Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Dosage */}
                    <div>
                      <label className=" text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        Dosage
                        {/* <span className="text-red-500 text-lg">*</span> */}
                      </label>
                      <input
                        type="text"
                        name="dosage"
                        value={newMedicine.dosage}
                        onChange={handleInputChange}
                        placeholder="e.g., 500mg or 1 tablet"
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200 text-gray-900 placeholder-gray-400"
                        // required
                      />
                    </div>

                    {/* Total Quantity */}
                    <div>
                      <label className=" text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        Total Quantity
                        <span className="text-red-500 text-lg">*</span>
                      </label>
                      <input
                        type="number"
                        name="totalQuantity"
                        value={newMedicine.totalQuantity}
                        onChange={handleInputChange}
                        placeholder="e.g., 30"
                        min="1"
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200 text-gray-900 placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Expiry Date */}
                  <div className="mt-5">
                    <label className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      Expiry Date
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="expiryDate"
                        value={newMedicine.expiryDate}
                        onChange={handleInputChange}
                        min={getTodayDate()}
                        className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200 text-gray-900 placeholder-gray-400 pr-12"
                        required
                      />
                      <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                    {newMedicine.expiryDate && (
                      <div className={`mt-2 p-3 rounded-lg ${isMedicineExpired(newMedicine.expiryDate) ? 'bg-red-50 border border-red-100' : 'bg-blue-50 border border-blue-100'}`}>
                        <div className="flex items-start gap-2">
                          {isMedicineExpired(newMedicine.expiryDate) ? (
                            <AlertCircleIcon size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                          )}
                          <p className={`text-sm ${isMedicineExpired(newMedicine.expiryDate) ? 'text-red-700' : 'text-blue-700'}`}>
                            {isMedicineExpired(newMedicine.expiryDate) 
                              ? 'Warning: This date is in the past. Medicine will be marked as expired.'
                              : `Expires in ${calculateExpiryText(newMedicine.expiryDate)}`
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Schedule Settings Section */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg border border-purple-200 flex items-center justify-center">
                        <Clock className="text-purple-600" size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">Schedule Settings</h3>
                        <p className="text-gray-600 text-sm">Set reminder times for each dose</p>
                      </div>
                    </div>
                  
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderScheduleTimeInput('morning', 'Morning Dose', <Sun size={18} />)}
                    {renderScheduleTimeInput('afternoon', 'Afternoon Dose', <Sun size={18} />)}
                    {renderScheduleTimeInput('evening', 'Evening Dose', <Moon size={18} />)}
                    {renderScheduleTimeInput('night', 'Night Dose', <Moon size={18} />)}
                  </div>
                  
                  <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-start gap-3">
                      <Info size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Tip:</span> Enable and set times for each dose. Disabled doses won't trigger reminders.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          All times are in 24-hour format. Reminders will be sent 15 minutes before each scheduled dose.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {isEditing ? 'Update existing medicine details' : 'Add new medicine to your cabinet'}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={resetForm}
                      className="px-6 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddMedicine}
                      className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg flex items-center gap-2 font-semibold shadow-md"
                    >
                      {isEditing ? (
                        <>
                          <Save size={18} />
                          Update Medicine
                        </>
                      ) : (
                        <>
                          <Plus size={18} />
                          Add Medicine
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineCabinet;