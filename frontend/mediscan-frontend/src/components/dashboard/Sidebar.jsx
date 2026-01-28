import { NavLink } from "react-router-dom";
import {
  Home,
  Camera,
  Archive,
  Bell,
  AlertTriangle,
} from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home size={18} />,
    },
    {
      name: "Scan Medicine",
      path: "/dashboard/scan",
      icon: <Camera size={18} />,
    },
    {
      name: "Cabinet",
      path: "/dashboard/cabinet",
      icon: <Archive size={18} />,
    },
    {
      name: "Alerts",
      path: "/dashboard/alerts",
      icon: <Bell size={18} />,
    },
    {
      name: "Emergency",
      path: "/dashboard/emergency",
      icon: <AlertTriangle size={18} />,
      // danger: true,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-5 ">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
          M
        </div>
        <h1 className="text-xl text-gray-600 font-bold">MediScan</h1>
      </div>

      {/* Menu */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : item.danger
                  ? "text-red-500 hover:bg-red-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}







// import { NavLink } from "react-router-dom";

// export default function Sidebar() {
//   return (
//     <aside className="w-64 bg-white border-r min-h-screen p-5">
//       <div className="flex items-center gap-2 mb-8">
//         <div className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
//           M
//         </div>
//         <h1 className="text-xl text-gray-600 font-bold">MediScan</h1>
//       </div>

//       <nav className="space-y-2">
//         {[
//           { name: "Dashboard", path: "/dashboard" },
//           { name: "Scan Medicine", path: "/dashboard/scan" },
//           { name: "Cabinet", path: "/dashboard/cabinet" },
//           { name: "Alerts", path: "/dashboard/alerts" },
//           { name: "Emergency", path: "/dashboard/emergency", danger: true },
//         ].map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.path}
//             end
//             className={({ isActive }) =>
//               `block px-4 py-2 rounded-lg ${
//                 isActive
//                   ? "bg-blue-50 text-blue-600 font-medium"
//                   : item.danger
//                   ? "text-red-500 hover:bg-red-50"
//                   : "text-gray-600 hover:bg-gray-100"
//               }`
//             }
//           >
//             {item.name}
//           </NavLink>
//         ))}
//       </nav>
//     </aside>
//   );
// }