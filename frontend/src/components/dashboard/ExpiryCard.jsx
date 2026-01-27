// const ExpiryCard = () => (
//   <div className="h-[160px] rounded-xl bg-white p-5 border">
//     <div className="text-xs text-gray-400">EXPIRES SOON</div>
//     <div className="text-3xl font-semibold mt-4">03</div>
//     <p className="text-xs text-gray-500 mt-1">
//       Items expiring within the next 30 days
//     </p>
//     <span className="text-xs text-[#0EA5B7] mt-3 inline-block">
//       Review Cabinet
//     </span>
//   </div>
// );

// export default ExpiryCard;


import { Clock } from "lucide-react";

export default function ExpiryCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      {/* Icon */}
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
        <Clock size={18} className="text-orange-500" />
      </div>

      {/* Label */}
      <p className="text-xs font-medium tracking-wide text-slate-400">
        EXPIRES SOON
      </p>

      {/* Count */}
      <h2 className="mt-3 text-3xl font-semibold text-slate-900">
        03
      </h2>

      {/* Description */}
      <p className="mt-1 text-sm text-slate-500">
        Items expiring within the next 30 days
      </p>

      {/* Action */}
      <button className="mt-4 text-sm font-medium text-sky-600 hover:underline">
        Review Cabinet
      </button>

    </div>
  );
}

