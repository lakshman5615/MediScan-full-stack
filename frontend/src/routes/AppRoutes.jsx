

import { Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage"; 
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";

import DashboardLayout from "../pages/Dashboard/DashboardLayout";
// import Home from "../pages/Dashboard/Home";
// import Scan from "../pages/Dashboard/Scan";
import Cabinet from "../pages/Dashboard/Cabinet";



export default function AppRoutes() {
  return (  
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* <Route index element={<Home />} /> */}
        {/* <Route path="scan" element={<Scan />} /> */}
         <Route path="cabinet" element={<Cabinet />} />
      </Route>
    </Routes>
  );
}

