import { Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-700">
        
      </h2>

      <div className="flex items-center gap-6">
        {/* 🔔 Notification */}
        <div className="relative cursor-pointer">
          <Bell size={20} className="text-gray-600" />

          {/* notification count */}
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            0
          </span>
        </div>

        {/* 👤 Account */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-700">
              C
            </div>
            <ChevronDown size={16} />
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Profile
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}







// export default function DashboardNavbar() {
//   return (
//     <header className="h-16 bg-white border-b flex items-center justify-between px-6">
//       <div />

//       <div className="flex items-center gap-4">
//         <span className="text-xl">🔔</span>

//         <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-medium">
//           C
//         </div>
//       </div>
//     </header>
//   );
// }