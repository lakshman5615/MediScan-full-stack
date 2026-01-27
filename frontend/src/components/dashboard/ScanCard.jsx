

// ============Right ===================

// import scanBg from "../../assets/images/scan-bg.jpg";

// import { Camera } from "lucide-react";

// export default function ScanCard() {
//   return (
//     <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-6 text-white cursor-pointer hover:scale-[1.02] transition">

//       {/* Background pattern (soft squares) */}
//       <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white_2px,transparent_2px)] bg-[length:40px_40px]" />

//       {/* Icon */}
//       <div className="relative z-10 mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
//         <Camera size={22} />
//       </div>

//       {/* Text */}
//       <div className="relative z-10">
//         <h3 className="text-lg font-semibold">Scan</h3>
//         <p className="text-sm opacity-90">Medicine</p>
//       </div>
//     </div>
//   );
// }


// ==========bina icon ke ===========

// import { useRef, useState } from "react";
// import { scanMedicineByImage } from "../../services/medicineService";

// export default function ScanCard() {
//   const fileRef = useRef();
//   const [result, setResult] = useState(null);

//   const handleCapture = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const data = await scanMedicineByImage(file);
//     setResult(data);
//   };

//   return (
//     <div className="bg-sky-600 text-white rounded-xl p-6">
//       <h3 className="font-semibold text-lg">Scan Medicine</h3>

//       <button
//         onClick={() => fileRef.current.click()}
//         className="mt-6 bg-white text-sky-600 px-4 py-2 rounded-lg"
//       >
//         Open Camera
//       </button>

//       <input
//         ref={fileRef}
//         type="file"
//         accept="image/*"
//         capture="environment"
//         hidden
//         onChange={handleCapture}
//       />

//       {result && (
//         <div className="mt-4 bg-white text-black p-3 rounded-lg text-sm">
//           <p><b>Name:</b> {result.name}</p>
//           <p><b>Use:</b> {result.usage}</p>
//           <p><b>Dosage:</b> {result.dosage}</p>
//         </div>
//       )}
//     </div>
//   );
// }



import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { scanMedicineByImage } from "../../services/medicineService";

export default function ScanCard() {
  const fileRef = useRef(null);
  const [result, setResult] = useState(null);

  const handleCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await scanMedicineByImage(file);
    setResult(data);
  };

  return (
    <div
      onClick={() => fileRef.current.click()}
      className="
        cursor-pointer rounded-2xl p-6 text-white
        bg-gradient-to-br from-sky-500 to-cyan-500
        transition-all duration-300
        hover:scale-[1.03] hover:shadow-2xl
      "
    >
      <Camera size={36} className="mb-4 opacity-90" />

      <h3 className="font-semibold text-lg">Scan Medicine</h3>
      <p className="text-sm opacity-90">
        Scan medicine using camera
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleCapture}
      />

      {result && (
        <div className="mt-4 bg-white text-slate-800 p-4 rounded-xl text-sm space-y-1">
          <p><b>Name:</b> {result.name}</p>
          <p><b>Use:</b> {result.usage}</p>
          <p><b>Dosage:</b> {result.dosage}</p>
        </div>
      )}
    </div>
  );
}


