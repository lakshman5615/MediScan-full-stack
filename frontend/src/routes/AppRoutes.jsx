
// import { Routes, Route } from "react-router-dom";

// import LandingPage from "../pages/Landing/LandingPage"; 
// import Login from "../pages/Auth/Login";
// import Signup from "../pages/Auth/Signup";

// import DashboardLayout from "../components/layout/DashboardLayout";

// import Home from "../pages/Dashboard/Home";
// import Scan from "../pages/Dashboard/Scan";
// import Cabinet from "../pages/Dashboard/Cabinet";
// import Schedule from "../pages/Dashboard/Schedule";
// import Alerts from "../pages/Dashboard/Alerts";

// import { CabinetProvider } from "../context/CabinetContext";

// export default function AppRoutes() {
//   return (
//     <CabinetProvider>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         {/* Dashboard Routes */}
//         <Route path="/dashboard" element={<DashboardLayout />}>
//           <Route index element={<Home />} />
//           <Route path="scan" element={<Scan />} />
//           <Route path="cabinet" element={<Cabinet />} />
//           <Route path="schedule" element={<Schedule />} />
//           <Route path="alerts" element={<Alerts />} />
//         </Route>
//       </Routes>
//     </CabinetProvider>
//   );
// }


// import { Routes, Route, Navigate } from "react-router-dom";

// import LandingPage from "../pages/Landing/LandingPage";
// import Login from "../pages/Auth/Login";
// import Signup from "../pages/Auth/Signup";

// import DashboardLayout from "../components/layout/DashboardLayout";
// import BlankLayout from "../components/layout/BlankLayout";

// import Home from "../pages/Dashboard/Home";
// import Scan from "../pages/Dashboard/Scan";
// import Cabinet from "../pages/Dashboard/Cabinet";
// import Schedule from "../pages/dashboard/Schedule";
// import Alerts from "../pages/Dashboard/Alerts";
// import AIExplanation from "../pages/Dashboard/AIExplanation";

// import { CabinetProvider } from "../context/CabinetContext";
// import { AIProvider } from "../context/AIContext";

// export default function AppRoutes() {
//   return (
//     <AIProvider>
//       <CabinetProvider>
//         <Routes>
//           {/* Landing */}
//           <Route path="/" element={<LandingPage />} />

//           {/* Auth */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />

//           {/* Dashboard WITH layout */}
//           <Route path="/dashboard" element={<DashboardLayout />}>
//             <Route index element={<Home />} />
//             <Route path="scan" element={<Scan />} />
//             <Route path="cabinet" element={<Cabinet />} />
//             <Route path="alerts" element={<Alerts />} />
//           </Route>

//           {/* Pages WITHOUT sidebar */}
//           <Route element={<BlankLayout />}>
//             <Route path="/dashboard/schedule" element={<Schedule />} />
           
//             <Route
//               path="/dashboard/ai-explanation"
//               element={<AIExplanation />}
//             />
//           </Route>

//           {/* Fallback */}
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </CabinetProvider>
//     </AIProvider>
//   );
// }




import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";

import DashboardLayout from "../components/layout/DashboardLayout";
import BlankLayout from "../components/layout/BlankLayout";

import Home from "../pages/Dashboard/Home";
import Scan from "../pages/Dashboard/Scan";
import Cabinet from "../pages/Dashboard/Cabinet";
import Schedule from "../pages/Dashboard/Schedule";
import Alerts from "../pages/Dashboard/Alerts";
import Emergency from "../pages/Dashboard/Emergency";
import AIExplanation from "../pages/Dashboard/AIExplanation";

import ProtectedRoute from "./ProtectedRoute";
import { CabinetProvider } from "../context/CabinetContext";
import { AIProvider } from "../context/AIContext";

export default function AppRoutes() {
  return (
    <AIProvider>
    <CabinetProvider>
      <Routes>
        {/* ================= LANDING ================= */}
        <Route path="/" element={<LandingPage />} />

        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard Routes with Sidebar */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="scan" element={<Scan />} />
          <Route path="schedule" element={<Schedule />} />
        </Route>

        {/* Routes without common sidebar */}
        <Route path="/dashboard/cabinet" element={<Cabinet />} />
        <Route path="/dashboard/alerts" element={<Alerts />} />
<Route path="/dashboard/emergency" element={<Emergency />} />
        {/* ================= DASHBOARD (PROTECTED) ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="scan" element={<Scan />} />
          <Route path="cabinet" element={<Cabinet />} />
          <Route path="alerts" element={<Alerts />} />
        </Route>

        {/* ================= BLANK LAYOUT ================= */}
        {/* ❗ ai-explanation guest + logged dono ke liye */}
        <Route element={<BlankLayout />}>
          <Route path="/dashboard/schedule" element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          } />

          <Route
            path="/dashboard/ai-explanation"
            element={<AIExplanation />}
          />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CabinetProvider>
  </AIProvider>
  );
}
