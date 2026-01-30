
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

export default function UploadCard() {
  const fileRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  // 🔒 Background scroll lock
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showModal]);

  // 📤 Upload Image
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setShowModal(true);
  };

  // ❌ Close modal
  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setClosing(false);
      setAiResult(null);
      setPreview(null);
    }, 300);
  };

  // 🔁 Upload again
  const handleReUpload = () => {
    closeModal();
    setTimeout(() => {
      fileRef.current.click();
    }, 350);
  };

  // 🤖 AI Analyze (dummy)
  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setAiResult({
        name: "Cetirizine",
        usage: "Allergy relief",
        dosage: "Once daily",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* ================= UPLOAD CARD ================= */}
      <div
        onClick={() => fileRef.current.click()}
        className="
          cursor-pointer rounded-2xl bg-white p-6
          transition-all duration-300
          hover:-translate-y-1 hover:shadow-xl
        "
      >
        <UploadCloud size={36} className="text-sky-600 mb-4" />
        <h3 className="font-semibold text-lg">Upload Image</h3>
        <p className="text-sm text-slate-500">
          Upload medicine photo
        </p>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleUpload}
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
            {/* 🔙 Header */}
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={closeModal}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200"
              >
                <ArrowLeft size={20} />
              </button>
              <h3 className="font-semibold">Upload Preview</h3>
            </div>

            {/* IMAGE PREVIEW */}
            <img
              src={preview}
              alt="Preview"
              className="w-full h-56 object-cover rounded-xl"
            />

            {/* ACTIONS */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAnalyze}
                className="flex-1 bg-sky-500 text-white py-2.5 rounded-xl"
              >
                {loading ? "Analyzing..." : "Get AI Explanation"}
              </button>

              <button
                onClick={handleReUpload}
                className="flex-1 bg-sky-500 text-white py-2.5 rounded-xl"
              >
                Upload Again
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

