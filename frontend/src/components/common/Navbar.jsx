// import { Link } from "react-router-dom";
// import logo from "../../assets/images/logo.png";

// const Navbar = () => {
//   return (
//     // <nav className="flex items-center px-10 py-4 bg-white shadow">
//     <nav className="flex items-center px-10 h-16 bg-white shadow">
      
//       {/* Logo - Left */}
//        <div className="flex items-center space-x-2">
//         <img
//           src={logo}
//           alt="MediScan Logo"
//           className="w-14 h-14 object-contain"
//         />
//         {/* <h1 className="text-xl font-bold text-blue-600">
//           MediScan
//         </h1> */}
//       </div>


//       {/* Push everything to right */}
//       <div className="ml-auto flex items-center space-x-8 text-gray-700 font-medium">
        
//         {/* Page Links */}
//         <a href="#home" className="hover:text-blue-600">
//           Home
//         </a>
//         <a href="#features" className="hover:text-blue-600">
//           Features
//         </a>
//         <a href="#how-it-works" className="hover:text-blue-600">
//           How It Works
//         </a>

//         {/* Divider */}
//         <span className="h-6 w-px bg-gray-300"></span>

//         {/* Auth Buttons */}
//         <Link
//           to="/login"
//           className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
//         >
//           Login
//         </Link>

//         <Link
//           to="/signup"
//           className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
//         >
//           Sign Up
//         </Link>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/images/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow">
      <div className="flex items-center justify-between h-16 px-4 md:px-10">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="MediScan Logo"
            className="w-10 h-10 md:w-14 md:h-14 object-contain"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 md:space-x-8 text-gray-700 font-medium">
          <a href="#home" className="hover:text-blue-600">Home</a>
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600">How It Works</a>
          <span className="h-6 w-px bg-gray-300"></span>
          <Link
            to="/login"
            className="px-3 py-1.5 sm:px-4 sm:py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-3 py-1.5 sm:px-4 sm:py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Side Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-48 sm:w-56 bg-white shadow-lg transform transition-transform duration-300 md:hidden z-50 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col px-5 py-8 space-y-5 text-gray-700 font-medium">
          <a href="#home" onClick={() => setOpen(false)}>Home</a>
          <a href="#features" onClick={() => setOpen(false)}>Features</a>
          <a href="#how-it-works" onClick={() => setOpen(false)}>How It Works</a>
          <Link
            to="/login"
            className="px-3 py-2 border border-blue-600 text-blue-600 rounded text-center hover:bg-blue-50 transition"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-3 py-2 border border-blue-600 text-blue-600 rounded text-center hover:bg-blue-50 transition"
            onClick={() => setOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Overlay when drawer is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;



