
// import { useRef, useState } from "react";
// import { UploadCloud } from "lucide-react";
// import { scanMedicineByImage } from "../../services/medicineService";

// export default function UploadCard() {
//   const fileRef = useRef(null);
//   const [result, setResult] = useState(null);

//   const handleUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const data = await scanMedicineByImage(file);
//     setResult(data);
//   };

//   return (
//     <div
//       onClick={() => fileRef.current.click()}
//       className="
//         cursor-pointer rounded-2xl bg-white p-6
//         transition-all duration-300
//         hover:-translate-y-1 hover:shadow-xl
//       "
//     >
//       <UploadCloud size={36} className="text-sky-600 mb-4" />

//       <h3 className="font-semibold text-lg">Upload Image</h3>
//       <p className="text-sm text-slate-500">
//         Upload medicine photo
//       </p>

//       <input
//         ref={fileRef}
//         type="file"
//         accept="image/*"
//         hidden
//         onChange={handleUpload}
//       />

//       {result && (
//         <div className="mt-4 bg-sky-50 p-4 rounded-xl text-sm space-y-1">
//           <p><b>Name:</b> {result.name}</p>
//           <p><b>Use:</b> {result.usage}</p>
//         </div>
//       )}
//     </div>
//   );
// }





import { useRef, useState, useEffect } from "react";
import { UploadCloud, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAI } from "../../context/AIContext";

export default function UploadCard({ mode }) {
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const { openAIExplanation } = useAI();

  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setShowModal(true);
  };

  const handleAnalyze = () => {
  openAIExplanation({
    name: "Cetirizine",
    usage: "Allergy relief",
    dosage: "Once daily",
    source: "upload",
  });

  setShowModal(false);

  const isLoggedIn = !!localStorage.getItem("user");

  navigate("/dashboard/ai-explanation", {
  state: {
    from: mode === "guest" ? "landing" : "dashboard",
  },
});
};

  return (
    <>
      <div
        onClick={() => fileRef.current.click()}
        className="cursor-pointer rounded-2xl bg-white p-6 hover:shadow-xl transition"
      >
        <UploadCloud size={36} className="text-sky-600 mb-4" />
        <h3 className="font-semibold text-lg">Upload Image</h3>
        <p className="text-sm text-slate-500">Upload medicine photo</p>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleUpload}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-4 w-[92%] max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => setShowModal(false)} className="p-2 bg-slate-100 rounded-full">
                <ArrowLeft size={20} />
              </button>
              <h3 className="font-semibold">Upload Preview</h3>
            </div>

            <img src={preview} className="w-full h-56 rounded-xl object-cover" />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAnalyze}
                className="flex-1 bg-sky-500 text-white py-2.5 rounded-xl"
              >
                Get AI Explanation
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-sky-500 text-white py-2.5 rounded-xl"
              >
                Upload Again
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}