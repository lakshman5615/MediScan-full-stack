import React, { useState, useEffect } from 'react';
import { 
  X, 
  Pill, 
  Calendar, 
  Clock, 
  Sun, 
  Moon, 
  AlertCircle as AlertCircleIcon,
  CheckCircle,
  Save,
  Plus,
  Package
} from 'lucide-react';
import { getTodayDate, calculateExpiryText, isMedicineExpired } from './medicinesData';

const EditMedicineModal = ({ 
  medicine = null, 
  isOpen, 
  onClose, 
  onSave,
  isEditing = false 
}) => {
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    brand: '',
    type: 'OTC',
    expiryDate: '',
    totalQuantity: '',
    dosage: '',
    lotNumber: '',
    dailyDoses: '1',
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

  // Initialize form when medicine changes
  useEffect(() => {
    if (medicine && isEditing) {
      setNewMedicine({
        name: medicine.name,
        brand: medicine.brand || '',
        type: medicine.type === 'Prescription' ? 'OTC' : (medicine.type || 'OTC'),
        expiryDate: medicine.expiryDate,
        totalQuantity: (medicine.totalQuantity ?? medicine.quantity ?? 0).toString(),
        dosage: medicine.strength,
        lotNumber: medicine.lotNumber || '',
        dailyDoses: medicine.dailyDoses?.toString() || '1',
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
    } else {
      // Reset form for new medicine
      setNewMedicine({
        name: '',
        brand: '',
        type: 'OTC',
        expiryDate: '',
        totalQuantity: '',
        dosage: '',
        lotNumber: '',
        dailyDoses: '1',
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
    }
  }, [medicine, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedicine(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleTimeChange = (period, time) => {
    setNewMedicine(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [period]: time
      }
    }));
  };

  const handleScheduleToggle = (period) => {
    setNewMedicine(prev => ({
      ...prev,
      scheduleEnabled: {
        ...prev.scheduleEnabled,
        [period]: !prev.scheduleEnabled[period]
      }
    }));
  };

  const handleSubmit = () => {
    if (!newMedicine.name || !newMedicine.expiryDate || !newMedicine.totalQuantity) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(newMedicine);
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
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
                onClick={onClose}
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

                {/* Medicine Type */}
                {/* <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2">
                    Medicine Type
                  </label>
                  <select
                    name="type"
                    value={newMedicine.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200 text-gray-900"
                  >
                    <option value="Prescription">Prescription</option>
                    <option value="OTC">Over-the-Counter (OTC)</option>
                    <option value="Supplement">Supplement</option>
                    <option value="Other">Other</option>
                  </select>
                </div> */}
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
                  <label className=" text-sm font-semibold text-gray-900 mb-2">
                    Dosage <span className="text-gray-500 text-sm font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="dosage"
                    value={newMedicine.dosage}
                    onChange={handleInputChange}
                    placeholder="e.g., 500mg or 1 tablet"
                    className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200 text-gray-900 placeholder-gray-400"
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
                    placeholder="Enter quantity"
                    min="1"
                    className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200 text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>

                {/* Lot Number */}
                {/* <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2">
                    Lot Number <span className="text-gray-500 text-sm font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="lotNumber"
                    value={newMedicine.lotNumber}
                    onChange={handleInputChange}
                    placeholder="Enter lot number"
                    className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  />
                </div> */}

                {/* Daily Doses */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2">
                    Daily Doses <span className="text-gray-500 text-sm font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    name="dailyDoses"
                    value={newMedicine.dailyDoses}
                    onChange={handleInputChange}
                    placeholder="e.g., 2"
                    min="1"
                    className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200 text-gray-900 placeholder-gray-400"
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
                  <AlertCircleIcon size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
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
                  onClick={onClose}
                  className="px-6 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
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
  );
};

export default EditMedicineModal;
