import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Bell,
  Calendar,
  Pill,
  Search,
  Filter,
  Upload
} from 'lucide-react';

const MedicineCabinet = () => {
  const [medicines, setMedicines] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'expiring', 'expired'
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    expiryDate: '',
    totalQuantity: '',
    dosage: '',
    schedule: {
      morning: { enabled: false, time: '08:00' },
      afternoon: { enabled: false, time: '13:00' },
      evening: { enabled: false, time: '19:00' },
      night: { enabled: false, time: '22:00' }
    }
  });

  // Sample data for demonstration
  useEffect(() => {
    const sampleMedicines = [
      {
        id: 1,
        name: 'Amoxicillin 500mg',
        brand: 'GSK Pharma',
        expiryDate: '2026-12-15',
        quantity: 30,
        dosage: '1 tablet',
        schedule: ['08:00 AM', '07:00 PM'],
        status: 'active',
        type: 'prescription'
      },
      {
        id: 2,
        name: 'Vitamin D3',
        brand: 'Nature Made',
        expiryDate: '2025-08-20',
        quantity: 60,
        dosage: '1 capsule',
        schedule: ['08:00 AM'],
        status: 'active',
        type: 'supplement'
      },
      {
        id: 3,
        name: 'Cough Syrup',
        brand: 'Dabur',
        expiryDate: '2024-05-10',
        quantity: 120,
        dosage: '10ml',
        schedule: ['10:00 AM', '06:00 PM', '10:00 PM'],
        status: 'expiring',
        type: 'otc'
      },
      {
        id: 4,
        name: 'Paracetamol',
        brand: 'Cipla',
        expiryDate: '2024-02-28',
        quantity: 15,
        dosage: '1 tablet',
        schedule: ['As needed'],
        status: 'expired',
        type: 'otc'
      }
    ];
    setMedicines(sampleMedicines);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleToggle = (timeSlot) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [timeSlot]: {
          ...prev.schedule[timeSlot],
          enabled: !prev.schedule[timeSlot].enabled
        }
      }
    }));
  };

  const handleTimeChange = (timeSlot, time) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [timeSlot]: {
          ...prev.schedule[timeSlot],
          time: time
        }
      }
    }));
  };

  const getMedicineStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expired';
    if (diffDays <= 30) return 'expiring';
    return 'active';
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      expiryDate: '',
      totalQuantity: '',
      dosage: '',
      schedule: {
        morning: { enabled: false, time: '08:00' },
        afternoon: { enabled: false, time: '13:00' },
        evening: { enabled: false, time: '19:00' },
        night: { enabled: false, time: '22:00' }
      }
    });
    setEditingId(null);
  };

  const handleSaveMedicine = () => {
    const newMedicine = {
      id: editingId || medicines.length + 1,
      name: formData.name,
      brand: formData.brand,
      expiryDate: formData.expiryDate,
      quantity: parseInt(formData.totalQuantity),
      dosage: formData.dosage,
      schedule: Object.entries(formData.schedule)
        .filter(([_, slot]) => slot.enabled)
        .map(([slot, data]) => {
          const hour = parseInt(data.time.split(':')[0]);
          const minute = data.time.split(':')[1];
          const period = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          return `${displayHour}:${minute} ${period}`;
        }),
      status: getMedicineStatus(formData.expiryDate),
      type: editingId ? 'edited' : 'manual'
    };

    if (editingId) {
      // Update existing medicine
      setMedicines(prev => prev.map(med => 
        med.id === editingId ? newMedicine : med
      ));
    } else {
      // Add new medicine
      setMedicines(prev => [...prev, newMedicine]);
    }
    
    setShowAddForm(false);
    resetForm();
  };

  const handleEditMedicine = (medicine) => {
    // Convert schedule back to the form format
    const schedule = {
      morning: { enabled: false, time: '08:00' },
      afternoon: { enabled: false, time: '13:00' },
      evening: { enabled: false, time: '19:00' },
      night: { enabled: false, time: '22:00' }
    };

    // Parse existing schedule times
    medicine.schedule.forEach(timeStr => {
      const timeMatch = timeStr.match(/(\d+):(\d+)\s+(AM|PM)/i);
      if (timeMatch) {
        let hour = parseInt(timeMatch[1]);
        const minute = timeMatch[2];
        const period = timeMatch[3].toUpperCase();
        
        // Convert to 24-hour format
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        const time24 = `${hour.toString().padStart(2, '0')}:${minute}`;
        
        // Determine which time slot this belongs to
        if (hour >= 5 && hour < 12) {
          schedule.morning = { enabled: true, time: time24 };
        } else if (hour >= 12 && hour < 17) {
          schedule.afternoon = { enabled: true, time: time24 };
        } else if (hour >= 17 && hour < 22) {
          schedule.evening = { enabled: true, time: time24 };
        } else {
          schedule.night = { enabled: true, time: time24 };
        }
      }
    });

    setFormData({
      name: medicine.name,
      brand: medicine.brand,
      expiryDate: medicine.expiryDate,
      totalQuantity: medicine.quantity.toString(),
      dosage: medicine.dosage,
      schedule: schedule
    });

    setEditingId(medicine.id);
    setShowAddForm(true);
  };

  const deleteMedicine = (id) => {
    setMedicines(prev => prev.filter(med => med.id !== id));
  };

  const filteredMedicines = medicines.filter(medicine => {
    // Apply search filter
    const matchesSearch = searchQuery === '' || 
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesStatus = filter === 'all' || medicine.status === filter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Active';
      case 'expiring': return 'Expiring Soon';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medicine Cabinet</h1>
            <p className="text-gray-600 mt-2">Manage your stored medicines and schedules</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={20} />
              Add Medicine
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Pill className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Medicines</p>
                <p className="text-2xl font-bold text-gray-900">{medicines.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {medicines.filter(m => m.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {medicines.filter(m => m.status === 'expiring').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Bell className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Scheduled Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {medicines.reduce((acc, med) => acc + med.schedule.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search medicines by name or brand..."
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All ({medicines.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Active ({medicines.filter(m => m.status === 'active').length})
              </button>
              <button
                onClick={() => setFilter('expiring')}
                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'expiring' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Expiring Soon ({medicines.filter(m => m.status === 'expiring').length})
              </button>
              <button
                onClick={() => setFilter('expired')}
                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'expired' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Expired ({medicines.filter(m => m.status === 'expired').length})
              </button>
            </div>
          </div>
        </div>

        {/* Medicine List */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {filteredMedicines.length === 0 ? (
            <div className="p-12 text-center">
              <Pill size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No medicines found</h3>
              <p className="text-gray-500 mb-6">Add your first medicine to get started</p>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddForm(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Add Medicine
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {filteredMedicines.map(medicine => (
                <div key={medicine.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <Pill className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{medicine.name}</h3>
                            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(medicine.status)}`}>
                              {getStatusText(medicine.status)}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-1">Brand: {medicine.brand}</p>
                          <div className="flex flex-wrap gap-4 mt-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar size={16} />
                              <span>Expires: {new Date(medicine.expiryDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Pill size={16} />
                              <span>Quantity: {medicine.quantity} units</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock size={16} />
                              <span>Dosage: {medicine.dosage}</span>
                            </div>
                          </div>
                          {medicine.schedule.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-600 mb-1">Schedule:</p>
                              <div className="flex flex-wrap gap-2">
                                {medicine.schedule.map((time, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    {time}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditMedicine(medicine)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => deleteMedicine(medicine.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>AI-powered medicine management system. Always verify with healthcare professionals.</p>
        </div>
      </div>

      {/* Add/Edit Medicine Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Medicine' : 'Add New Medicine'}
              </h2>
              <p className="text-gray-600 mt-1">
                {editingId ? 'Update medicine details' : 'Enter medicine details manually'}
              </p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Amoxicillin"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., GSK Pharma"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Quantity *
                  </label>
                  <input
                    type="number"
                    name="totalQuantity"
                    value={formData.totalQuantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 30"
                    required
                    min="1"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage
                </label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 500mg or 1 tablet"
                />
              </div>
              
              {/* Schedule Settings */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['morning', 'afternoon', 'evening', 'night'].map((slot) => (
                    <div key={slot} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={slot}
                          checked={formData.schedule[slot].enabled}
                          onChange={() => handleScheduleToggle(slot)}
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={slot} className="text-sm font-medium text-gray-700 capitalize">
                          {slot}
                        </label>
                      </div>
                      {formData.schedule[slot].enabled && (
                        <input
                          type="time"
                          value={formData.schedule[slot].time}
                          onChange={(e) => handleTimeChange(slot, e.target.value)}
                          className="px-3 py-1.5 border rounded text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMedicine}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={!formData.name || !formData.expiryDate || !formData.totalQuantity}
                >
                  {editingId ? 'Update Medicine' : 'Save to Cabinet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineCabinet;