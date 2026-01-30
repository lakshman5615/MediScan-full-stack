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





// -----right h shi se chl rha h -------

// import { CheckCircle } from "lucide-react";

// export default function RecentScans() {
//   const scans = [
//     {
//       name: "Amoxicillin",
//       strength: "500mg",
//       time: "2 min ago",
//       verified: true,
//     },
//     {
//       name: "Ibuprofen",
//       strength: "200mg",
//       time: "1 hour ago",
//       verified: true,
//     },
//     {
//       name: "Vitamin D3",
//       strength: "1000 IU",
//       time: "Yesterday",
//       verified: false,
//     },
//   ];

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-6">

//       {/* Header */}
//       <div className="mb-5 flex items-center justify-between">
//         <h3 className="text-lg font-semibold text-slate-900">
//           Recent Scans
//         </h3>
//         <button className="text-sm font-medium text-sky-600 hover:underline">
//           History Archive
//         </button>
//       </div>

//       {/* List */}
//       <div className="space-y-4">
//         {scans.map((item, index) => (
//           <div
//             key={index}
//             className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
//           >
//             {/* Left */}
//             <div>
//               <p className="text-sm font-medium text-slate-900">
//                 {item.name}{" "}
//                 <span className="text-slate-400">
//                   {item.strength}
//                 </span>
//               </p>
//               <p className="text-xs text-slate-400">
//                 {item.time}
//               </p>
//             </div>

//             {/* Right */}
//             {item.verified && (
//               <div className="flex items-center gap-1 text-xs text-emerald-600">
//                 <CheckCircle size={14} />
//                 Verified by AI
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }


import { CheckCircle, Pill, FlaskConical } from "lucide-react";

export default function RecentScans() {
  const scans = [
    {
      name: "Amoxicillin 500mg",
      type: "tablet",
      info: "Antibiotic • 12 capsules remaining",
      time: "Scanned 2 hours ago",
      verified: true,
    },
    {
      name: "Ibuprofen Syrup",
      type: "syrup",
      info: "Pain Relief • 120ml bottle",
      time: "Scanned Yesterday",
      verified: true,
    },
    {
      name: "Vitamin D3",
      type: "tablet",
      info: "Supplement • Daily 2000 IU",
      time: "4 days ago",
      verified: false,
    },
  ];

  const getIcon = (type) => {
    if (type === "syrup") {
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-100">
          <FlaskConical size={18} className="text-cyan-600" />
        </div>
      );
    }

    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100">
        <Pill size={18} className="text-sky-600" />
      </div>
    );
  };

  return (
    <div>
      {/* ===== HEADER (OUTSIDE CARD) ===== */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 mt-4">
          Recent Scans
        </h3>

        <span className="cursor-pointer text-sm font-medium text-sky-500 hover:underline mt-4">
          History Archive
        </span>
      </div>

      {/* ===== CARD ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {scans.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                {getIcon(item.type)}

                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.info}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="text-xs text-slate-400">
                  {item.time}
                </p>

                {item.verified && (
                  <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircle size={14} />
                    Verified by AI
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

