import { useState } from "react";
import { Camera, Upload, Sparkles, Info, X, CheckCircle, AlertCircle, Calendar, Pill, Database, Edit, Save } from "lucide-react";
import ScanModeToggle from "../../components/ScanModeToggle";
// import Navbar from "../../components/Navbar";
import Sidebar from "../../components/dashboard/Sidebar";
import ScanOptionCard from "../../components/ScanOptionCard";

const Scan = () => {
  const [mode, setMode] = useState("scan");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [medicineData, setMedicineData] = useState({
    name: "",
    expiryDate: "",
    batchNumber: "",
    manufacturer: "",
    dosage: ""
  });

  // Demo medicine data for auto-fill
  const demoMedicines = [
    { name: "Paracetamol 500mg", type: "Tablet", commonFor: "Fever & Pain" },
    { name: "Amoxicillin 250mg", type: "Capsule", commonFor: "Bacterial Infection" },
    { name: "Cetirizine 10mg", type: "Tablet", commonFor: "Allergies" },
    { name: "Omeprazole 20mg", type: "Capsule", commonFor: "Acidity" }
  ];

  // Handle camera scan
  const handleCameraScan = () => {
    setScanning(true);
    setShowCamera(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setScanning(false);
      setShowCamera(false);
      // Demo result
      const demoResult = {
        success: true,
        medicineName: "Paracetamol 500mg",
        expiryDate: "2024-12-31",
        batchNumber: "BATCH12345",
        manufacturer: "ABC Pharmaceuticals",
        confidence: 92,
        isEdited: false
      };
      setScanResult(demoResult);
      // Pre-fill form with scanned data for editing
      setMedicineData({
        name: demoResult.medicineName,
        expiryDate: demoResult.expiryDate,
        batchNumber: demoResult.batchNumber,
        manufacturer: demoResult.manufacturer,
        dosage: "500mg, 2 times daily"
      });
    }, 2000);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setScanning(true);
        
        // Simulate image processing
        setTimeout(() => {
          setScanning(false);
          const demoResult = {
            success: true,
            medicineName: "Amoxicillin 250mg",
            expiryDate: "2025-06-30",
            batchNumber: "BATCH67890",
            manufacturer: "XYZ Pharma Ltd",
            confidence: 88,
            isEdited: false
          };
          setScanResult(demoResult);
          // Pre-fill form with scanned data for editing
          setMedicineData({
            name: demoResult.medicineName,
            expiryDate: demoResult.expiryDate,
            batchNumber: demoResult.batchNumber,
            manufacturer: demoResult.manufacturer,
            dosage: "250mg, 3 times daily"
          });
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle manual form submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    // Process manual entry
    console.log("Medicine Data:", medicineData);
  };

  // Reset scan
  const resetScan = () => {
    setScanResult(null);
    setUploadedImage(null);
    setIsEditing(false);
    setMedicineData({
      name: "",
      expiryDate: "",
      batchNumber: "",
      manufacturer: "",
      dosage: ""
    });
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Save edited data
  const saveEditedData = () => {
    if (scanResult) {
      setScanResult({
        ...scanResult,
        medicineName: medicineData.name,
        expiryDate: medicineData.expiryDate,
        batchNumber: medicineData.batchNumber,
        manufacturer: medicineData.manufacturer,
        isEdited: true
      });
    }
    setIsEditing(false);
  };

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setMedicineData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* <Sidebar /> */}
      
      {/* Hero Section with Enhanced Design */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Pill className="w-8 h-8" />
                </div>
                <span className="text-sm font-semibold tracking-wider uppercase opacity-90">
                  Smart Healthcare
                </span>
              </div>
              
              <h1 className="text-5xl font-bold leading-tight mb-6">
                Intelligent Medicine
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300">
                  Scanning & Tracking
                </span>
              </h1>
              
              <p className="text-xl opacity-90 mb-8 leading-relaxed">
                MediScan uses advanced AI to scan, identify, and track your medicines. 
                Get expiry alerts, dosage reminders, and maintain a digital health record.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: "🔍", text: "Instant Scan" },
                  { icon: "⏰", text: "Smart Alerts" },
                  { icon: "📊", text: "Health Analytics" },
                  { icon: "🔐", text: "Secure Storage" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium hover:scale-90">{item.text}</span>
                  </div>
                ))}
              </div>
              
              <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl">
                Start Scanning →
              </button>
            </div>
            
            {/* Right Image with Floating Animation */}
            <div className="relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="animate-float">
                  <img
                    src="https://play-lh.googleusercontent.com/za0Rsnge-VyL8FC9cnZ4WTLV21j1TanAcIJqyxLfFbjf_Y1AXp9tDYI3gfEQ_erkV1s"
                    alt="MediScan App"
                    className="w-full rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Scanning Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8" id="scan_medicine">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Quick Stats */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Medicines Scanned", value: "1,257", color: "text-blue-600" },
                    { label: "Expiry Alerts", value: "12", color: "text-amber-600" },
                    { label: "Accuracy Rate", value: "96.5%", color: "text-emerald-600" },
                  ].map((stat, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">{stat.label}</span>
                      <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Medicines List */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-indigo-600" />
                  Common Medicines
                </h3>
                <div className="space-y-3">
                  {demoMedicines.map((med, idx) => (
                    <div key={idx} className="p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group">
                      <div className="font-medium text-gray-800 group-hover:text-blue-600">{med.name}</div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{med.type}</span>
                        <span>{med.commonFor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Scanner Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Scan Medicine</h2>
                      <p className="text-blue-100">AI-powered medicine identification</p>
                    </div>
                  </div>
                  {scanResult && (
                    <button 
                      onClick={resetScan}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Scanner Content */}
              <div className="p-8">
                {/* Mode Toggle */}
                <ScanModeToggle mode={mode} setMode={setMode} />
                
                {/* Scanning Animation */}
                {scanning && (
                  <div className="my-8 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200">
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative">
                        <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <Camera className="w-12 h-12 text-blue-600 absolute inset-0 m-auto" />
                      </div>
                      <p className="mt-6 text-lg font-semibold text-gray-700">Scanning medicine...</p>
                      <p className="text-gray-500 mt-2">Processing image with AI</p>
                    </div>
                  </div>
                )}
                
                {/* Scan Result with Edit Option */}
                {scanResult && (
                  <div className="my-8 animate-slideIn">
                    <div className={`bg-gradient-to-r ${scanResult.isEdited ? 'from-blue-50 to-cyan-50 border-blue-200' : 'from-emerald-50 to-green-50 border-emerald-200'} border-2 rounded-2xl p-6`}>
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          {scanResult.isEdited ? (
                            <CheckCircle className="w-12 h-12 text-blue-600 flex-shrink-0" />
                          ) : (
                            <CheckCircle className="w-12 h-12 text-emerald-600 flex-shrink-0" />
                          )}
                          {scanResult.isEdited && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              Edited
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">
                                {isEditing ? "Edit Medicine Details" : "Medicine Identified!"}
                              </h3>
                              <p className={`font-medium ${scanResult.isEdited ? 'text-blue-600' : 'text-emerald-600'}`}>
                                Confidence: {scanResult.confidence}%
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {!isEditing ? (
                                <>
                                  <span className={`px-3 py-1 ${scanResult.isEdited ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'} rounded-full text-sm font-medium`}>
                                    {scanResult.isEdited ? '✓ Edited & Verified' : '✓ Verified'}
                                  </span>
                                  <button 
                                    onClick={toggleEditMode}
                                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                                  >
                                    <Edit className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium">Edit</span>
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={saveEditedData}
                                  className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                                >
                                  <Save className="w-4 h-4" />
                                  <span className="text-sm font-medium">Save</span>
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {isEditing ? (
                            // Edit Form
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Medicine Name
                                </label>
                                <input
                                  type="text"
                                  value={medicineData.name}
                                  onChange={(e) => handleFieldChange('name', e.target.value)}
                                  className="w-full border-2 border-gray-300 rounded-xl p-3 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                />
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Expiry Date
                                  </label>
                                  <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                      type="date"
                                      value={medicineData.expiryDate}
                                      onChange={(e) => handleFieldChange('expiryDate', e.target.value)}
                                      className="w-full border-2 border-gray-300 rounded-xl p-3 pl-10 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Batch Number
                                  </label>
                                  <input
                                    type="text"
                                    value={medicineData.batchNumber}
                                    onChange={(e) => handleFieldChange('batchNumber', e.target.value)}
                                    className="w-full border-2 border-gray-300 rounded-xl p-3 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                  />
                                </div>
                              </div>
                              
                              <div className="pt-4">
                                <button
                                  type="button"
                                  onClick={() => setIsEditing(false)}
                                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Display Scanned/Edited Data
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-xl shadow-sm">
                                  <p className="text-sm text-gray-500">Medicine Name</p>
                                  <p className="font-bold text-lg">{scanResult.medicineName}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm">
                                  <p className="text-sm text-gray-500">Expiry Date</p>
                                  <p className={`font-bold text-lg ${new Date(scanResult.expiryDate) < new Date() ? 'text-red-600' : 'text-amber-600'}`}>
                                    {scanResult.expiryDate}
                                  </p>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm">
                                  <p className="text-sm text-gray-500">Batch Number</p>
                                  <p className="font-bold">{scanResult.batchNumber}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm">
                                  <p className="text-sm text-gray-500">Status</p>
                                  <p className={`font-bold ${scanResult.isEdited ? 'text-blue-600' : 'text-emerald-600'}`}>
                                    {scanResult.isEdited ? 'Verified & Edited' : 'Auto-detected'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mt-6 flex gap-3">
                                <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex-1">
                                  Scan the Medicine
                                </button>
                                <button 
                                  onClick={resetScan}
                                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                  Scan Another
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Scan Options */}
                {!scanning && !scanResult && mode === "scan" && (
                  <>
                    {/* Uploaded Image Preview */}
                    {uploadedImage && (
                      <div className="my-6">
                        <div className="relative">
                          <img 
                            src={uploadedImage} 
                            alt="Uploaded" 
                            className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
                          />
                          <button 
                            onClick={() => setUploadedImage(null)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Camera Feed (Simulated) */}
                    {showCamera && (
                      <div className="my-6">
                        <div className="relative w-full max-w-md mx-auto">
                          <div className="bg-black rounded-2xl overflow-hidden aspect-video">
                            {/* Simulated camera feed */}
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-white text-center">
                                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>Camera Feed</p>
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-0 border-2 border-blue-400 rounded-2xl pointer-events-none"></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Info Card */}
                    <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                          <h4 className="text-blue-900 font-bold mb-2">For Best Results:</h4>
                          <ul className="space-y-2 text-blue-800">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Ensure good lighting and clear focus
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Capture entire medicine strip/box
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Keep expiry date visible in frame
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              You can edit the scanned details for accuracy
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Scan Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Camera Option */}
                      <div 
                        onClick={handleCameraScan}
                        className="group cursor-pointer"
                      >
                        <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 hover:border-blue-500 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 h-full">
                          <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                              <Camera className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold">Live</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Scan with Camera</h3>
                            <p className="text-gray-600">Real-time scanning using device camera</p>
                            <div className="mt-4 inline-flex items-center gap-2 text-blue-600 font-medium">
                              <span>Start Scanning</span>
                              <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Upload Option */}
                      <div className="group">
                        <label className="cursor-pointer block h-full">
                          <div className="bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 hover:border-indigo-500 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 h-full">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                              <Upload className="w-12 h-12 text-white" />
                            </div>
                            <div className="text-center">
                              <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Image</h3>
                              <p className="text-gray-600">Select from gallery or files</p>
                              <div className="mt-4 inline-flex items-center gap-2 text-indigo-600 font-medium">
                                <span>Choose File</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                              </div>
                            </div>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Manual Entry Form */}
                {mode === "manual" && !scanResult && (
                  <div className="mt-8 animate-fadeIn">
                    <form onSubmit={handleManualSubmit}>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                            <span className="flex items-center gap-2">
                              <Pill className="w-4 h-4" />
                              Medicine Details
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter medicine name (e.g., Paracetamol 500mg)"
                            className="w-full border-2 border-gray-200 rounded-xl p-4 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-lg"
                            value={medicineData.name}
                            onChange={(e) => setMedicineData({...medicineData, name: e.target.value})}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Expiry Date
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type="date"
                                className="w-full border-2 border-gray-200 rounded-xl p-4 pl-12 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                value={medicineData.expiryDate}
                                onChange={(e) => setMedicineData({...medicineData, expiryDate: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Batch Number
                            </label>
                            <input
                              type="text"
                              placeholder="Batch No.(Optional)"
                              className="w-full border-2 border-gray-200 rounded-xl p-4 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                              value={medicineData.batchNumber}
                              onChange={(e) => setMedicineData({...medicineData, batchNumber: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-4 pt-4">
                          <button 
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                            text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Scan the Medicine
                          </button>
                          <button 
                            type="button"
                            onClick={() => setMedicineData({
                              name: "",
                              expiryDate: "",
                              batchNumber: "",
                              manufacturer: "",
                              dosage: ""
                            })}
                            className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
            
            {/* Features Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🤖",
                  title: "AI-Powered",
                  desc: "Advanced OCR and image recognition"
                },
                {
                  icon: "✏️",
                  title: "Easy Editing",
                  desc: "Edit scanned details for accuracy"
                },
                {
                  icon: "📈",
                  title: "Health Insights",
                  desc: "Usage patterns and analytics"
                }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h4 className="font-bold text-gray-800 text-lg mb-2">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add custom animations */}
      {/* <style jsx>{`
      
      `}</style> */}
    </div>
  );
};

export default Scan;