import {
  FaUser,
  FaCamera,
  FaPlusCircle,
  FaBell,
  FaCheck,
} from "react-icons/fa";

import mobileImg from "../../assets/images/mobile.png"; 

const steps = [
  {
    title: "Sign Up & Login",
    desc: "Create your secure account and login",
    icon: <FaUser />,
    color: "bg-blue-500",
  },
  {
    title: "Scan Medicine",
    desc: "Use camera to scan medicine instantly",
    icon: <FaCamera />,
    color: "bg-green-500",
  },
  {
    title: "Add to Cabinet",
    desc: "Save verified medicine details",
    icon: <FaPlusCircle />,
    color: "bg-purple-500",
  },
  {
    title: "Set Reminders",
    desc: "Get alerts so you never miss a dose",
    icon: <FaBell />,
    color: "bg-orange-500",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="w-full bg-gray-50 py-20"
    >
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mt-4">
          How MediScan Works
        </h2>
        <p className="text-gray-500 mt-2">
          Get started in just 4 simple steps
        </p>
      </div>

      {/* ICON STEPS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-center px-6">
        {steps.map((item, index) => (
          <div
            key={index}
            className="group transition"
          >
            {/* Circle Icon */}
            <div
              className={`w-16 h-16 mx-auto flex items-center justify-center
              rounded-full text-white text-2xl
              ${item.color}
              transition-all duration-300
              group-hover:scale-110`}
            >
              {item.icon}
            </div>

            <h3 className="mt-4 font-semibold text-gray-800">
              {item.title}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* BIG INFO BOX */}
      <div className="max-w-4xl mx-auto mt-20 bg-white rounded-2xl shadow-lg p-10 flex flex-col md:flex-row items-center gap-10">

        {/* LEFT CONTENT */}
        <div className="md:w-1/2">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Experience the Future of Medicine Management
          </h3>

          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center gap-2">
              <FaCheck className="text-green-500" />
              AI-Powered Recognition
            </li>
            <li className="flex items-center gap-2">
              <FaCheck className="text-green-500" />
              Cloud Sync & Secure Storage
            </li>
            <li className="flex items-center gap-2">
              <FaCheck className="text-green-500" />
              Smart Reminders & Alerts
            </li>
          </ul>
        </div>

        {/* RIGHT MOBILE IMAGE */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={mobileImg}
            alt="Mobile App"
            className="w-64 transition duration-500 hover:scale-105 hover:-rotate-2"
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;








// const HowItWorks = () => {
//   return (
//     <section
//       id="how-it-works"
//       className="w-full bg-gray-50 py-20 px-6"
//     >
//       {/* Heading */}
//       <div className="text-center mb-14">
//         <h2 className="text-3xl font-bold text-gray-800">
//           How MediScan Works
//         </h2>
//         <p className="text-gray-600 mt-2">
//           Get started in just 4 simple steps
//         </p>
//       </div>

//       {/* Steps */}
//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
//         {/* Step 1 */}
//         <div className="bg-white p-6 rounded-xl shadow text-center">
//           <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl font-bold">
//             1
//           </div>
//           <h3 className="mt-4 font-semibold text-lg">
//             Sign Up & Login
//           </h3>
//           <p className="text-gray-600 text-sm mt-2">
//             Create your account and access your personal medicine cabinet
//           </p>
//         </div>

//         {/* Step 2 */}
//         <div className="bg-white p-6 rounded-xl shadow text-center">
//           <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-green-100 text-green-600 text-xl font-bold">
//             2
//           </div>
//           <h3 className="mt-4 font-semibold text-lg">
//             Scan Medicine
//           </h3>
//           <p className="text-gray-600 text-sm mt-2">
//             Scan medicine strip or bottle using your camera
//           </p>
//         </div>

//         {/* Step 3 */}
//         <div className="bg-white p-6 rounded-xl shadow text-center">
//           <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xl font-bold">
//             3
//           </div>
//           <h3 className="mt-4 font-semibold text-lg">
//             Add to Cabinet
//           </h3>
//           <p className="text-gray-600 text-sm mt-2">
//             Save verified medicine details securely
//           </p>
//         </div>

//         {/* Step 4 */}
//         <div className="bg-white p-6 rounded-xl shadow text-center">
//           <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xl font-bold">
//             4
//           </div>
//           <h3 className="mt-4 font-semibold text-lg">
//             Set Reminders
//           </h3>
//           <p className="text-gray-600 text-sm mt-2">
//             Get reminders so you never miss a dose
//           </p>
//         </div>

//       </div>
//     </section>
//   );
// };

// export default HowItWorks;
