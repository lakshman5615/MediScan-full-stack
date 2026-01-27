// export default function UploadCard() {
//   return (
//     <div className="h-[180px] rounded-2xl p-5 bg-white shadow-card">
//       <div className="text-sm font-semibold">
//         Upload Image
//       </div>
//     </div>
//   );
// }

// ==========bina icon ke ===========

// import { useState } from "react";
// import { scanMedicineByImage } from "../../services/medicineService";

// export default function UploadCard() {
//   const [result, setResult] = useState(null);

//   const handleUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const data = await scanMedicineByImage(file);
//     setResult(data);
//   };

//   return (
//     <div className="bg-white rounded-xl p-6">
//       <h3 className="font-semibold">Upload Image</h3>

//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleUpload}
//         className="mt-4"
//       />

//       {result && (
//         <div className="mt-4 text-sm bg-sky-50 p-3 rounded-lg">
//           <p><b>Name:</b> {result.name}</p>
//           <p><b>Use:</b> {result.usage}</p>
//         </div>
//       )}
//     </div>
//   );
// }


import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { scanMedicineByImage } from "../../services/medicineService";

export default function UploadCard() {
  const fileRef = useRef(null);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await scanMedicineByImage(file);
    setResult(data);
  };

  return (
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

      {result && (
        <div className="mt-4 bg-sky-50 p-4 rounded-xl text-sm space-y-1">
          <p><b>Name:</b> {result.name}</p>
          <p><b>Use:</b> {result.usage}</p>
        </div>
      )}
    </div>
  );
}



