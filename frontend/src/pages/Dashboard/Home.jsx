import ScanCard from "../../components/medicine/ScanCard";
import UploadCard from "../../components/medicine/UploadCard";
import ManualEntryCard from "../../components/medicine/ManualEntryCard";
import ExpiryCard from "../../components/dashboard/ExpiryCard";
import LowStockCard from "../../components/dashboard/LowStockCard";
import RecentScans from "../../components/dashboard/RecentScans";
import TodaySchedule from "../../components/dashboard/TodaySchedule";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <div className="flex flex-col mb-6 lg:flex-row lg:items-center lg:justify-between gap-4 mt-4">
        <div>
          <h1 className="text-3xl tracking-tight font-semibold">
            Welcome
          </h1>
          <p className="inter text-sm sm:text-base lg:text-sm text-gray-500 max-w-xl mt-1">
            Here’s a quick overview of your medicines, alerts, and daily actions.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/emergency")}
          className=" lexend flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold
               hover:bg-red-100 transition w-full lg:w-auto"
        >
          <AlertTriangle size={20} />
          Emergency Assistance
        </button>

        {/* <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm w-full lg:w-auto">
          Emergency Assistance
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* <ScanCard />
        <UploadCard />
        <ManualEntryCard /> */}

        <ScanCard mode="dashboard" />
        <UploadCard mode="dashboard" />
        <ManualEntryCard mode="dashboard" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpiryCard />
        <LowStockCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentScans />
        </div>
        <TodaySchedule />
      </div>
    </div>
  );
}








