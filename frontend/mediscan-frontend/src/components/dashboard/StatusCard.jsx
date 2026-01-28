export default function StatusCard({ title, value, type }) {
  const border = {
    default: "border-gray-200",
    danger: "border-red-200",
    warning: "border-yellow-200",
  };

  const text = {
    default: "text-gray-800",
    danger: "text-red-600",
    warning: "text-yellow-600",
  };

  return (
    <div
      className={`bg-white border ${border[type || "default"]}
        rounded-xl p-6
        transform transition-all duration-300 ease-out
        hover:-translate-y-[2px] hover:scale-[1.015]
        hover:shadow-lg`}
    >
      <p className="text-sm text-gray-500 mb-3">
        {title}
      </p>

      <h2
        className={`text-3xl font-semibold ${text[type || "default"]}`}
      >
        {value}
      </h2>
    </div>
  );
}






// export default function StatusCard({ title, value, type }) {
//   const color =
//     type === "danger"
//       ? "text-red-600"
//       : type === "warning"
//       ? "text-yellow-500"
//       : "text-gray-700";

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-sm">
//       <p className={`${color} font-medium`}>{title}</p>
//       <h2 className="text-3xl font-bold mt-2">{value}</h2>
//     </div>
//   );
// }





// const StatusCard = ({ title, count, color }) => {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-sm">
//       <p className={`font-medium ${color}`}>{title}</p>
//       <h2 className="text-3xl font-bold mt-2">{count}</h2>
//     </div>
//   );
// };

// export default StatusCard;
