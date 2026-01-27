// const RecentScans = () => (
//   <div className="bg-white rounded-xl border p-5">
//     <div className="flex justify-between mb-4">
//       <h3 className="font-medium">Recent Scans</h3>
//       <span className="text-xs text-[#0EA5B7]">History Archive</span>
//     </div>
//     <div className="space-y-4 text-sm">
//       <div>Amoxicillin 500mg</div>
//       <div>Ibuprofen Syrup</div>
//       <div>Vitamin D3</div>
//     </div>
//   </div>
// );

// export default RecentScans;

import { CheckCircle } from "lucide-react";

export default function RecentScans() {
  const scans = [
    {
      name: "Amoxicillin",
      strength: "500mg",
      time: "2 min ago",
      verified: true,
    },
    {
      name: "Ibuprofen",
      strength: "200mg",
      time: "1 hour ago",
      verified: true,
    },
    {
      name: "Vitamin D3",
      strength: "1000 IU",
      time: "Yesterday",
      verified: false,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Recent Scans
        </h3>
        <button className="text-sm font-medium text-sky-600 hover:underline">
          History Archive
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {scans.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
          >
            {/* Left */}
            <div>
              <p className="text-sm font-medium text-slate-900">
                {item.name}{" "}
                <span className="text-slate-400">
                  {item.strength}
                </span>
              </p>
              <p className="text-xs text-slate-400">
                {item.time}
              </p>
            </div>

            {/* Right */}
            {item.verified && (
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <CheckCircle size={14} />
                Verified by AI
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

