// import { Search, Plus, Sparkles } from "lucide-react";

// export default function Navbar({ onNewEntry }) {
//   return (
//     // <header className="flex items-center justify-between bg-white px-6 py-4 border-b h-16">
//       //  <header className="flex   flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-white px-4 py-3 border-b w-full">
//       <header

//    className="
//   flex items-center gap-2
//   bg-sky-500 text-white
//   px-5 py-2
//   rounded-xl
//   hover:bg-sky-600
//   whitespace-nowrap
//   min-w-fit
// "
// >



//         <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
//       {/* Search Bar */}
//            <div className="relative w-full max-w-[420px]">

//         <Search
//           size={18}
//           className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//         />
//         <input
//           type="text"
//           placeholder="Search medicine, history or symptoms..."
//           className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
//         />
//       </div>

//       {/* Right Side Icons */}
//       <div className="flex items-center gap-4">

//         {/* AI Synced */}
//         {/* <div className="flex items-center gap-1 text-xs text-gray-500">
//           <Sparkles size={14} className="text-sky-500" />
//           AI SYNCED
//         </div> */}

//         {/* New Entry Button */}
//         <button
//         onClick={onNewEntry}
//         className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-xl hover:bg-sky-600"
//       >
//         <Plus size={18} />
//         New Entry
//       </button>
// </div>

//       </div>
//     </header>
//   );
// }




// import { Search, Plus } from "lucide-react";

// export default function Navbar({ onNewEntry }) {
//   return (
//     <header
//      className="
//     fixed top-0 right-0
//     z-50
//     flex flex-col sm:flex-row
//     gap-3 sm:items-center sm:justify-between
//     bg-white
//     px-4 py-3
//     border-b
//     w-full lg:w-[calc(100%-16rem)]
//     w-full lg:left-64 lg:w-[calc(100%-16rem)]
//   "

//     >
//       {/* Search Bar */}
//       <div className="relative w-full max-w-[420px]">
//         <Search
//           size={18}
//           className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//         />
//         <input
//           type="text"
//           placeholder="Search medicine, history or symptoms..."
//           className="
//             w-full
//             pl-12 pr-4 py-2.5
//             rounded-xl
//             border border-gray-200
//             bg-gray-50
//             text-gray-800
//             focus:outline-none
//             focus:ring-2 focus:ring-sky-500
//           "
//         />
//       </div>

//       {/* Right side */}
//       <div className="flex items-center gap-4">
//         {/* New Entry Button (ONLY this is blue) */}
//         <button
//           onClick={onNewEntry}
//           className="
//             flex items-center gap-2
//             bg-sky-500 text-white
//             px-5 py-2
//             rounded-xl
//             hover:bg-sky-600
//             whitespace-nowrap
//             min-w-fit
//           "
//         >
//           <Plus size={18} />
//           New Entry
//         </button>
//       </div>
//     </header>
//   );
// }


import { Menu, Search, Plus, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import EditMedicineModal from "../common/EditMedicineModal";
import { addMedicine } from "../../services/medicine.service";
import { getAlerts } from "../../services/alertApi";


export default function Navbar({ onMenuClick }) {
  const [notificationCount, setNotificationCount] = useState(0);
  const [openEntry, setOpenEntry] = useState(false);

  useEffect(() => {
    const loadNotificationCount = async () => {
      try {
        const res = await getAlerts();
        const data = res?.data ?? res ?? { reminders: [], expiry: [], lowStock: [] };
        const reminders = Array.isArray(data.reminders) ? data.reminders : [];
        const expiry = Array.isArray(data.expiry) ? data.expiry : [];
        const lowStock = Array.isArray(data.lowStock) ? data.lowStock : [];

        const countPending = (items) =>
          items.filter((alert) => !alert.status || alert.status === "PENDING").length;

        const count =
          countPending(reminders) + countPending(expiry) + countPending(lowStock);

        setNotificationCount(count);
      } catch (error) {
        console.error("Failed to load notification count", error);
      }
    };

    loadNotificationCount();
  }, []);

  const handleSaveMedicine = async (medicineData) => {
    try {
      const normalizedType =
        medicineData.type === "Prescription" ? "OTC" : medicineData.type || "OTC";

      const schedule = {
        morning: {
          enabled: !!medicineData.scheduleEnabled?.morning,
          time: medicineData.schedule?.morning || "08:00",
        },
        afternoon: {
          enabled: !!medicineData.scheduleEnabled?.afternoon,
          time: medicineData.schedule?.afternoon || "13:00",
        },
        evening: {
          enabled: !!medicineData.scheduleEnabled?.evening,
          time: medicineData.schedule?.evening || "18:00",
        },
        night: {
          enabled: !!medicineData.scheduleEnabled?.night,
          time: medicineData.schedule?.night || "22:00",
        },
      };

      await addMedicine({
        name: medicineData.name,
        brand: medicineData.brand || "",
        medicineType: normalizedType,
        dosage: medicineData.dosage || "",
        totalQuantity: Number(medicineData.totalQuantity),
        expiryDate: medicineData.expiryDate,
        lowStockThreshold: medicineData.lowStockThreshold || 5,
        schedule,
      });

      setOpenEntry(false);
      alert(`${medicineData.name} added successfully!`);
    } catch (error) {
      console.error("Error saving medicine:", error);
      alert("Failed to save medicine. Check console for details.");
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 lg:left-64 h-16 bg-white border-b z-30 flex items-center gap-3 px-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>

        {/* <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border text-sm outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="Search medicine..."
          />
        </div> */}
          <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="text"
                            placeholder="Search your medicine cabinet (Name, Symptoms, Active ingredients...)"
                            className="text-gray-400 w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors text-sm lg:text-base"
                            // value={searchQuery}
                            // onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenEntry(true)}
            // className="bg-sky-500 text-white px-4 py-2 rounded-xl hover:bg-sky-600 flex items-center gap-2"
            className="flex items-center justify-center gap-2 px-3 lg:px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg shadow-blue-200 text-sm lg:text-base"
          >
            <Plus size={18} />
            <span className="hidden sm:block">Add Medicine</span>
          </button>
          <NavLink
            to="/dashboard/alerts"
            className="relative flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </NavLink>
        </div>
      </header>

      {/* ✅ MODAL */}
      <EditMedicineModal
        medicine={null}
        isOpen={openEntry}
        onClose={() => setOpenEntry(false)}
        onSave={handleSaveMedicine}
        isEditing={false}
      />
    </>
  );
}








