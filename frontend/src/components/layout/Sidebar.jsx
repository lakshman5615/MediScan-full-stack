// import logo from "../../assets/logo.png";
// import { Pill } from "lucide-react";
// import { NavLink } from "react-router-dom";
// import { Home, Archive, Calendar, Bell, AlertTriangle, X } from "lucide-react";

// export default function Sidebar({ open, setOpen }) {
//   return (
//     <>
//       {/* Overlay */}
//       {open && (
//         <div
//           onClick={() => setOpen(false)}
//           className="fixed inset-0 bg-black/40 z-40 lg:hidden"
//         />
//       )}

//       <aside
//         className={`
//           fixed top-0 left-0 z-50
//           h-full
//           w-64
//           bg-white border-r
//           transform transition-transform duration-300
//           ${open ? "translate-x-0" : "-translate-x-full"}
//           lg:translate-x-0
//         `}
//       >
//         {/* Header */}
//         <div className="h-16 flex items-center justify-between px-4 ">
//           <h1 className="font-semibold text-lg">Medicine App</h1>
//           <button
//             onClick={() => setOpen(false)}
//             className="lg:hidden p-2 rounded hover:bg-gray-100"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* ===== LOGO SECTION ===== */}


//       {/* <div className="flex items-center gap-3 px-4 py-5">
//   <div className="bg-blue-600 text-white p-2 rounded-xl shadow">
//     <Pill size={22} />
//   </div>

//   <span className="text-xl font-bold text-gray-800">
//     Medi<span className="text-blue-600">Scan</span>
//   </span>
// </div> */}


// {/* <div className="flex items-center justify-center ">
//   <img
//     src={logo}
//     alt="MediScan Logo"
//     className="h-20 w-auto object-contain"
//   />
// </div> */}


//         {/* Menu */}
//         <nav className="p-3 space-y-1">
//           {[
//             { to: "/dashboard", icon: Home, label: "Home" },
//             { to: "/dashboard/cabinet", icon: Archive, label: "Cabinet" },
//             { to: "/dashboard/schedule", icon: Calendar, label: "Schedule" },
//             { to: "/dashboard/alerts", icon: Bell, label: "Alerts" },
//           ].map(({ to, icon: Icon, label }) => (
//             <NavLink
//               key={label}
//               to={to}
//               end
//               onClick={() => setOpen(false)}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-4 py-2 rounded-xl text-sm
//                 ${
//                   isActive
//                     ? "bg-sky-100 text-sky-600"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`
//               }
//             >
//               <Icon size={18} />
//               {label}
//             </NavLink>
//           ))}

//           <NavLink
//             to="/dashboard/emergency"
//             className="flex items-center gap-3 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50"
//           >
//             <AlertTriangle size={18} />
//             Emergency
//           </NavLink>
//         </nav>
//       </aside>
//     </>
//   );
// }




