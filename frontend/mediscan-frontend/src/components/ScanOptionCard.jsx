const ScanOptionCard = ({ icon, title }) => {
  return (
    <div className="border rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md transition">
      
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
        {icon}
      </div>

      <p className="font-medium">{title}</p>

    </div>
  );
};

export default ScanOptionCard;
