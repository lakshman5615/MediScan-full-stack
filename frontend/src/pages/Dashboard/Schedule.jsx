import React, { useState } from "react";

export default function WeeklyDosageSchedule() {
  const [activeDay, setActiveDay] = useState(23);

  const days = [
    { label: "MON", date: 21 },
    { label: "TUE", date: 22 },
    { label: "WED", date: 23 },
    { label: "THU", date: 24 },
    { label: "FRI", date: 25 },
    { label: "SAT", date: 26 },
    { label: "SUN", date: 27 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT INFO CARD */}
        <div className="bg-white rounded-xl border p-5">
          <h2 className="text-lg font-semibold">Amoxicillin</h2>
          <p className="text-sm text-slate-500">
            500mg • 1 capsule after food
          </p>

          <div className="mt-5">
            <p className="text-sm text-slate-500">Quantity remaining</p>
            <p className="text-lg font-semibold">14 / 30 pills</p>
            <span className="inline-block mt-2 text-xs text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              Refill soon (4 days left)
            </span>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">
              Consumption History
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Yesterday, 08:12 PM</span>
                <span className="text-sky-600">Taken</span>
              </div>
              <div className="flex justify-between">
                <span>Yesterday, 01:15 PM</span>
                <span className="text-red-500">Skipped</span>
              </div>
              <div className="flex justify-between">
                <span>Yesterday, 07:55 AM</span>
                <span className="text-sky-600">Taken</span>
              </div>
            </div>
          </div>

          <button className="mt-6 w-full bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-lg text-sm">
            Edit Prescription
          </button>
        </div>

        {/* RIGHT SCHEDULE */}
        <div className="lg:col-span-3 bg-white rounded-xl border p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-semibold">
                Weekly Dosage Schedule
              </h1>
              <p className="text-sm text-slate-500">
                October 21 – October 27, 2024
              </p>
            </div>

            <div className="flex bg-slate-100 rounded-lg p-1 text-sm">
              <button className="px-4 py-1 rounded-md bg-white shadow text-sky-600">
                Weekly
              </button>
              <button className="px-4 py-1 rounded-md text-slate-500">
                Monthly
              </button>
            </div>
          </div>

          {/* DAYS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {days.map((day) => {
              const active = activeDay === day.date;

              return (
                <div
                  key={day.date}
                  onClick={() => setActiveDay(day.date)}
                  className={`rounded-xl p-3 cursor-pointer border transition
                    ${
                      active
                        ? "border-sky-500 bg-sky-50"
                        : "bg-slate-50 border-transparent"
                    }
                  `}
                >
                  <div className="text-center mb-3">
                    <p className="text-xs text-slate-400">{day.label}</p>
                    <p className="font-semibold">{day.date}</p>
                  </div>

                  {/* MORNING */}
                  <DoseCard label="MORNING" time="08:00 AM" />

                  {/* AFTERNOON ACTIVE */}
                  {active && (
                    <div className="bg-sky-500 text-white rounded-xl p-3 my-2 text-center text-xs shadow">
                      AFTERNOON
                      <div className="font-semibold text-sm">
                        01:00 PM
                      </div>

                      <div className="flex justify-between mt-3 text-[11px]">
                        <button className="bg-white/20 px-3 py-1 rounded">
                          TAKEN
                        </button>
                        <button className="bg-white/20 px-3 py-1 rounded">
                          SKIP
                        </button>
                      </div>
                    </div>
                  )}

                  {/* NIGHT */}
                  <DoseCard label="NIGHT" time="08:00 PM" />
                </div>
              );
            })}
          </div>

          {/* FOOTER */}
          <div className="mt-6 flex justify-between items-center bg-sky-50 rounded-xl p-4 text-sm">
            <p>
              Weekly Adherence{" "}
              <span className="font-semibold text-sky-600">94%</span>
            </p>

            <div className="flex gap-4 text-xs">
              <span className="text-sky-600">● Taken</span>
              <span className="text-red-500">● Skipped</span>
              <span className="text-slate-400">● Scheduled</span>
            </div>

            <p>
              Streak <span className="font-semibold">12 Days</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoseCard({ label, time }) {
  return (
    <div className="bg-white rounded-xl p-3 text-center text-xs mb-2 shadow-sm">
      <p className="text-slate-400">{label}</p>
      <p className="font-semibold">{time}</p>
    </div>
  );
}