import { getProfile } from "../../services/authApi";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Archive,
  Calendar,
  Bell,
  AlertTriangle,
  X,
  ChevronDown,
  LogOut,
  UserCircle,
} from "lucide-react";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [openAccount, setOpenAccount] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);


  // const user = {
  //   name: "Alex Johnson",
  //   email: "alex@gmail.com",
  // };

  /* ===== BODY SCROLL LOCK ===== */

  useEffect(() => {
    if (openProfile || openLogoutConfirm) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [openProfile, openLogoutConfirm]);



  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      console.log("PROFILE 👉", res.data);

      // ⚠️ backend ke response ke hisaab se
      setUser(res.data.user || res.data);
    } catch (err) {
      console.error("Profile fetch failed", err);
      navigate("/login");
    } finally {
      setLoadingUser(false);
    }
  };

  fetchProfile();
}, []);


  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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
          h-full w-64 bg-white border-r
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4">
          <h1 className="font-semibold text-lg text-gray-800">
            Medicine App
          </h1>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 rounded hover:bg-sky-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="p-3 space-y-1 flex-1">
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
                `flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition
                ${isActive
                  ? "bg-sky-100 text-sky-600"
                  : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          <NavLink
            to="/dashboard/emergency"
            className="flex items-center gap-3 px-4 py-2 rounded-xl
                       text-red-600 hover:bg-red-50 transition"
          >
            <AlertTriangle size={18} />
            Emergency
          </NavLink>
        </nav>

        {/* ACCOUNT */}
        <div className="border-t p-3 relative">
          <button
            onClick={() => setOpenAccount(!openAccount)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl
             hover:bg-sky-50 focus:bg-sky-50 active:bg-sky-100
             focus:outline-none transition"
          >
            <div className="h-9 w-9 rounded-full bg-sky-500 text-white
                            flex items-center justify-center font-semibold">
              {user?.name?.[0] || "U"}
            </div>

            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-800">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || ""}</p>
            </div>

            <ChevronDown size={16} />
          </button>

          {/* Dropdown */}
          {openAccount && (
            <div className="absolute bottom-16 left-3 right-3
                            bg-white  rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => {
                  setOpenProfile(true);
                  setOpenAccount(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm
             text-gray-700 hover:bg-sky-50 focus:bg-sky-50
             active:bg-sky-100 focus:outline-none transition"
              >
                <UserCircle size={16} />
                Profile
              </button>

              <button
                onClick={() => {
                  setOpenLogoutConfirm(true);
                  setOpenAccount(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm
             text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={16} />
                Logout
              </button>


              {/* <button
                onClick={handleLogout}
                 className="w-full flex items-center gap-2 px-4 py-2 text-sm
             text-red-600 hover:bg-sky-50 focus:bg-red-50
             active:bg-red-100 focus:outline-none transition"
              >
                <LogOut size={16} />
                Logout
              </button> */}
            </div>
          )}
        </div>
      </aside>

      {/* PROFILE MODAL */}


     {openProfile && (
  <div className="fixed inset-0 bg-sky-50/80 backdrop-blur-sm flex items-center justify-center z-[60]">
    <div className="bg-white w-[420px] rounded-2xl p-6 shadow-xl relative">

      {/* Close */}
      <button
        onClick={() => setOpenProfile(false)}
        className="absolute top-3 right-3 p-1 rounded hover:bg-sky-100"
      >
        <X size={18} />
      </button>

      {/* Avatar */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="h-20 w-20 rounded-full bg-sky-500 text-white flex items-center justify-center text-2xl font-bold">
          {user?.name?.[0]}
        </div>
        <p className="text-sm text-gray-500">User Profile</p>
      </div>

      {/* PROFILE INFO */}
      <div className="space-y-4">

        {/* Name */}
        <div>
          <p className="text-sm font-medium text-gray-700">Full Name</p>
          <p className="mt-1 px-4 py-2 rounded-xl bg-sky-50 text-gray-600">
            {user?.name || "—"}
          </p>
        </div>

        {/* Email */}
        <div>
          <p className="text-sm font-medium text-gray-700">Email</p>
          <p className="mt-1 px-4 py-2 rounded-xl bg-sky-50 text-gray-600">
            {user?.email || "—"}
          </p>
        </div>

        {/* Phone */}
        <div>
          <p className="text-sm font-medium text-gray-700">Phone</p>
          <p className="mt-1 px-4 py-2 rounded-xl bg-sky-50 text-gray-600">
            {user?.phone || "Not provided"}
          </p>
        </div>

        {/* Age */}
        <div>
          <p className="text-sm font-medium text-gray-700">Age</p>
          <p className="mt-1 px-4 py-2 rounded-xl bg-sky-50 text-gray-600">
            {user?.age ? `${user.age} years` : "—"}
          </p>
        </div>

      </div>

      {/* Footer */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setOpenProfile(false)}
          className="px-6 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}


      {/* ===== LOGOUT CONFIRM MODAL ===== */}
{openLogoutConfirm && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[70]">
    <div className="bg-white w-80 rounded-2xl p-6 shadow-xl text-center">

      <h2 className="text-lg font-semibold text-gray-800">
        Confirm Logout
      </h2>

      <p className="text-sm text-gray-500 mt-2">
        Are you sure you want to logout?
      </p>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setOpenLogoutConfirm(false)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={handleLogout}
          className="flex-1 px-4 py-2 rounded-xl
                     bg-red-600 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
)}


    </>
  );
}




