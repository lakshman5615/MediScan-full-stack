import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="relative w-full max-w-[360px] bg-white rounded-2xl shadow-lg px-6 py-6">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className=" absolute left-4 top-4 bg-transparent p-0 border-0 shadow-none outline-none text-gray-600 hover:text-cyan-500
                      focus:outline-none focus:ring-0 active:bg-transparent transition-colors
  "
        >
          <ArrowLeft size={20} />
        </button>

        {children}
      </div>
    </div>
  );
}
