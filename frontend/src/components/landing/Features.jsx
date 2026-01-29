import {
  FaCamera,
  FaShieldAlt,
  FaInfoCircle,
  FaCapsules,
  FaBell,
  FaLock,
} from "react-icons/fa";

const features = [
  {
    title: "Smart Scanning",
    desc: "Instantly scan medicine packages using your phone camera with high accuracy.",
    icon: <FaCamera />,
    bg: "bg-blue-50",
    iconBg: "bg-blue-500",
  },
  {
    title: "Expiry Verification",
    desc: "Automatically detects and verifies expiry dates to keep you safe.",
    icon: <FaShieldAlt />,
    bg: "bg-green-50",
    iconBg: "bg-green-500",
  },
  {
    title: "Detailed Information",
    desc: "Get usage, dosage, side effects and drug interaction details.",
    icon: <FaInfoCircle />,
    bg: "bg-purple-50",
    iconBg: "bg-purple-500",
  },
  {
    title: "Medicine Cabinet",
    desc: "Store and manage all medicines digitally in one secure place.",
    icon: <FaCapsules />,
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-500",
  },
  {
    title: "Smart Reminders",
    desc: "Never miss a dose with custom medicine reminders.",
    icon: <FaBell />,
    bg: "bg-red-50",
    iconBg: "bg-red-500",
  },
  {
    title: "Secure & Private",
    desc: "Your health data is protected with secure authentication.",
    icon: <FaLock />,
    bg: "bg-teal-50",
    iconBg: "bg-teal-500",
  },
];
   



// const Features = () => {
//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Heading */}
//         <div className="text-center mb-12">
//           {/* <p className="text-sm font-semibold text-blue-600">
//             Key Features
//           </p> */}
//           <h2 className="text-3xl font-bold text-gray-800 mt-2">
//             Everything You Need in One App
//           </h2>
//           <p className="text-gray-500 mt-3">
//             MediScan combines AI technology with easy medicine management
//           </p>
//         </div>

      const Features = () => {
  return (
    <section id="features" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            Everything You Need in One App
          </h2>
          <p className="text-gray-500 mt-3">
            MediScan combines AI technology with easy medicine management
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${item.bg} hover:shadow-lg transition`}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg text-white text-xl ${item.iconBg}`}
              >
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mt-4 text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600 mt-2 text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
