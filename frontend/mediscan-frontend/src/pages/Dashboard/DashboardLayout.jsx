
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import DashboardNavbar from "../../components/dashboard/DashboardNavbar";

export default function DashboardLayout() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex-1 flex flex-col">
        <DashboardNavbar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}










