// import StatusCard from "../../components/dashboard/StatusCard";
// import FeatureCard from "../../components/dashboard/FeatureCard";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// import scanBg from "../../assets/images/scan-bg.jpg";
// import scanMain from "../../assets/images/scan-main.png";



// import {
//   Camera,
//   ShieldCheck,
//   Info,
//   Lock,
// } from "lucide-react";

// export default function Home() {
//   const navigate = useNavigate();
//   return (
//     <div className="space-y-16">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-semibold text-gray-700 text-center">
//           Welcome <span>👋</span>
//         </h1>
//         <p className="text-gray-500 mt-1 text-center">
//           Manage your medicines safely and efficiently
//         </p>
//       </div>

//       {/* Status Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <StatusCard title="Total Medicines" value="0" />
//         <StatusCard title="Expired" value="0" type="danger" />
//         <StatusCard
//           title="Expiring Soon (30 days)"
//           value="0"
//           type="warning"
//         />
//       </div>



// {/* Scan Medicine Banner */}
// <motion.div
//   initial={{ opacity: 0, y: 30 }}
//   animate={{ opacity: 1, y: 0 }}
//   transition={{ duration: 0.6 }}
//   className="flex justify-center mt-10"
// >
//   <div
//     onClick={() => navigate("/dashboard/scan")}
//     //  className=" relative w-[380px] aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer shadow-xl group"
//     className="relative w-[380px] aspect-[16/9] rounded-3xl overflow-hidden cursor-pointer shadow-xl group"

//   >
//     {/* Background Image (blurred) */}
//     <img
//       src={scanBg}
//       alt="Scan background"
//       className="absolute inset-0 w-full h-full object-cover"
//     />

//     {/* Overlay */}
//     <div className="absolute inset-0 bg-black/30" />

//     {/* Center Content */}
//     <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
//       <img
//         src={scanMain}
//         alt="Scan medicine"
//         className="h-28 md:h-32 mb-3 transition-transform duration-300 group-hover:scale-105"
//       />

//       <h2 className="text-xl md:text-2xl font-semibold">
//         Scan Medicine
//       </h2> 

//     </div>
//   </div>
// </motion.div>



     

//       <div className="mt-14 space-y-1">
//         <motion.h2
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, ease: "easeOut" }}
//           viewport={{ once: true }}
//           className="text-2xl font-bold text-gray-800 mt-14 mb-2 text-center"
//         >
//           Platform Capabilities
//         </motion.h2>

//         <motion.p
//           initial={{ opacity: 0, y: 14 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.45, delay: 0.1 }}
//           viewport={{ once: true }}
//           className="text-gray-500 text-center mb-12"
//         >
//           Manage, scan, and verify your medicines in one place.
//         </motion.p>
//       </div>


//       <motion.div
//         className="grid grid-cols-1 md:grid-cols-2 gap-10"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, amount: 0.2 }}
//         variants={{
//           visible: {
//             transition: {
//               staggerChildren: 0.2, // 👈 ek ke baad ek
//             },
//           },
//         }}
//       >
//         <FeatureCard
//           title="Smart Scanning"
//           description="Instantly scan medicine packages using your phone camera with high accuracy."
//           icon={<Camera size={22} className="text-blue-700" />}
//           bg="from-blue-100 to-blue-190"
//         />

//         <FeatureCard
//           title="Expiry Verification"
//           description="Automatically detects and verifies expiry dates to keep you safe."
//           icon={<ShieldCheck size={22} className="text-green-700" />}
//           bg="from-green-100 to-green-190"
//         />

//         <FeatureCard
//           title="Detailed Information"
//           description="Get usage, dosage, side effects and drug interaction details."
//           icon={<Info size={22} className="text-purple-700" />}
//           bg="from-purple-100 to-purple-190"
//         />

//         <FeatureCard
//           title="Secure & Private"
//           description="Your health data is protected with secure authentication."
//           icon={<Info size={22} className="text-teal-700" />}
//           bg="from-teal-100 to-teal-190"
//         />
//       </motion.div>



//       {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//         <FeatureCard
//           title="Smart Scanning"
//           description="Instantly scan medicine packages using your phone camera with high accuracy."
//           icon={<Camera size={22} className="text-blue-700" />}
//           bg="from-blue-100 to-blue-190"
//         />

//         <FeatureCard
//           title="Expiry Verification"
//           description="Automatically detects and verifies expiry dates to keep you safe."
//           icon={<ShieldCheck size={22} className="text-green-700" />}
//           bg="from-green-100 to-green-190"
//         />

//         <FeatureCard
//           title="Detailed Information"
//           description="Get usage, dosage, side effects and drug interaction details."
//           icon={<Info size={22} className="text-purple-700" />}
//           bg="from-purple-100 to-purple-190"
//         />

//         <FeatureCard
//           title="Secure & Private"
//           description="Your health data is protected with secure authentication."
//           icon={<Info size={22} className="text-teal-700" />}
//           bg="from-teal-100 to-teal-190"
//         />
//       </div>
//  */}




//       {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//   <FeatureCard
//     title="Smart Scanning"
//     description="Instantly scan medicine packages using your phone camera with high accuracy."
//     icon={<Camera size={25} className="text-blue-600"/>}
//     bg="bg-blue-50"
//     delay={200}
//   />

//   <FeatureCard
//     title="Expiry Verification"
//     description="Automatically detects and verifies expiry dates to keep you safe."
//     icon={<ShieldCheck size={25} className="text-green-600" />}
//     bg="bg-green-50"
//     delay={170}
//   />

//   <FeatureCard
//     title="Detailed Information"
//     description="Get usage, dosage, side effects and drug interaction details."
//     icon={<Info size={25} className="text-purple-600" />}
//     bg="bg-purple-50"
//     delay={350}
//   />

//   <FeatureCard
//     title="Secure & Private"
//     description="Your health data is protected with secure authentication."
//     icon={<Info size={25} className="text-purple-600" />}
//     bg="bg-teal-50"
//     delay={450}
//   />
// </div>

//       </div> */}
//     // </div>
//   );
// }


















