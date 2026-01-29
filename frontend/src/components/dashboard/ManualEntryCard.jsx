// const ManualEntryCard = () => (
//   <div className="h-[160px] rounded-xl bg-white p-5 border">
//     <div className="text-sm font-medium">Add Manually</div>
//   </div>
// );

// export default ManualEntryCard;

// =====Right==========
// import { Plus } from "lucide-react";

// export default function ManualEntryCard() {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-6 cursor-pointer hover:shadow-md transition">

//       {/* Icon */}
//       <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
//         <Plus size={22} className="text-sky-600" />
//       </div>

//       {/* Text */}
//       <h3 className="text-lg font-semibold text-slate-900">
//         Add
//       </h3>
//       <p className="text-sm text-slate-500">
//         Manually
//       </p>

//     </div>
//   );
// }



// ==========bina icon ke ===========


// import { useState } from "react";
// import { scanMedicineByName } from "../../services/medicineService";

// export default function ManualEntryCard() {
//   const [name, setName] = useState("");
//   const [result, setResult] = useState(null);

//   const handleCheck = async () => {
//     if (!name) return;
//     const data = await scanMedicineByName(name);
//     setResult(data);
//   };

//   return (

    
//     <div className="bg-white rounded-xl p-6">
//       <h3 className="font-semibold text-lg">Add Manually</h3>

//       <input
//         className="mt-4 w-full border rounded-lg px-3 py-2"
//         placeholder="Enter medicine name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <button
//         onClick={handleCheck}
//         className="mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg w-full"
//       >
//         Check Medicine
//       </button>

//       {result && (
//         <div className="mt-4 bg-sky-50 p-3 rounded-lg text-sm ">
//           <p><b>Name:</b> {result.name}</p>
//           <p><b>Usage:</b> {result.usage}</p>
//           <p><b>Side Effects:</b> {result.sideEffects}</p>
//         </div>
//       )}
//     </div>
//   );
// }



// import { useState } from "react";
// import { Edit3 } from "lucide-react";
// import { scanMedicineByName } from "../../services/medicineService";

// export default function ManualEntryCard() {
//   const [open, setOpen] = useState(false);
//   const [name, setName] = useState("");
//   const [result, setResult] = useState(null);

//   const handleCheck = async () => {
//     if (!name) return;
//     const data = await scanMedicineByName(name);
//     setResult(data);
//   };

//   return (
//     <div
//       onClick={() => !open && setOpen(true)}
//       className="
//         cursor-pointer rounded-2xl bg-white p-6
//         transition-all duration-300
//         hover:-translate-y-1 hover:shadow-xl
//       "
//     >
//       <Edit3 size={30} className="text-emerald-600 mb-4" />

//       <h3 className="font-semibold text-lg">Add Manually</h3>
//       <p className="text-sm text-slate-500">
//         Search medicine by name
//       </p>

//       {open && (
//         <>
//           <input
//             className="
//               mt-4 w-full rounded-xl border px-4 py-2
//               focus:ring-2 focus:ring-sky-500 outline-none
//             "
//             placeholder="Enter medicine name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />

//           <div
//             onClick={handleCheck}
//             className="
//               mt-4 w-full text-center py-2 rounded-xl
//               bg-sky-600 text-white font-medium
//               hover:bg-sky-700 transition
//             "
//           >
//             Check Medicine
//           </div>
//         </>
//       )}

//       {result && (
//         <div className="mt-4 bg-sky-50 p-4 rounded-xl text-sm space-y-1">
//           <p><b>Name:</b> {result.name}</p>
//           <p><b>Usage:</b> {result.usage}</p>
//           <p><b>Side Effects:</b> {result.sideEffects}</p>
//         </div>
//       )}
//     </div>
//   );
// }




import { useState, useEffect } from "react";
import { Edit3, ArrowLeft } from "lucide-react";

export default function ManualEntryCard() {
  const [showModal, setShowModal] = useState(false);
  const [closing, setClosing] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // 🔒 Background scroll lock (same as Scan / Upload)
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  // ❌ Close modal with animation
  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setClosing(false);
      setName("");
      setAiResult(null);
      setLoading(false);
    }, 300);
  };


  const handleSearchAgain = () => {
  setName("");
  setAiResult(null);
  setLoading(false);
};

  // 🤖 AI Analyze (dummy – replace with API later)
  const handleAnalyze = () => {
    if (!name) return;
    setLoading(true);

    setTimeout(() => {
      setAiResult({
        name,
        usage: "Pain & fever relief",
        dosage: "500mg twice daily",
        sideEffects: "Nausea, dizziness (rare)",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* ================= MANUAL ENTRY CARD ================= */}
      <div
        onClick={() => setShowModal(true)}
        className="
          cursor-pointer rounded-2xl bg-white p-6
          transition-all duration-300
          hover:-translate-y-1 hover:shadow-xl
        "
      >
        <Edit3 size={30} className="text-emerald-600 mb-4" />
        <h3 className="font-semibold text-lg">Add Manually</h3>
        <p className="text-sm text-slate-500">
          Search medicine by name
        </p>
      </div>

      {/* ================= SAME MODAL ================= */}
      {showModal && (
        <div
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/70 transition-opacity duration-300
            ${closing ? "opacity-0" : "opacity-100"}
          `}
        >
          <div
            className={`
              bg-white rounded-2xl w-[92%] max-w-md p-4 relative
              max-h-[80vh] overflow-y-auto scrollbar-none
              transform transition-all duration-300
              ${closing
                ? "opacity-0 translate-y-6 scale-95"
                : "opacity-100 translate-y-0 scale-100"}
            `}
          >
            {/* 🔙 TOP BAR (same as others) */}
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={closeModal}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition"
              >
                <ArrowLeft size={20} className="text-slate-700" />
              </button>
              <h3 className="font-semibold text-base text-slate-800">
                Manual Entry
              </h3>
            </div>

            {/* 🔤 INPUT FIELD (light bg, dark text) */}
            <input
              className="
                w-full rounded-xl px-4 py-3
                bg-slate-100
                text-slate-900
                placeholder:text-slate-500
                focus:ring-2 focus:ring-sky-500
                outline-none
              "
              placeholder="Enter medicine name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* ACTION BUTTONS (same layout & colors) */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAnalyze}
                className="
                  flex-1 bg-sky-500 text-white py-2.5 rounded-xl
                  hover:bg-sky-600 transition focus:outline-none
                "
              >
                {loading ? "Analyzing..." : "Get AI Explanation"}
              </button>

              <button
                onClick={handleSearchAgain}
                className="
                  flex-1 bg-sky-500 text-white py-2.5 rounded-xl
                  hover:bg-sky-600 transition
                "
              >
                Search Again
              </button>
            </div>

            {/* AI RESULT (same style as Scan / Upload) */}
            {aiResult && (
              <div className="mt-4 bg-slate-50 p-3 rounded-xl text-sm text-slate-800 space-y-1">
                <p><b>Name:</b> {aiResult.name}</p>
                <p><b>Use:</b> {aiResult.usage}</p>
                <p><b>Dosage:</b> {aiResult.dosage}</p>
                <p><b>Side Effects:</b> {aiResult.sideEffects}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

