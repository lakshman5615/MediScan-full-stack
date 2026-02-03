import { PlusSquare } from "lucide-react";

export default function MediScanIcon() {
  return (
    <>
      <div className="flex justify-center mb-3">
        <div className="h-14 w-14 rounded-xl bg-cyan-100 flex items-center justify-center">
          <PlusSquare size={26} className="text-cyan-600" />
        </div>
      </div>

      <h2 className="text-center text-2xl font-bold text-gray-800">
        MediScan
      </h2>
    </>
  );
}