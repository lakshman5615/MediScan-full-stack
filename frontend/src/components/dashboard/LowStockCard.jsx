// const LowStockCard = () => (
//   <div className="h-[160px] rounded-xl bg-white p-5 border">
//     <div className="text-xs text-gray-400">LOW STOCK</div>
//     <div className="text-3xl font-semibold mt-4">05</div>
//     <p className="text-xs text-gray-500 mt-1">
//       Medications with less than 5 doses left
//     </p>
//     <span className="text-xs text-[#0EA5B7] mt-3 inline-block">
//       Order Refill
//     </span>
//   </div>
// );

// export default LowStockCard;

import { AlertTriangle } from "lucide-react";

export default function LowStockCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      {/* Icon */}
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
        <AlertTriangle size={18} className="text-red-500" />
      </div>

      {/* Label */}
      <p className="text-xs font-medium tracking-wide text-slate-400">
        LOW STOCK
      </p>

      {/* Count */}
      <h2 className="mt-3 text-3xl font-semibold text-slate-900">
        05
      </h2>

      {/* Description */}
      <p className="mt-1 text-sm text-slate-500">
        Medications with less than 5 doses left
      </p>

      {/* Action */}
      <button className="mt-4 text-sm font-medium text-sky-600  hover:underline">
        Order Refill
      </button>

    </div>
  );
}


