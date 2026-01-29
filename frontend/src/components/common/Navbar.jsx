import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const Navbar = () => {
  return (
    // <nav className="flex items-center px-10 py-4 bg-white shadow">
    <nav className="flex items-center px-10 h-16 bg-white shadow">
      
      {/* Logo - Left */}
       <div className="flex items-center space-x-2">
        <img
          src={logo}
          alt="MediScan Logo"
          className="w-14 h-14 object-contain"
        />
        {/* <h1 className="text-xl font-bold text-blue-600">
          MediScan
        </h1> */}
      </div>


      {/* Push everything to right */}
      <div className="ml-auto flex items-center space-x-8 text-gray-700 font-medium">
        
        {/* Page Links */}
        <a href="#home" className="hover:text-blue-600">
          Home
        </a>
        <a href="#features" className="hover:text-blue-600">
          Features
        </a>
        <a href="#how-it-works" className="hover:text-blue-600">
          How It Works
        </a>

        {/* Divider */}
        <span className="h-6 w-px bg-gray-300"></span>

        {/* Auth Buttons */}
        <Link
          to="/login"
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
