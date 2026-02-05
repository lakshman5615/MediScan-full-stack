import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Calendar } from "lucide-react";

import AuthLayout from "../../components/layout/AuthLayout";
import MediScanIcon from "../../components/common/MediScanIcon";
import { signupUser } from "../../services/authApi";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !mobile || !age || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await signupUser(
        name,
        email,
        
        Number(age),
        password,
        mobile.trim(),
      );

      // 🔐 SAME AS LOGIN
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));


      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <MediScanIcon />

      <p className="text-center text-gray-500 text-sm mt-1 mb-5">
        Create your account
      </p>

      {error && (
        <div className="mb-3 text-sm text-red-700 bg-red-100 p-2 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input icon={User} placeholder="User Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input icon={Mail} placeholder="Email " value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input icon={Mail} placeholder="Mobile " value={mobile} onChange={(e) => setMobile(e.target.value)} />

        <Input icon={Calendar} type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        <Input icon={Lock} type="password" placeholder="Set Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input icon={Lock} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-11 mt-3 rounded-xl text-white font-medium ${
            loading ? "bg-gray-400" : "bg-cyan-500 hover:bg-cyan-600"
          }`}
        >
          {loading ? "Creating account..." : "Sign Up →"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-cyan-500 font-medium">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

/* 🔹 same reusable input */
function Input({ icon: Icon, ...props }) {
  return (
    <div className="flex items-center border rounded-xl px-3 h-11 bg-white focus-within:ring-2 focus-within:ring-cyan-400">
      <Icon size={17} className="text-gray-400" />
      <input
        {...props}
        className="w-full ml-3 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
      />
    </div>
  );
}













// // import BackButton from "../../components/common/BackButton";
// import { useState } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// import { signupUser } from "../../services/authService";


// import { Link, useNavigate } from "react-router-dom";
// import { ArrowLeft, Mail, Lock, User, Calendar, PlusSquare  } from "lucide-react";

// export default function Signup() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
//       {/* Card */}
//       <div className="relative w-full max-w-[360px] bg-white rounded-2xl shadow-md px-6 py-6">
        
//         {/* Back */}
//         <button
//           onClick={() => navigate(-1)}
//           className="absolute left-4 top-4 text-gray-500 hover:text-gray-700"
//         >
//           <ArrowLeft size={20} />
//         </button>

//         {/* Icon (same style as MediScan) */}
//         <div className="flex justify-center mb-3">
//           <div className="h-14 w-14 rounded-xl bg-cyan-100 flex items-center justify-center">
//             <PlusSquare size={26} className="text-cyan-600" />
//           </div>
//         </div>

//         {/* Title */}
//         <h2 className="text-center text-2xl font-bold text-gray-800">
//           MediScan
//         </h2>
//         <p className="text-center text-gray-500 text-sm mt-1 mb-5">
//           Create your account
//         </p>

//         {/* Form */}
//         <form className="space-y-3">
          
//           {/* Username */}
//           <div className="flex items-center border rounded-xl px-3 h-10">
//             <User size={17} className="text-gray-400" />
//             <input
//               type="text"
//               placeholder="User Name"
//               className="w-full ml-3 outline-none text-sm placeholder:text-gray-400"
//             />
//           </div>

//           {/* Email */}
//           <div className="flex items-center border rounded-xl px-3 h-10">
//             <Mail size={17} className="text-gray-400" />
//             <input
//               type="text"
//               placeholder="Email / Mobile"
//               className="w-full ml-3 outline-none text-sm placeholder:text-gray-400"
//             />
//           </div>

//           {/* Age */}
//           <div className="flex items-center border rounded-xl px-3 h-10">
//             <Calendar size={17} className="text-gray-400" />
//             <input
//               type="number"
//               placeholder="Age"
//               className="w-full ml-3 outline-none text-sm placeholder:text-gray-400"
//             />
//           </div>

//           {/* Password */}
//           <div className="flex items-center border rounded-xl px-3 h-10">
//             <Lock size={17} className="text-gray-400" />
//             <input
//               type="password"
//               placeholder="Set Password"
//               className="w-full ml-3 outline-none text-sm placeholder:text-gray-400"
//             />
//           </div>

//           {/* Confirm Password */}
//           <div className="flex items-center border rounded-xl px-3 h-10">
//             <Lock size={17} className="text-gray-400" />
//             <input
//               type="password"
//               placeholder="Confirm Password"
//               className="w-full ml-3 outline-none text-sm placeholder:text-gray-400"
//             />
//           </div>

//           {/* Button */}
//           <button
//             type="submit"
//             className="w-full h-11 mt-3 rounded-xl bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition"
//           >
//             Sign Up →
//           </button>
//         </form>

//         {/* Footer */}
//         <p className="mt-4 text-center text-sm text-gray-600">
//           Already have an account?{" "}
//           <Link to="/login" className="text-cyan-500 font-medium">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }




