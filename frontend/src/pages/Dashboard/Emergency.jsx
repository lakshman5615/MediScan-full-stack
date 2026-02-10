import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Crosshair,
  Clock,
  Navigation,
  AlertCircle,
  Hospital,
  Stethoscope,
  Ambulance
} from "lucide-react";

export default function Emergency() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationUpdated, setLocationUpdated] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Format time function
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // User ki current location get karega
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setIsRefreshing(true);
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setLocationUpdated(formatTime(new Date()));
          
          // Address fetch karna
          await getAddressFromCoordinates(location.lat, location.lng);
          setLoadingLocation(false);
          setIsRefreshing(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoadingLocation(false);
          setIsRefreshing(false);
          
          // Agar location access na mile to default location set karein (Indore)
          const defaultLocation = { lat: 22.5634, lng: 76.9620 };
          setUserLocation(defaultLocation);
          setLocationUpdated(formatTime(new Date()));
          getAddressFromCoordinates(defaultLocation.lat, defaultLocation.lng);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      const defaultLocation = { lat: 22.5634, lng: 76.9620 };
      setUserLocation(defaultLocation);
      setLocationUpdated(formatTime(new Date()));
      getAddressFromCoordinates(defaultLocation.lat, defaultLocation.lng);
    }
  };

  // Coordinates se address fetch karega
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.display_name) {
        let shortAddress = "";
        if (data.address) {
          if (data.address.road) shortAddress += data.address.road + ", ";
          if (data.address.suburb) shortAddress += data.address.suburb + ", ";
          if (data.address.city) shortAddress += data.address.city;
          if (data.address.town) shortAddress += data.address.town;
          if (data.address.village) shortAddress += data.address.village;
          if (data.address.state) shortAddress += ", " + data.address.state;
          
          if (shortAddress === "") {
            shortAddress = data.display_name.split(",").slice(0, 3).join(", ");
          }
        } else {
          shortAddress = data.display_name.split(",").slice(0, 3).join(", ");
        }
        
        setAddress(shortAddress);
      } else {
        setAddress("Vijay Nagar, Indore, Madhya Pradesh");
      }
    } catch (error) {
      console.error("Address fetch error:", error);
      setAddress("Vijay Nagar, Indore, Madhya Pradesh");
    }
  };

  // Component load pe hi location fetch karega
  useEffect(() => {
    getUserLocation();
  }, []);

  // Google Maps open in new tab with nearest hospital search
  const openNearestHospitalInMaps = () => {
    if (!userLocation) {
      window.open("https://www.google.com/maps/search/nearest+hospital", "_blank");
      return;
    }
    
    window.open(
      `https://www.google.com/maps/search/nearest+hospital/@${userLocation.lat},${userLocation.lng},14z/data=!3m1!4b1?entry=ttu`,
      "_blank"
    );
  };

  // Get Google Maps embed URL for current location
  const getCurrentLocationMapUrl = () => {
    if (!userLocation) {
      return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235013.70717879913!2d75.80375049514768!3d22.72420443064635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcad1b410ddb%3A0x96ec4da356240f4!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000";
    }
    
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5000!2d${userLocation.lng}!3d${userLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white flex flex-col">
      
      {/* Header - Medical Professional Design */}
      {/* <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-blue-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="text-blue-600" size={20} />
            </button>
            
            <div>
              <h1 className="text-lg font-bold text-gray-900">MediScan Emergency</h1>
              
              <p className="text-xs text-gray-500">Medical Assistance Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
              <Stethoscope size={14} className="text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Emergency Mode</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column - Location & Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Medical Emergency Alert */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">Medical Emergency Alert</h2>
                    <p className="text-red-100 text-sm mt-1">
                      In case of critical emergency, call emergency services immediately
                    </p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Ambulance size={32} className="opacity-80" />
                </div>
              </div>
            </div>

            {/* Location Card - Professional Design */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 rounded-lg">
                      <Crosshair className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Current Location Tracking</h3>
                      <p className="text-xs text-gray-500">Real-time GPS positioning</p>
                    </div>
                  </div>
                  <button
                    onClick={getUserLocation}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>
              
              <div className="p-5">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Address Section */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-cyan-50 rounded-lg mt-0.5">
                        <MapPin className="text-cyan-600" size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
                          Your Current Address
                        </p>
                        <p className="font-semibold text-gray-900 leading-relaxed">
                          {loadingLocation ? (
                            <span className="text-gray-400">Detecting location...</span>
                          ) : address || "Vijay Nagar, Indore, Madhya Pradesh"}
                        </p>
                      </div>
                    </div>

                    {/* Coordinates */}
                    {userLocation && (
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-gray-50 rounded-lg mt-0.5">
                          <Navigation className="text-gray-600" size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">
                            GPS Coordinates
                          </p>
                          <div className="font-mono text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            <div>Lat: {userLocation.lat.toFixed(6)}</div>
                            <div>Lng: {userLocation.lng.toFixed(6)}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status & Info */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">Last Updated</span>
                        </div>
                        <span className="font-bold text-gray-900">{locationUpdated || "--:--"}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${loadingLocation ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                        <span className="text-xs text-gray-600">
                          {loadingLocation ? 'Updating location...' : 'Location active'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Action */}
                    {/* <button 
                      onClick={openNearestHospitalInMaps}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg active:scale-95"
                    >
                      <Hospital size={20} />
                      <span>Find Nearest Hospital</span>
                      <Plus size={18} />
                    </button> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Services Grid */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Emergency Services</h3>
              <div className="grid sm:grid-cols-3 gap-3">
             
                <div
                
                  className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl p-4 text-center group transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Ambulance className="text-orange-600" size={20} />
                  </div>
                  <div className="font-bold text-orange-700 text-lg">108</div>
                  <p className="text-xs text-gray-600 mt-1">Ambulance Service</p>
                </div>
                
                <div
                 
                  className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-4 text-center group transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Stethoscope className="text-blue-600" size={20} />
                  </div>
                  <div className="font-bold text-blue-700 text-lg">102</div>
                  <p className="text-xs text-gray-600 mt-1">Medical Helpline</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden h-full flex flex-col">
              {/* Map Header */}
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <MapPin className="text-red-500" size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Live Location Map</h3>
                    <p className="text-xs text-gray-500">Interactive location view</p>
                  </div>
                </div>
              </div>

              {/* Map Container */}
              <div className="relative flex-1 min-h-[400px]">
                <iframe
                  title="Current Location Map"
                  src={getCurrentLocationMapUrl()}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
                
                {/* Custom Location Marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                    <div className="relative w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                      <MapPin className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-700">Your Location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-700">Nearby Hospitals</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Action Button */}
              <div className="p-5 border-t border-gray-100">
                <button 
                      onClick={openNearestHospitalInMaps}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-200 hover:shadow-lg active:scale-95"
                    >
                      <Hospital size={20} />
                      <span>Find Nearest Hospital</span>
                      <Plus size={18} />
                    </button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Opens Google Maps with nearest hospital search
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Hospital className="text-blue-600" size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">MediScan Emergency</p>
                <p className="text-xs text-gray-500">Medical assistance system</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-xs text-gray-500">
                For immediate medical assistance, contact emergency services
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}