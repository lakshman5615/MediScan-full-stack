import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition"
    >
      <ArrowLeft size={20} />
      {label}
    </button>
  );
};

export default BackButton;
