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
import { Link } from "react-router-dom";
import { getLowStockCount } from "../../services/dashboardApi";
import { useEffect, useState } from "react";

export default function LowStockCard() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await getLowStockCount();
        setCount(res.lowStockCount);
      } catch (err) {
        console.error("Low stock error", err);
      }
    };

    fetchLowStock();
  }, []);
  return (
    // border border-slate-200
    <div className="rounded-2xl  bg-white p-6 transition-all duration-300
                    hover:shadow-lg  hover:-translate-y-1 ">

      {/* Top */}
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
          <AlertTriangle size={20} className="text-red-500" />
        </div>

        <p className=" text-xs font-semibold tracking-wide text-red-500">
          LOW STOCK
        </p>
      </div>

      {/* Count */}
      <h2 className="mt-5 text-4xl font-bold text-slate-900">
        {count < 10 ? `0${count}` : count}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Medications with less than 5 doses left
      </p>

      {/* Light grey divider */}
      <div className="mt-5 h-px w-full bg-slate-100" />

      {/* Bottom */}
      <div className="mt-4 flex items-center justify-between">
        {/* Gradient dots */}
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-gradient-to-r from-red-400 to-red-300" />
          <span className="h-3 w-3 rounded-full bg-gradient-to-r from-red-300 to-red-200" />
        </div>

        {/* Link */}
        <Link
          to="/dashboard/cabinet"
          className="text-sm font-medium text-sky-500 hover:underline"
        >
          Review Cabinet
        </Link>
      </div>

    </div>
  );
}



