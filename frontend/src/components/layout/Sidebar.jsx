import { NavLink } from "react-router-dom";
import {
  Home,
  Archive,
  Calendar,
  Bell,
  AlertTriangle,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <h1 className="text-xl font-bold mb-8">Mediscan</h1>

      <nav className="space-y-2">

        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-xl ${
              isActive
                ? "bg-sky-100 text-sky-600"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <Home size={18} className="text-sky-500" />
          Home
        </NavLink>

        <NavLink
          to="/dashboard/cabinet"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
        >
          <Archive size={18} />
          Cabinet
        </NavLink>

        <NavLink
          to="/dashboard/schedule"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
        >
          <Calendar size={18} />
          Schedule
        </NavLink>

        <NavLink
          to="/dashboard/alerts"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
        >
          <Bell size={18} />
          Alerts
        </NavLink>

        <NavLink
          to="/dashboard/emergency"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50"
        >
          <AlertTriangle size={18} className="text-red-500" />
          Emergency
        </NavLink>

      </nav>
    </aside>
  );
}











// // import logo from "@/assets/images/logo.png";

// const Sidebar = () => {
//   return (
//     <aside className="w-[260px] bg-white border-r flex flex-col justify-between">
//       <div>
//         <div className="px-6 py-5 flex items-center gap-2">
//           {/* <img src={logo} className="w-8 h-8" /> */}
//           <span className="font-semibold text-lg">Mediscan</span>
//         </div>

//         <nav className="px-3 space-y-1">
//           {["Home", "Cabinet", "Schedule", "Alerts"].map((item) => (
//             <div
//               key={item}
//               className={`px-4 py-3 rounded-xl text-sm font-medium  cursor-pointer ${
//                 item === "Home"
//                   ? "bg-[#E6F7FB] text-primary"
//                   : "text-muted hover:bg-soft"
//                 //   "text-gray-500 hover:bg-gray-100"
//               }`}
//             >
//               {item}
//             </div>
//           ))}

//           <div className="px-4 py-3 text-sm text-red-500">
//             Emergency
//           </div>
//         </nav>
//       </div>

//       <div className="px-6 py-4 text-xs text-gray-500">
//         Alex Johnson <br />
//         <span className="text-[11px]">Pro Member</span>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;




// import { NavLink } from "react-router-dom";

// export default function Sidebar() {
//   return (
//     <aside className="w-64 bg-white shadow p-6">
//       <h2 className="text-2xl font-bold mb-8">Mediscan</h2>

//       <nav className="flex flex-col gap-4 text-gray-600">
//         <NavLink to="/dashboard">Home</NavLink>
//         <NavLink to="/dashboard/scan">Scan</NavLink>
//         <NavLink to="/dashboard/alerts">Alerts</NavLink>
//       </nav>
//     </aside>
//   );
// }
