



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
import { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import EditMedicineModal from "../common/EditMedicineModal";
import { addMedicine } from "../../services/medicine.service";
import { getAlerts } from "../../services/alertApi";


export default function Navbar({ onMenuClick, searchQuery, onSearchChange }) {
  const [notificationCount, setNotificationCount] = useState(0);
  const [openEntry, setOpenEntry] = useState(false);

  const loadNotificationCount = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadNotificationCount();

    const intervalId = setInterval(loadNotificationCount, 10000);
    const handleMedicinesUpdated = () => loadNotificationCount();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadNotificationCount();
      }
    };

    window.addEventListener("medicines:updated", handleMedicinesUpdated);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("medicines:updated", handleMedicinesUpdated);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadNotificationCount]);

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

      window.dispatchEvent(new Event("medicines:updated"));
      await loadNotificationCount();
      setOpenEntry(false);
    } catch (error) {
      console.error("Error saving medicine:", error);
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

        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search your medicine cabinet"
              className="text-gray-900 w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors text-sm lg:text-base"
              value={searchQuery || ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
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









