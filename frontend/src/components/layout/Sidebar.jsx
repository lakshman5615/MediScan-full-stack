// import logo from "../../assets/logo.png";
// import { Pill } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Home, Archive, Calendar, Bell, AlertTriangle, X } from "lucide-react";

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-full
          w-64
          bg-white border-r
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 ">
          <h1 className="font-semibold text-lg">Medicine App</h1>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* ===== LOGO SECTION ===== */}


      {/* <div className="flex items-center gap-3 px-4 py-5">
  <div className="bg-blue-600 text-white p-2 rounded-xl shadow">
    <Pill size={22} />
  </div>

  <span className="text-xl font-bold text-gray-800">
    Medi<span className="text-blue-600">Scan</span>
  </span>
</div> */}


{/* <div className="flex items-center justify-center ">
  <img
    src={logo}
    alt="MediScan Logo"
    className="h-20 w-auto object-contain"
  />
</div> */}


        {/* Menu */}
        <nav className="p-3 space-y-1">
          {[
            { to: "/dashboard", icon: Home, label: "Home" },
            { to: "/dashboard/cabinet", icon: Archive, label: "Cabinet" },
            { to: "/dashboard/schedule", icon: Calendar, label: "Schedule" },
            { to: "/dashboard/alerts", icon: Bell, label: "Alerts" },
          ].map(({ to, icon: Icon, label }) => (
            <NavLink
              key={label}
              to={to}
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl text-sm
                ${
                  isActive
                    ? "bg-sky-100 text-sky-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          <NavLink
            to="/dashboard/emergency"
            className="flex items-center gap-3 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50"
          >
            <AlertTriangle size={18} />
            Emergency
          </NavLink>
        </nav>
      </aside>
    </>
  );
}












// import { NavLink } from "react-router-dom";
// import {
//   Home,
//   Archive,
//   Calendar,
//   Bell,
//   AlertTriangle,
// } from "lucide-react";

// export default function Sidebar() {
//   return (
//       //  <aside className="  hidden lg:block w-64 bg-white border-r min-h-screen p-4"> 
//       <aside
//       className="
//         hidden lg:block
//         fixed top-0 left-0
//         w-64 h-screen
//         bg-white border-r
//         p-4
//         z-40
//       "
//     >
          
//       <h1 className="text-xl font-bold mb-8">Mediscan</h1>

//       <nav className="space-y-2">

//         <NavLink
//           to="/dashboard"
//           end
//           className={({ isActive }) =>
//             `flex items-center gap-3 px-4 py-2 rounded-xl ${
//               isActive
//                 ? "bg-sky-100 text-sky-600"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`
//           }
//         >
//           <Home size={18} className="text-sky-500" />
//           Home
//         </NavLink>

//         <NavLink
//           to="/dashboard/cabinet"
//           className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
//         >
//           <Archive size={18} />
//           Cabinet
//         </NavLink>

//         <NavLink
//           to="/dashboard/schedule"
//           className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
//         >
//           <Calendar size={18} />
//           Schedule
//         </NavLink>

//         <NavLink
//           to="/dashboard/alerts"
//           className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
//         >
//           <Bell size={18} />
//           Alerts
//         </NavLink>

//         <NavLink
//           to="/dashboard/emergency"
//           className="flex items-center gap-3 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50"
//         >
//           <AlertTriangle size={18} className="text-red-500" />
//           Emergency
//         </NavLink>

//       </nav>
//     </aside>
//   );
// }











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
