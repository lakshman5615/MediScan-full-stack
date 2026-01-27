import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

import Home from "../pages/dashboard/Home";
import Scan from "../pages/dashboard/Scan";
import Cabinet from "../pages/dashboard/Cabinet";
import Schedule from "../pages/dashboard/Schedule";
import Alerts from "../pages/dashboard/Alerts";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="scan" element={<Scan />} />
        <Route path="cabinet" element={<Cabinet />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="alerts" element={<Alerts />} />
      </Route>
    </Routes>
  );
}

