import { FaShieldAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900  ">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Logo + About */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaShieldAlt className="text-blue-600 text-2xl" />
            <h2 className="text-xl font-semibold text-white">
              MediScan
            </h2>
          </div>
          <p className="text-gray-300 text-sm">
            Your AI-powered partner in safe and smart medicine management.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="hover:text-blue-400 cursor-pointer">Home</li>
            <li className="hover:text-blue-400 cursor-pointer">Features</li>
            <li className="hover:text-blue-400 cursor-pointer">How It Works</li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Account
          </h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="hover:text-blue-400 cursor-pointer">
              Login
            </li>
            <li className="hover:text-blue-400 cursor-pointer">
              Sign Up
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-300 bg-gray-950">
        © 2024 MediScan. All rights reserved · Privacy Policy
      </div>
    </footer>
  );
};

export default Footer;
