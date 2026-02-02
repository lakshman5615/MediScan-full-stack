import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Pill,
  Stethoscope,
  AlertTriangle,
  Calendar,
  ShieldAlert,
} from "lucide-react";
import { useAI } from "../../context/AIContext";

export default function AIExplanation() {
  const { history, current, selectFromHistory } = useAI();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-100">

      {/* ================= LEFT HISTORY ================= */}
      <aside className="hidden md:flex w-64 bg-white border-r flex-col p-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 flex items-center gap-2 text-sky-600 font-medium"
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <h3 className="font-semibold text-slate-800 mb-3">History</h3>

        <div className="flex-1 overflow-y-auto space-y-1">
          {history.length === 0 && (
            <p className="text-sm text-slate-400">No history yet</p>
          )}

          {history.map((item, index) => (
            <div
              key={index}
              onClick={() => selectFromHistory(item)}
              className={`
                px-3 py-2 rounded-lg text-sm cursor-pointer
                transition
                hover:bg-slate-100
                ${
                  current?.name === item.name
                    ? "bg-slate-100 font-medium text-slate-900"
                    : "text-slate-600"
                }
              `}
            >
              {item.name}
            </div>
          ))}
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">

        {/* MOBILE BACK */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sky-600 font-medium"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>
        </div>

        {!current ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-slate-500">
              Select a medicine from history
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6">

            {/* MEDICINE NAME */}
            <h2 className="text-2xl font-semibold text-slate-800">
              {current.name}
            </h2>

            {/* OPTIONAL AI SUMMARY */}
            {current.summary && (
              <p className="text-slate-600 leading-relaxed">
                {current.summary}
              </p>
            )}

            <hr />

            {/* DETAILS WITH ICONS */}
            <div className="space-y-4">

              {current.usage && (
                <InfoRow
                  icon={<Stethoscope size={20} className="text-sky-600" />}
                  label="Usage"
                  value={current.usage}
                />
              )}

              {current.dosage && (
                <InfoRow
                  icon={<Pill size={20} className="text-emerald-600" />}
                  label="Dosage"
                  value={current.dosage}
                />
              )}

              {current.sideEffects && (
                <InfoRow
                  icon={<AlertTriangle size={20} className="text-amber-500" />}
                  label="Side Effects"
                  value={current.sideEffects}
                />
              )}

              {current.warning && (
                <InfoRow
                  icon={<ShieldAlert size={20} className="text-red-500" />}
                  label="Warnings"
                  value={current.warning}
                  highlight
                />
              )}

              {current.expiryDate && (
                <InfoRow
                  icon={<Calendar size={20} className="text-indigo-600" />}
                  label="Expiry Date"
                  value={current.expiryDate}
                />
              )}

            </div>

            <hr />

            {/* SOURCE */}
            <p className="text-sm text-slate-400">
              Source: {current.source}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/* ================= INFO ROW ================= */
function InfoRow({ icon, label, value, highlight }) {
  return (
    <div
      className={`
        flex gap-4 items-start
        p-4 rounded-xl
        ${highlight ? "bg-red-50" : "bg-slate-50"}
      `}
    >
      <div className="mt-1">{icon}</div>

      <div className="flex-1">
        <p className="text-sm font-medium text-slate-700">
          {label}
        </p>
        <p className="text-slate-600 leading-relaxed">
          {value}
        </p>
      </div>
    </div>
  );
}
