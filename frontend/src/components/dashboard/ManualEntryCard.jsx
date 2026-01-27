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



import { useState } from "react";
import { Edit3 } from "lucide-react";
import { scanMedicineByName } from "../../services/medicineService";

export default function ManualEntryCard() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    if (!name) return;
    const data = await scanMedicineByName(name);
    setResult(data);
  };

  return (
    <div
      onClick={() => !open && setOpen(true)}
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

      {open && (
        <>
          <input
            className="
              mt-4 w-full rounded-xl border px-4 py-2
              focus:ring-2 focus:ring-sky-500 outline-none
            "
            placeholder="Enter medicine name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div
            onClick={handleCheck}
            className="
              mt-4 w-full text-center py-2 rounded-xl
              bg-sky-600 text-white font-medium
              hover:bg-sky-700 transition
            "
          >
            Check Medicine
          </div>
        </>
      )}

      {result && (
        <div className="mt-4 bg-sky-50 p-4 rounded-xl text-sm space-y-1">
          <p><b>Name:</b> {result.name}</p>
          <p><b>Usage:</b> {result.usage}</p>
          <p><b>Side Effects:</b> {result.sideEffects}</p>
        </div>
      )}
    </div>
  );
}
