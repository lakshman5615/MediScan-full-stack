import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../../services/authService";

const Signup = () => {
  const [name, setName] = useState("");
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Frontend validation
    if (!name || !emailOrMobile || !age || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await signupUser({
        name: name,
        email: emailOrMobile, // authService email expect karta hai
        age: age,
        password: password,
      });

      alert("Signup successful! Please login.");
      // navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
  <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
      Sign Up to MediScan
    </h2>

    {error && (
      <div className="mb-4 text-sm text-red-700 bg-red-100 p-2 rounded">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="User Name"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Email / Mobile"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={emailOrMobile}
        onChange={(e) => setEmailOrMobile(e.target.value)}
      />

      <input
        type="number"
        placeholder="Age"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <input
        type="password"
        placeholder="Set Password"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white font-semibold ${
          loading
            ? "bg-gray-400"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>

    <p className="mt-4 text-center text-sm text-gray-600">
      Already have an account?{" "}
      <Link to="/login" className="text-blue-600 font-medium hover:underline">
        Login
      </Link>
    </p>
  </div>
</div>

    // <div className="fixed inset-0 flex items-center justify-center bg-slate-100">
    //   <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-lg">
    //     <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
    //       Sign Up
    //     </h2>

    //     {/* Error Message */}
    //     {error && (
    //       <div className="mb-6 text-sm text-red-700 bg-red-100 p-3 rounded">
    //         {error}
    //       </div>
    //     )}

    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       <input
    //         type="text"
    //         placeholder="User Name"
    //         className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    //         value={name}
    //         onChange={(e) => setName(e.target.value)}
    //       />

    //       <input
    //         type="text"
    //         placeholder="Email / Mobile"
    //         className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    //         value={emailOrMobile}
    //         onChange={(e) => setEmailOrMobile(e.target.value)}
    //       />

    //       <input
    //         type="number"
    //         placeholder="Age"
    //         className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    //         value={age}
    //         onChange={(e) => setAge(e.target.value)}
    //       />

    //       <input
    //         type="password"
    //         placeholder="Set Password"
    //         className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //       />

    //       <input
    //         type="password"
    //         placeholder="Confirm Password"
    //         className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    //         value={confirmPassword}
    //         onChange={(e) => setConfirmPassword(e.target.value)}
    //       />

    //       <button
    //         type="submit"
    //         disabled={loading}
    //         className={`w-full py-3 rounded-lg text-white font-semibold ${
    //           loading
    //             ? "bg-gray-400 cursor-not-allowed"
    //             : "bg-blue-600 hover:bg-blue-700"
    //         }`}
    //       >
    //         {loading ? "Signing up..." : "Sign Up"}
    //       </button>
    //     </form>

    //     {/* Login Navigation */}
    //     <p className="mt-6 text-center text-sm text-gray-600">
    //       Already have an account?{" "}
    //       <Link
    //         to="/login"
    //         className="text-blue-600 font-medium hover:underline"
    //       >
    //         Login
    //       </Link>
    //     </p>
    //   </div>
    // </div>
  );
};

export default Signup;
