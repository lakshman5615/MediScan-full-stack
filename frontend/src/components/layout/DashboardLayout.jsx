// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import TopNavbar from "./Navbar";

// export default function DashboardLayout() {
//   return (
//     <div className="flex h-screen bg-slate-100 overflow-hidden">

//       {/* SIDEBAR – FIXED */}
//       <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r z-40">
//         <Sidebar />
//       </aside>

//       {/* MAIN AREA */}
//       <div className="ml-64 flex flex-1 flex-col">

//         {/* NAVBAR – FIXED */}
//         <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b z-30">
//           <TopNavbar />
//         </header>

//         {/* PAGE CONTENT – SCROLLABLE */}
//         <main 
//         className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-6">
//           <Outlet />
//         </main>

//       </div>
//     </div>
//   );
// }


import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
        <Navbar />

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}






