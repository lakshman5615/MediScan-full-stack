

// import { useRef, useState } from "react";
// import { Camera } from "lucide-react";
// import { scanMedicineByImage } from "../../services/medicineService";

// export default function ScanCard() {
//   const fileRef = useRef(null);
//   const [result, setResult] = useState(null);

//   const handleCapture = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const data = await scanMedicineByImage(file);
//     setResult(data);
//   };

//   return (
//     <div
//       onClick={() => fileRef.current.click()}
//       className="
//         cursor-pointer rounded-2xl p-6 text-white
//         bg-gradient-to-br from-sky-500 to-cyan-500
//         transition-all duration-300
//         hover:scale-[1.03] hover:shadow-2xl
//       "
//     >
//       <Camera size={36} className="mb-4 opacity-90" />

//       <h3 className="font-semibold text-lg">Scan Medicine</h3>
//       <p className="text-sm opacity-90">
//         Scan medicine using camera
//       </p>

//       <input
//         ref={fileRef}
//         type="file"
//         accept="image/*"
//         capture="environment"
//         hidden
//         onChange={handleCapture}
//       />

//       {result && (
//         <div className="mt-4 bg-white text-slate-800 p-4 rounded-xl text-sm space-y-1">
//           <p><b>Name:</b> {result.name}</p>
//           <p><b>Use:</b> {result.usage}</p>
//           <p><b>Dosage:</b> {result.dosage}</p>
//         </div>
//       )}
//     </div>
//   );
// }




// import { useRef, useState } from "react";
// import { Camera, ArrowLeft, X } from "lucide-react";

// export default function ScanCard() {
//   const fileRef = useRef(null);

//   const [preview, setPreview] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [aiResult, setAiResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [closing, setClosing] = useState(false);

//   // 📸 Capture Image
//   const handleCapture = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setPreview(URL.createObjectURL(file));
//     setShowModal(true);
//   };

//   // ❌ Close modal with animation
//   const closeModal = () => {
//     setClosing(true);
//     setTimeout(() => {
//       setShowModal(false);
//       setClosing(false);
//       setAiResult(null);
//     }, 300);
//   };

//   // RETAKE
//   const handleRetake = () => {
//   setPreview(null);
//   setAiResult(null);
//   closeModal();

//   // thoda delay taaki animation complete ho
//   setTimeout(() => {
//     fileRef.current.click();
//   }, 350);
// };



//   // 🤖 AI Analyze (dummy now, API later)
//   const handleAnalyze = async () => {
//     setLoading(true);

//     setTimeout(() => {
//       setAiResult({
//         name: "Paracetamol",
//         usage: "Pain & fever relief",
//         dosage: "500mg twice daily",
//       });
//       setLoading(false);
//     }, 1500);

//     // 🔜 FUTURE API
//     // const result = await scanMedicineByImage(file)
//     // setAiResult(result)
//   };

//   return (
//     <>
//       {/* ================= SCAN CARD ================= */}
//       <div
//         onClick={() => fileRef.current.click()}
//         className="
//           cursor-pointer rounded-2xl p-6 text-white
//           bg-gradient-to-br from-sky-500 to-cyan-500
//           transition-all duration-300 hover:scale-[1.03]
//         "
//       >
//         <Camera size={36} className="mb-4 opacity-90" />
//         <h3 className="text-lg font-semibold">Scan Medicine</h3>
//         <p className="text-sm opacity-90">Scan using camera</p>

//         <input
//           ref={fileRef}
//           type="file"
//           accept="image/*"
//           capture="environment"
//           hidden
//           onChange={handleCapture}
//         />
//       </div>

//       {/* ================= MODAL ================= */}
//       {showModal && (
//         <div
//           className={`
//             fixed inset-0 z-50 flex items-center justify-center
//             bg-black/70 transition-opacity duration-300
//             ${closing ? "opacity-0" : "opacity-100"}
//           `}
//         >
//           {/* WHITE MODAL */}
//           <div
//             className={`
//               bg-white rounded-2xl w-[92%] max-w-lg p-4 relative
//               transform transition-all duration-300 ease-out
//               ${closing
//                 ? "opacity-0 translate-y-6 scale-95"
//                 : "opacity-100 translate-y-0 scale-100"}
//             `}
//           >
//             {/* 🔙 TOP BAR */}
//             <div className="flex items-center gap-3 mb-3">
//               <button
//                 onClick={closeModal}
//                 className="
//                       p-2 rounded-full 
//                       bg-slate-100 
//                       hover:bg-slate-200 
//                       transition
//                     "
//               >
//                 <ArrowLeft size={20} className="text-slate-700" />
//               </button>

