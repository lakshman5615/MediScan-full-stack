
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
import { useNavigate } from "react-router-dom";
import { useAI } from "../../context/AIContext";
import { guestManualSearch } from "../../services/guestApi";
import { manualSearch } from "../../services/authMedicineApi";


export default function ManualEntryCard({ mode }) {
  const navigate = useNavigate();
  const { openAIExplanation } = useAI();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);


  /* ---------------- AI ANALYZE ---------------- */


  // const handleAnalyze = async () => {
  //   if (!name) return;

  //   try {
  //     console.log("🟡 ANALYZE CLICKED", { mode, name });

  //     let aiData;

  //     if (mode === "guest") {
  //       console.log("calling guest manual api");
  //       aiData = await guestManualSearch({ name });
  //     } else {
  //       console.log(" calling auth manual api");
  //       aiData = await manualSearch({ name });
  //     }

  //     console.log(" AI RESPONSE:", aiData);

  //     openAIExplanation(aiData);
  //     setShowModal(false); //  VERY IMPORTANT

  //     navigate("/dashboard/ai-explanation", {
  //       state: {
  //         from: mode === "guest" ? "landing" : "dashboard",
  //       },
  //     });

  //   } 
  //   catch (error) {
  //     console.error(" Manual analyze failed:", error);
  //     alert("AI service not available (backend off?)");
  //   }
  // };


  const handleAnalyze = async () => {
    if (!name) return;

    try {
      let response;

      if (mode === "guest") {
        response = await guestManualSearch({ text: name });
      } else {
        response = await manualSearch({ name });
      }

      const aiData = response.data?.aiExplanation || response.data;

      openAIExplanation(aiData);

      setShowModal(false);

      navigate("/dashboard/ai-explanation", {
        state: {
          from: mode === "guest" ? "landing" : "dashboard",
        },
      });
    } catch (error) {
      console.error("Manual search failed:", error);
    }
  };




  //   const handleAnalyze = () => {
  //   if (!name) return;

  //   openAIExplanation({
  //     name,
  //     usage: "Pain & fever relief",
  //     dosage: "500mg twice daily",
  //     sideEffects: "Rare nausea",
  //     source: "manual",
  //   });

  //   setShowModal(false);

  //   const isLoggedIn = !!localStorage.getItem("user");

  //   navigate("/dashboard/ai-explanation", {
  //   state: {
  //     from: mode === "guest" ? "landing" : "dashboard",
  //   },
  // });
  // };


  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="cursor-pointer rounded-2xl bg-white p-6 hover:shadow-xl transition"
      >
        <Edit3 size={30} className="text-emerald-600 mb-4" />
        <h3 className="font-semibold text-lg">Type Medicine</h3>
        <p className="text-sm text-slate-500">Search medicine by name</p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-4 w-[92%] max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => setShowModal(false)} className="p-2 bg-slate-100 rounded-full">
                <ArrowLeft size={20} />
              </button>
              <h3 className="font-semibold">Manual Entry</h3>
            </div>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter medicine name"
              className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAnalyze}
                className="flex-1 bg-sky-500 text-white py-2.5 rounded-xl"
              >
                Get AI Explanation
              </button>

              <button
                onClick={() => setName("")}
                className="flex-1 bg-sky-500 text-white py-2.5 rounded-xl"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


