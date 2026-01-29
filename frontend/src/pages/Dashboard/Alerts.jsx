import React, { useState } from 'react';

const AlertScreen = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [medications, setMedications] = useState({
    upcoming: [
      { 
        id: 1, 
        name: "Metformin", 
        dosage: "500mg", 
        time: "08:00 AM", 
        schedule: "Morning dose", 
        confirmed: false,
        type: "tablet",
        instructions: "Take with food",
        remaining: 30
      },
      { 
        id: 2, 
        name: "Atorvastatin", 
        dosage: "20mg", 
        time: "09:00 PM", 
        schedule: "Night dose", 
        confirmed: false,
        type: "tablet",
        instructions: "Take at bedtime",
        remaining: 15
      },
      { 
        id: 3, 
        name: "Levothyroxine", 
        dosage: "50mcg", 
        time: "07:00 AM", 
        schedule: "Morning dose", 
        confirmed: false,
        type: "tablet",
        instructions: "Take on empty stomach",
        remaining: 45
      }
    ],
    completed: [
      { 
        id: 4, 
        name: "Lisinopril", 
        dosage: "10mg", 
        takenTime: "07:15 AM", 
        date: "Today",
        actualTime: "07:15:23",
        adherence: "On time"
      },
      { 
        id: 5, 
        name: "Aspirin", 
        dosage: "81mg", 
        takenTime: "08:30 AM", 
        date: "Today",
        actualTime: "08:30:45",
        adherence: "15 mins late"
      },
      { 
        id: 6, 
        name: "Vitamin D3", 
        dosage: "2000 IU", 
        takenTime: "09:00 AM", 
        date: "Yesterday",
        actualTime: "09:00:12",
        adherence: "On time"
      }
    ]
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "critical",
      title: "Critical Expiry",
      message: "Your Paracetamol pack (Lot #4421) will expire in 2 days. Please dispose of safely and replace immediately.",
      action: "Find Replacement",
      timestamp: "2 hours ago",
      priority: "high"
    },
    {
      id: 2,
      type: "warning",
      title: "Low Inventory Alert",
      message: "Vitamin D3: Only 4 tablets remaining. This will last for 4 more days based on your schedule.",
      action: "Order Refill Now",
      timestamp: "1 day ago",
      priority: "medium"
    },
    {
      id: 3,
      type: "info",
      title: "Database Synchronized",
      message: "Last update: 2 minutes ago. All your medication data is backed up to cloud.",
      action: null,
      timestamp: "Just now",
      priority: "low"
    },
    {
      id: 4,
      type: "warning",
      title: "Missed Dose Alert",
      message: "You missed your 2:00 PM dose of Metformin yesterday. Please consult your doctor.",
      action: "Report Issue",
      timestamp: "5 hours ago",
      priority: "high"
    }
  ]);

  const [reminderTime, setReminderTime] = useState("15");
  const [showNotification, setShowNotification] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showMedicationDetails, setShowMedicationDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleConfirmIntake = (id) => {
    setMedications(prev => {
      const confirmedMed = prev.upcoming.find(med => med.id === id);
      const updatedUpcoming = prev.upcoming.filter(med => med.id !== id);
      const currentTime = new Date();
      
      return {
        ...prev,
        upcoming: updatedUpcoming,
        completed: [
          {
            ...confirmedMed,
            takenTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: 'Today',
            actualTime: currentTime.toISOString(),
            adherence: "Confirmed"
          },
          ...prev.completed
        ]
      };
    });
    
    // Show confirmation notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleDismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleSnoozeAlert = (id) => {
    const alertToSnooze = alerts.find(alert => alert.id === id);
    if (alertToSnooze) {
      // Update timestamp for snooze
      setAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, timestamp: "Snoozed for 1 hour" } : alert
      ));
    }
  };

  const handleViewDetails = (medication) => {
    setSelectedMedication(medication);
    setShowMedicationDetails(true);
  };

  const handleReminderTimeChange = (time) => {
    setReminderTime(time);
    // In real app, this would update backend settings
  };

  const filteredAlerts = alerts.filter(alert => 
    alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMedications = medications.upcoming.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalMeds: medications.upcoming.length + medications.completed.length,
    takenToday: medications.completed.filter(m => m.date === 'Today').length,
    adherenceRate: Math.round((medications.completed.filter(m => m.adherence === "On time").length / 
      medications.completed.length) * 100) || 0
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg w-80">
            <div className="flex items-center">
              <i className="fas fa-check-circle text-green-500 text-xl mr-3"></i>
              <div>
                <p className="font-semibold">Medication Confirmed!</p>
                <p className="text-sm">Intake has been recorded successfully.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medication Details Modal */}
      {showMedicationDetails && selectedMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">{selectedMedication.name}</h3>
                <button 
                  onClick={() => setShowMedicationDetails(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Dosage</p>
                  <p className="text-lg font-semibold">{selectedMedication.dosage}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Schedule</p>
                  <p className="text-lg font-semibold">{selectedMedication.schedule}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="text-lg font-semibold">{selectedMedication.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="text-lg font-semibold">{selectedMedication.type}</p>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Instructions</p>
                <p className="text-gray-700">{selectedMedication.instructions}</p>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                  <i className="fas fa-edit mr-2"></i> Edit Details
                </button>
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg">
                  <i className="fas fa-history mr-2"></i> View History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <i className="fas fa-pills text-2xl"></i>
              </div>
              <div>
                <h1 className="text-3xl font-bold">MediScan</h1>
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-medium">STITCH BETA</span>
                  <span className="text-blue-100">• Real-time medication management</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 bg-white/20 p-3 rounded-xl">
                <i className="fas fa-user-md"></i>
                <div>
                  <p className="font-semibold">Dr. Alex Smith</p>
                  <p className="text-xs text-blue-100">Premium User</p>
                </div>
              </div>
              <button className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors">
                <i className="fas fa-cog text-xl"></i>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/20 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Total Medications</p>
                  <p className="text-3xl font-bold">{stats.totalMeds}</p>
                </div>
                <i className="fas fa-capsules text-2xl opacity-80"></i>
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Taken Today</p>
                  <p className="text-3xl font-bold">{stats.takenToday}</p>
                </div>
                <i className="fas fa-check-circle text-2xl opacity-80"></i>
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">Adherence Rate</p>
                  <p className="text-3xl font-bold">{stats.adherenceRate}%</p>
                </div>
                <i className="fas fa-chart-line text-2xl opacity-80"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="mb-6">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search medications or alerts..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === 'alerts' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'hover:bg-gray-50 text-gray-600'}`}
                  onClick={() => setActiveTab('alerts')}
                >
                  <i className="fas fa-bell w-6 text-center"></i>
                  <span className="font-semibold">Alerts & Reminders</span>
                  {alerts.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {alerts.filter(a => a.priority === 'high').length}
                    </span>
                  )}
                </button>

                <button
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === 'completed' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'hover:bg-gray-50 text-gray-600'}`}
                  onClick={() => setActiveTab('completed')}
                >
                  <i className="fas fa-check-circle w-6 text-center"></i>
                  <span className="font-semibold">Completed</span>
                  <span className="ml-auto bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    {medications.completed.length}
                  </span>
                </button>

                <button
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === 'reports' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'hover:bg-gray-50 text-gray-600'}`}
                  onClick={() => setActiveTab('reports')}
                >
                  <i className="fas fa-chart-bar w-6 text-center"></i>
                  <span className="font-semibold">Reports</span>
                </button>

                <button
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === 'inventory' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'hover:bg-gray-50 text-gray-600'}`}
                  onClick={() => setActiveTab('inventory')}
                >
                  <i className="fas fa-box w-6 text-center"></i>
                  <span className="font-semibold">Inventory</span>
                </button>

                <button
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'hover:bg-gray-50 text-gray-600'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <i className="fas fa-cog w-6 text-center"></i>
                  <span className="font-semibold">Settings</span>
                </button>
              </nav>

              {/* Reminder Settings */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-3">Reminder Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Remind me before:</label>
                    <div className="flex items-center gap-2 mt-2">
                      {["5", "15", "30", "60"].map((time) => (
                        <button
                          key={time}
                          className={`px-3 py-2 rounded-lg ${reminderTime === time ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
                          onClick={() => handleReminderTimeChange(time)}
                        >
                          {time} min
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-semibold">
                    <i className="fas fa-bell"></i>
                    Test Notification
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Tab Content Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {activeTab === 'alerts' && 'Alerts & Reminders'}
                    {activeTab === 'completed' && 'Completed Medications'}
                    {activeTab === 'reports' && 'Medication Reports'}
                    {activeTab === 'inventory' && 'Medication Inventory'}
                    {activeTab === 'settings' && 'Settings'}
                  </h2>
                  <p className="text-gray-600">
                    {activeTab === 'alerts' && 'Real-time medication management and system status'}
                    {activeTab === 'completed' && 'History of confirmed medication intake'}
                    {activeTab === 'reports' && 'Analytics and adherence reports'}
                    {activeTab === 'inventory' && 'Track medication stock and refills'}
                    {activeTab === 'settings' && 'Configure your medication preferences'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                    <i className="fas fa-plus"></i>
                    Add Medication
                  </button>
                  <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                    <i className="fas fa-filter"></i>
                    Filter
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'alerts' && (
                <div className="space-y-6">
                  {/* Upcoming Medications */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Dose Reminders</h3>
                        <p className="text-gray-600">UPCOMING TODAY • {medications.upcoming.length} medications</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        <i className="far fa-clock mr-1"></i>
                        Next dose in 2 hours
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredMedications.map(med => (
                        <div key={med.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-lg text-gray-800">{med.name}</h4>
                              <p className="text-gray-600">{med.dosage} • {med.type}</p>
                            </div>
                            <button 
                              onClick={() => handleViewDetails(med)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <i className="fas fa-ellipsis-h"></i>
                            </button>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center text-gray-700 mb-2">
                              <i className="far fa-clock mr-2 text-blue-500"></i>
                              <span className="font-semibold">{med.time}</span>
                              <span className="mx-2">•</span>
                              <span>{med.schedule}</span>
                            </div>
                            <p className="text-sm text-gray-600 flex items-center">
                              <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                              {med.instructions}
                            </p>
                            <div className="flex items-center justify-between mt-3 text-sm">
                              <span className="text-gray-500">
                                <i className="fas fa-pills mr-1"></i>
                                {med.remaining} remaining
                              </span>
                              <span className="text-green-600 font-medium">
                                <i className="fas fa-bell mr-1"></i>
                                Active
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleConfirmIntake(med.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
                            >
                              <i className="fas fa-check"></i>
                              Confirm Intake
                            </button>
                            <button className="px-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg border border-gray-300 flex items-center">
                              <i className="fas fa-clock"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Alerts */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800">System Alerts</h3>
                      <span className="text-sm text-gray-500">{filteredAlerts.length} active alerts</span>
                    </div>

                    <div className="space-y-4">
                      {filteredAlerts.map(alert => (
                        <div
                          key={alert.id}
                          className={`rounded-xl p-5 border-l-4 ${alert.type === 'critical' ? 'border-red-500 bg-red-50' :
                            alert.type === 'warning' ? 'border-amber-500 bg-amber-50' :
                            'border-blue-500 bg-blue-50'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className={`mt-1 ${alert.type === 'critical' ? 'text-red-500' :
                                alert.type === 'warning' ? 'text-amber-500' :
                                'text-blue-500'}`}>
                                {alert.type === 'critical' && <i className="fas fa-exclamation-triangle text-2xl"></i>}
                                {alert.type === 'warning' && <i className="fas fa-exclamation-circle text-2xl"></i>}
                                {alert.type === 'info' && <i className="fas fa-info-circle text-2xl"></i>}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-bold text-lg text-gray-800">{alert.title}</h4>
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${alert.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    alert.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                                    'bg-blue-100 text-blue-700'}`}>
                                    {alert.priority} priority
                                  </span>
                                </div>
                                <p className="text-gray-700 mb-3">{alert.message}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">
                                    <i className="far fa-clock mr-1"></i>
                                    {alert.timestamp}
                                  </span>
                                  <div className="flex gap-2">
                                    {alert.action && (
                                      <button className={`px-4 py-2 rounded-lg font-semibold ${alert.type === 'critical' ? 'bg-red-500 hover:bg-red-600' :
                                        alert.type === 'warning' ? 'bg-amber-500 hover:bg-amber-600' :
                                        'bg-blue-500 hover:bg-blue-600'} text-white`}>
                                        {alert.action}
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleSnoozeAlert(alert.id)}
                                      className="px-4 py-2 rounded-lg font-semibold bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                                    >
                                      Snooze
                                    </button>
                                    <button
                                      onClick={() => handleDismissAlert(alert.id)}
                                      className="px-4 py-2 rounded-lg font-semibold bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
                                    >
                                      Dismiss
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'completed' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Completed Medications */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Medications</h3>
                      <div className="space-y-4">
                        {medications.completed.filter(m => m.date === 'Today').map(med => (
                          <div key={med.id} className="bg-white rounded-xl p-4 border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="text-green-500">
                                  <i className="fas fa-check-circle text-2xl"></i>
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-800">{med.name}</h4>
                                  <p className="text-sm text-gray-600">Taken at {med.takenTime}</p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${med.adherence === 'On time' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {med.adherence}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Inventory Alert */}
                    <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-500">
                      <div className="flex items-start gap-4">
                        <div className="text-amber-500 mt-1">
                          <i className="fas fa-box text-3xl"></i>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">Low Inventory Alert</h3>
                          <p className="text-gray-700 mb-4">
                            Vitamin D3: Only 4 tablets remaining. This will last for 4 more days based on your schedule.
                          </p>
                          <div className="flex gap-3">
                            <button className="bg-amber-500 hover:bg-amber-600 text-gray-800 font-semibold py-2 px-6 rounded-lg">
                              Order Refill Now
                            </button>
                            <button className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-6 rounded-lg border border-gray-300">
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* History Table */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b">
                      <h3 className="text-xl font-bold text-gray-800">Medication History</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-4 text-gray-700 font-semibold">Medication</th>
                            <th className="text-left p-4 text-gray-700 font-semibold">Dosage</th>
                            <th className="text-left p-4 text-gray-700 font-semibold">Scheduled Time</th>
                            <th className="text-left p-4 text-gray-700 font-semibold">Actual Time</th>
                            <th className="text-left p-4 text-gray-700 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {medications.completed.map(med => (
                            <tr key={med.id} className="border-b hover:bg-gray-50">
                              <td className="p-4">
                                <div className="font-medium text-gray-800">{med.name}</div>
                              </td>
                              <td className="p-4 text-gray-600">{med.dosage}</td>
                              <td className="p-4 text-gray-600">08:00 AM</td>
                              <td className="p-4 text-gray-600">{med.takenTime}</td>
                              <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${med.adherence === 'On time' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                  {med.adherence}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-chart-bar text-4xl text-blue-500"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Medication Reports</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    View detailed analytics, adherence reports, and medication history charts.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <i className="fas fa-chart-line text-3xl text-blue-500 mb-4"></i>
                      <h4 className="font-bold text-gray-800 mb-2">Adherence Report</h4>
                      <p className="text-sm text-gray-600">View your medication adherence over time</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl">
                      <i className="fas fa-calendar-check text-3xl text-green-500 mb-4"></i>
                      <h4 className="font-bold text-gray-800 mb-2">Monthly Summary</h4>
                      <p className="text-sm text-gray-600">Monthly medication intake statistics</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl">
                      <i className="fas fa-file-pdf text-3xl text-purple-500 mb-4"></i>
                      <h4 className="font-bold text-gray-800 mb-2">Export Data</h4>
                      <p className="text-sm text-gray-600">Download reports for your doctor</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'inventory' && (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Medication Inventory</h3>
                  <p className="text-gray-600">Track your medication stock and set up automatic refills.</p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Settings</h3>
                  <p className="text-gray-600">Configure notification preferences and account settings.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-gray-500 text-sm">
              <p>© 2024 Mediscan AI. All medical advice should be verified with a professional.</p>
              <div className="flex justify-center gap-6 mt-2">
                <a href="/help" className="text-blue-600 hover:text-blue-800">Help Center</a>
                <a href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
                <a href="/emergency" className="text-blue-600 hover:text-blue-800">Emergency Contacts</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Font Awesome in index.html */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      
      {/* Add custom animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AlertScreen;