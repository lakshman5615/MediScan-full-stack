import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  MapPin,
  Phone,
  Plus
} from "lucide-react";

export default function Emergency() {
  const navigate = useNavigate();
  const [isHolding, setIsHolding] = useState(false);

  const handleHoldStart = () => {
    setIsHolding(true);

    setTimeout(() => {
      alert("🚨 Emergency Alert Activated");
      setIsHolding(false);
    }, 3000);
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
  };

  return (
    <div className="min-h-screen bg-[#f9fbfc] flex flex-col">
      
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white shadow-sm">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-lg font-semibold mx-auto">
          Emergency Assistance
        </h1>
      </div>

      {/* Panic Button */}
      <div className="flex flex-col items-center mt-12">
        <div
          onMouseDown={handleHoldStart}
          onMouseUp={handleHoldEnd}
          onTouchStart={handleHoldStart}
          onTouchEnd={handleHoldEnd}
          className={`w-44 h-44 rounded-full flex flex-col items-center justify-center 
            text-white shadow-xl transition-all duration-200
            ${isHolding ? "bg-red-600 scale-95" : "bg-red-500"}`}
        >
          <AlertTriangle size={42} />
          <p className="text-xl font-bold mt-2">PANIC</p>
        </div>

        <p className="text-red-500 font-semibold mt-6 tracking-wide">
          HOLD TO ACTIVATE
        </p>
        <p className="text-gray-500 text-sm text-center px-6">
          Press and hold for 3 seconds to alert emergency services
        </p>
      </div>

      {/* Location Card */}
      <div className="mx-4 mt-10 bg-white p-4 rounded-xl shadow flex gap-3 items-start">
        <div className="p-3 bg-cyan-100 rounded-full">
          <MapPin className="text-cyan-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">
            YOUR CURRENT LOCATION
          </p>
          <p className="font-semibold leading-snug">
            242 Health St, Medical District, NY 10001
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 mt-10">
        <h2 className="text-2xl font-bold text-center">
          Find nearest hospital
        </h2>
        <p className="text-gray-500 text-center mt-2">
          Immediate help is available around you
        </p>

        <div className="flex gap-4 mt-6">
          <button className="flex-1 bg-cyan-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
            <Plus size={18} />
            Hospitals
          </button>

          <a
            href="tel:112"
            className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Phone size={18} />
            Emergency
          </a>
        </div>
      </div>

      {/* Map */}
      <div className="mx-4 mt-10 mb-8 rounded-xl overflow-hidden shadow">
        <iframe
          title="Nearby Hospitals"
          src="https://www.google.com/maps?q=nearest+hospital&output=embed"
          className="w-full h-64 border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
