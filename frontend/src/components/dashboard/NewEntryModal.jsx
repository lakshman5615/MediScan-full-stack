import { useState } from "react";
import { useCabinet } from "../../context/CabinetContext";

export default function NewEntryModal({ isOpen, onClose }) {
  const { addMedicine } = useCabinet();

  const [form, setForm] = useState({
    name: "",
    dosage: "",
    expiry: "",
    quantity: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMedicine(form);
    onClose();
  };
    


     return (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-xl">
      
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Add New Medicine
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Medicine Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Medicine Name
          </label>
          <input
            name="name"
            placeholder="Enter medicine name"
            className="w-full mt-1 bg-slate-100 border border-sky-200 p-3 rounded-xl
                       text-slate-900 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-sky-500"
            onChange={handleChange}
            required
          />
        </div>

        {/* Timing */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Timing
          </label>
          <input
            name="dosage"
            placeholder="Morning / Afternoon / Night"
            className="w-full mt-1 bg-slate-100 border border-sky-200 p-3 rounded-xl
                       text-slate-900 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-sky-500"
            onChange={handleChange}
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Expiry Date
          </label>
          <input
            type="date"
            name="expiry"
            className="w-full mt-1 bg-slate-100 border border-sky-200 p-3 rounded-xl
             text-slate-900 placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-sky-500"
            onChange={handleChange}
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            placeholder="Total tablets"
            className="w-full mt-1 bg-slate-100 border border-sky-200 p-3 rounded-xl
                       text-slate-900 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-sky-500"
            onChange={handleChange}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-500 text-white
                       hover:bg-sky-600"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-sky-500 text-white
                       hover:bg-sky-600"
          >
            Save
          </button>
        </div>

      </form>
    </div>
  </div>
);

  // return (
  //   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  //     <div className="bg-white rounded-xl w-full max-w-md p-6">
  //       <h2 className="text-xl font-semibold mb-4">Add New Medicine</h2>

  //       <form onSubmit={handleSubmit} className="space-y-4">
  //         <input
  //           name="name"
  //           placeholder="Medicine Name"
  //           className="w-full border p-2 rounded"
  //           onChange={handleChange}
  //           required
  //         />

  //         <input
  //           name="dosage"
  //           placeholder="Timing (Morning / Afternoon / Night)"
  //           className="w-full border p-2 rounded"
  //           onChange={handleChange}
  //         />

  //         <input
  //           type="date"
  //           name="expiry"
  //           placeholder="Expiry Date"
  //           className="w-full border p-2 rounded"
  //           onChange={handleChange}
  //           required
  //         />

  //         <input
  //           type="number"
  //           name="quantity"
  //           placeholder="Quantity"
  //           className="w-full border p-2 rounded"
  //           onChange={handleChange}
  //         />

  //         <div className="flex justify-end gap-3">
  //           <button
  //             type="button"
  //             onClick={onClose}
  //             className="px-4 py-2 border rounded"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             type="submit"
  //             className="px-4 py-2 bg-blue-600 text-white rounded"
  //           >
  //             Save
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // );
}