//               <h3 className="font-semibold text-base">
//                 Scan Preview
//               </h3>
//             </div>

//             {/* IMAGE */}
//             <img
//               src={preview}
//               alt="Preview"
//               className="w-full h-57 object-cover rounded-xl"
//             />

//             {/* ACTION BUTTONS */}
//             <div className="flex gap-3 mt-4">
//               <button
//                 onClick={handleAnalyze}
//                 className="flex-1 bg-sky-500 text-white py-2.5 rounded-xl  hover:bg-sky-600 transition"
//               >
//                 {loading ? "Analyzing..." : "Get AI Explanation"}
//               </button>

//               <button
//                 onClick={handleRetake}
//                 className="
//                       flex-1 py-2.5 rounded-xl bg-sky-500 text-white  hover:bg-sky-600 transition"
//               >
//                 Scan Again
//               </button>
//             </div>

//             {/* AI RESULT */}
//             {aiResult && (
//               <div className="mt-4 bg-slate-50 p-3 rounded-xl text-sm space-y-1">
//                 <p><b>Name:</b> {aiResult.name}</p>
//                 <p><b>Use:</b> {aiResult.usage}</p>
//                 <p><b>Dosage:</b> {aiResult.dosage}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }




import { useRef, useState, useEffect } from "react";
import { Camera, ArrowLeft } from "lucide-react";

export default function ScanCard() {
  const fileRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  // ================= Background scroll lock =================
useEffect(() => {
  if (showModal) {
    document.body.style.overflow = "hidden"; // lock background
  } else {
    document.body.style.overflow = "auto";   // unlock
  }

  return () => {
    document.body.style.overflow = "auto";   // cleanup
  };
}, [showModal]);


  // 📸 Capture Image
  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setShowModal(true);
  };

  // ❌ Close modal with animation
  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setClosing(false);
      setAiResult(null);
      setPreview(null);
    }, 300);
  };

  // 🔄 Retake
  const handleRetake = () => {
    closeModal();
    setTimeout(() => {
      fileRef.current.click();
    }, 350);
  };

  // 🤖 AI Analyze (dummy data)
  const handleAnalyze = async () => {
    setLoading(true);
    setTimeout(() => {
      setAiResult({
        name: "Paracetamol",
        usage: "Pain & fever relief",
        dosage: "500mg twice daily",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* ================= SCAN CARD ================= */}
      <div
        onClick={() => fileRef.current.click()}
        className="
          cursor-pointer rounded-2xl p-6 text-white
          bg-gradient-to-br from-sky-500 to-cyan-500
          transition-all duration-300 hover:scale-[1.03]
        "
      >
        <Camera size={36} className="mb-4 opacity-90" />
        <h3 className="text-lg font-semibold">Scan Medicine</h3>
        <p className="text-sm opacity-90">Scan using camera</p>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={handleCapture}
        />
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/70 transition-opacity duration-300
            ${closing ? "opacity-0" : "opacity-100"}
          `}
        >
          {/* WHITE MODAL */}
          <div
              className={`
    bg-white rounded-2xl w-[92%] max-w-md p-4 relative
    max-h-[80vh] overflow-y-auto
    scrollbar-none
    transform transition-all duration-300 ease-out
    ${closing
      ? "opacity-0 translate-y-6 scale-95"
      : "opacity-100 translate-y-0 scale-100"}
  `}
          >
            {/* 🔙 TOP BAR */}
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={closeModal}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition"
              >
                <ArrowLeft size={20} className="text-slate-700" />
              </button>
              <h3 className="font-semibold text-base">Scan Preview</h3>
            </div>

            {/* IMAGE */}
            <img
              src={preview}
              alt="Preview"
              className="w-full h-56 object-cover rounded-xl"
            />

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAnalyze}
                className="flex-1 bg-sky-500 text-white py-2.5 rounded-xl hover:bg-sky-600 transition"
              >
                {loading ? "Analyzing..." : "Get AI Explanation"}
              </button>

              <button
                onClick={handleRetake}
                className="flex-1 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition"
              >
                Scan Again
              </button>
            </div>

            {/* AI RESULT */}
            {aiResult && (
              <div className="mt-4 bg-slate-50 p-3 rounded-xl text-sm space-y-1">
                <p><b>Name:</b> {aiResult.name}</p>
                <p><b>Use:</b> {aiResult.usage}</p>
                <p><b>Dosage:</b> {aiResult.dosage}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
