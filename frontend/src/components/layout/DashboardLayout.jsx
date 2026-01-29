
// -------second right --------------------------

// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";
// import { Outlet } from "react-router-dom";

// export default function DashboardLayout() {
//   return (
// <div className="flex min-h-screen w-full">
      
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main area */}
// <div className="flex flex-1 flex-col bg-slate-100">
        
//         {/* Navbar */}
//         <Navbar />

//         {/* Scroll ONLY here */}
//         <main className="flex-1 p-4 sm:p-6 overflow-y-auto">

//           <Outlet />
//         </main>

//       </div>
//     </div>
//   );
// }


// import { useState } from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

// export default function DashboardLayout() {
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

//   return (
//     <div className="flex min-h-screen w-full overflow-x-hidden">


//       {/* Sidebar */}
//       <Sidebar
//         isOpen={mobileSidebarOpen}
//         closeSidebar={() => setMobileSidebarOpen(false)}
//       />

//       {/* Main area */}
//       <div className="flex flex-1 flex-col bg-slate-100 lg:ml-64
// ">

//         {/* Navbar */}
//         <Navbar onMenuClick={() => setMobileSidebarOpen(true)} />

//         {/* Page content */}
//         <main className="flex-1 overflow-y-auto px-3 pt-24 md:px-6 md:pt-24 min-w-0">

//           <Outlet />
//         </main>

//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-100">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Area */}
      <div className="lg:ml-64">
        {/* bg-gray-50 */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="pt-20 px-4 md:px-6 max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}




