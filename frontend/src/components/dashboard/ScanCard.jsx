
import { useRef, useState, useEffect } from "react";
import { Camera, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAI } from "../../context/AIContext";

export default function ScanCard() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { openAIExplanation } = useAI();

  const [stream, setStream] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* ---------------- OPEN BACK CAMERA ---------------- */
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        // video: { facingMode: { exact: "environment" } },
         video: { facingMode: "environment" }
      });

      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
      setShowModal(true);
    } catch (err) {
      alert("Camera access denied");
    }
  };

  /* ---------------- CAPTURE IMAGE ---------------- */
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageUrl = canvas.toDataURL("image/png");
    setPreview(imageUrl);

    stopCamera();
  };

  /* ---------------- STOP CAMERA ---------------- */
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  /* ---------------- CLOSE MODAL ---------------- */
  const closeModal = () => {
    stopCamera();
    setShowModal(false);
    setPreview(null);
  };

  /* ---------------- AI ANALYZE ---------------- */
  const handleAnalyze = () => {
    openAIExplanation({
      name: "Paracetamol",
      usage: "Pain & fever relief",
      dosage: "500mg twice daily",
      sideEffects: "Rare nausea",
      warning: "Avoid alcohol",
      expiryDate: "2026-08-12",
      source: "scan",
    });

    navigate("/dashboard/ai-explanation");
  };

  return (
    <>
      {/* SCAN CARD */}
      <div
        onClick={openCamera}
        className="cursor-pointer rounded-2xl p-6 text-white bg-gradient-to-br from-sky-500 to-cyan-500 hover:scale-[1.03] transition"
      >
        <Camera size={36} className="mb-4" />
        <h3 className="font-semibold text-lg">Scan Medicine</h3>
        <p className="text-sm opacity-90">Use back camera</p>
      </div>

      {/* CAMERA MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-[92%] max-w-md p-4">

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-3">
              <button onClick={closeModal} className="p-2 bg-slate-100 rounded-full">
                <ArrowLeft size={20} />
              </button>
              <h3 className="font-semibold">Scan Medicine</h3>
            </div>

            {/* CAMERA OR PREVIEW */}
            {!preview ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-56 object-cover rounded-xl"
                />
                <button
                  onClick={captureImage}
                  className="mt-4 w-full bg-sky-500 text-white py-2.5 rounded-xl"
                >
                  Capture Image
                </button>
              </>
            ) : (
              <>
                <img
                  src={preview}
                  className="w-full h-56 object-cover rounded-xl"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAnalyze}
                    className="flex-1 bg-sky-500 text-white py-2.5 rounded-xl"
                  >
                    Get AI Explanation
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-slate-200 py-2.5 rounded-xl"
                  >
                    Scan Again
                  </button>
                </div>
              </>
            )}

            <canvas ref={canvasRef} hidden />
          </div>
        </div>
      )}
    </>
  );
}










// import { useRef, useState, useEffect } from "react";
// import { Camera, ArrowLeft } from "lucide-react";

// export default function ScanCard() {
//   const fileRef = useRef(null);

//   const [preview, setPreview] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [aiResult, setAiResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [closing, setClosing] = useState(false);

//   // ================= Background scroll lock =================
// useEffect(() => {
//   if (showModal) {
//     document.body.style.overflow = "hidden"; // lock background
//   } else {
//     document.body.style.overflow = "auto";   // unlock
//   }

//   return () => {
//     document.body.style.overflow = "auto";   // cleanup
//   };
// }, [showModal]);


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
//       setPreview(null);
//     }, 300);
//   };

//   // 🔄 Retake
//   const handleRetake = () => {
//     closeModal();
//     setTimeout(() => {
//       fileRef.current.click();
//     }, 350);
//   };

//   // 🤖 AI Analyze (dummy data)
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
//               className={`
//     bg-white rounded-2xl w-[92%] max-w-md p-4 relative
//     max-h-[80vh] overflow-y-auto
//     scrollbar-none
//     transform transition-all duration-300 ease-out
//     ${closing
//       ? "opacity-0 translate-y-6 scale-95"
//       : "opacity-100 translate-y-0 scale-100"}
//   `}
//           >
//             {/* 🔙 TOP BAR */}
//             <div className="flex items-center gap-3 mb-3">
//               <button
//                 onClick={closeModal}
//                 className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition"
//               >
//                 <ArrowLeft size={20} className="text-slate-700" />
//               </button>
//               <h3 className="font-semibold text-base">Scan Preview</h3>
//             </div>

//             {/* IMAGE */}
//             <img
//               src={preview}
//               alt="Preview"
//               className="w-full h-56 object-cover rounded-xl"
//             />

//             {/* ACTION BUTTONS */}
//             <div className="flex gap-3 mt-4">
//               <button
//                 onClick={handleAnalyze}
//                 className="flex-1 bg-sky-500 text-white py-2.5 rounded-xl hover:bg-sky-600 transition"
//               >
//                 {loading ? "Analyzing..." : "Get AI Explanation"}
//               </button>

//               <button
//                 onClick={handleRetake}
//                 className="flex-1 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition"
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
