import ScanCard from "../../components/medicine/ScanCard";
import UploadCard from "../../components/medicine/UploadCard";
import ManualEntryCard from "../../components/medicine/ManualEntryCard";

export default function LandingMedicineOptions() {
  return (
    <div 
    id="medicine-options"
    className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold">
            Check Your Medicine
          </h1>
          <p className="text-slate-600 mt-2">
            Scan, upload or type medicine details
          </p>
        </div>

        {/* 🔥 THREE CARDS IN ONE ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ScanCard mode="guest" />
          <UploadCard mode="guest" />
          <ManualEntryCard mode="guest" />
        </div>

      </div>
    </div>
  );
}