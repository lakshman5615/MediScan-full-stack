// const TodaySchedule = () => (
//   <div className="bg-white rounded-xl border p-5">
//     <h3 className="font-medium mb-4">Today's Schedule</h3>
//     <div className="text-sm space-y-3">
//       <div>08:00 AM – Multivitamin</div>
//       <div>01:00 PM – Amoxicillin</div>
//       <div>08:00 PM – Amoxicillin</div>
//     </div>
//   </div>
// );

// export default TodaySchedule;

import { Clock } from "lucide-react";

export default function TodaySchedule() {
  const schedule = [
    {
      time: "08:00 AM",
      name: "Paracetamol",
      dose: "1 Tablet",
      active: true,
    },
    {
      time: "01:00 PM",
      name: "Amoxicillin",
      dose: "1 Capsule",
      active: true,
    },
    {
      time: "09:00 PM",
      name: "Vitamin D3",
      dose: "2 Tablets",
      active: false,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Today’s Schedule
        </h3>
        <button className="text-sm font-medium text-sky-600 hover:underline">
          View All
        </button>
      </div>

      {/* Timeline */}
      <div className="relative space-y-6">

        {/* Vertical line */}
        <div className="absolute left-[7px] top-0 h-full w-px bg-slate-200" />

        {schedule.map((item, index) => (
          <div key={index} className="relative flex gap-4">

            {/* Dot */}
            <div
              className={`mt-1 h-4 w-4 rounded-full border-2 ${
                item.active
                  ? "border-sky-500 bg-sky-500"
                  : "border-slate-300 bg-white"
              }`}
            />

            {/* Content */}
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">
                {item.name}
              </p>
              <p className="text-xs text-slate-400">
                {item.dose}
              </p>
            </div>

            {/* Time */}
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock size={14} />
              {item.time}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

