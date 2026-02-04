

// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { ArrowLeft, Mail, Lock, PlusSquare } from "lucide-react";
// import { loginUser } from "../../services/authService";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("All fields are required");
//       return;
//     }
    
//     setLoading(true);
//     try {
//       const res = await loginUser(email, password);
//       localStorage.setItem("token", res.token);
//       localStorage.setItem("user", JSON.stringify(res.user));
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.message || "Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-100">
//       <div className="w-full max-w-xs bg-white rounded-2xl shadow-lg p-8 relative">
        
//         {/* Back button INSIDE card */}
//         <button
//           onClick={() => navigate(-1)}
//           className="absolute top-5 left-5 flex items-center gap-2 hover:text-cyan-600"
//         >
//           <ArrowLeft size={18} />
          
//         </button>

//         {/* Icon */}
//         <div className="flex justify-center mb-4 mt-6">
//           <div className="bg-cyan-100 p-3 rounded-xl">
//             <PlusSquare size={28} className="text-cyan-600" />
//           </div>
//         </div>

//         {/* Title */}
//         <h2 className="text-center text-2xl font-bold text-gray-800">
//           MediScan
//         </h2>

//         <p className="text-center text-gray-600 font-semibold mt-1 mb-6">
//           Welcome Back
//         </p>

//         {error && (
//           <div className="mb-4 text-sm text-red-700 bg-red-100 p-2 rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Email */}
//           <div className="relative">
//             <Mail
//               size={18}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             />
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm
//                          placeholder:text-gray-400 bg-gray-50
//                          focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <Lock
//               size={18}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             />
//             <input
//               type="password"
//               placeholder="Enter your password"
//               className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm
//                          placeholder:text-gray-400 bg-gray-50
//                          focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           {/* Login button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-lg text-white font-semibold transition ${
//               loading
//                 ? "bg-gray-400"
//                 : "bg-cyan-500 hover:bg-cyan-600"
//             }`}
//           >
//             {loading ? "Logging in..." : "Login →"}
//           </button>
//         </form>

//         {/* GAP after login */}
//         <div className="mt-6" />

//         {/* Signup link */}
//         <p className="text-center text-sm text-gray-600">
//           Don’t have an account?{" "}
//           <Link
//             to="/signup"
//             className="text-cyan-600 font-medium hover:underline"
//           >
//             Sign up for free
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;




import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

import AuthLayout from "../../components/layout/AuthLayout";
import MediScanIcon from "../../components/common/MediScanIcon";
import { loginUser } from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(email, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <MediScanIcon />

      <p className="text-center text-gray-600 font-semibold mt-1 mb-6">
        Welcome Back
      </p>

      {error && (
        <div className="mb-3 text-sm text-red-700 bg-red-100 p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full pl-10 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-cyan-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full pl-10 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-cyan-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-cyan-500 hover:bg-cyan-600"
          }`}
        >
          {loading ? "Logging in..." : "Login →"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-cyan-600 font-medium">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}


