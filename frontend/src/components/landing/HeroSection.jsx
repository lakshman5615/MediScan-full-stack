import heroImg from "../../assets/images/hero.png";


const HeroSection = () => {
  return (
    <div
      id="home"
      className="flex flex-col md:flex-row items-center px-10 py-20"
    >
      <div className="md:w-1/2">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Scan, Verify & Manage Your Medicines
        </h1>
        <p className="text-gray-600 mb-6">
          Scan medicines, verify expiry dates and get detailed information.
        </p>

        <button className="bg-blue-600 text-white px-6 py-3 rounded">
          Start Scanning
        </button>
      </div>

      <div className="md:w-1/2 mt-10 md:mt-0">
        <img
          src={heroImg}
          alt="medicine"
          className="rounded-lg shadow"
        />
      </div>
    </div>
  );
};

export default HeroSection;

// const HeroSection = () => {
//   return (
//     <div 
    
//         className="flex flex-col md:flex-row items-center px-10 py-20">
//       <div className="md:w-1/2">
//         <h1 className="text-4xl font-bold mb-4 text-gray-800">
//           Scan, Verify & Manage Your Medicines
//         </h1>
//         <p className="text-gray-600 mb-6">
//           Scan medicines, verify expiry dates and get detailed information.
//         </p>

//         <button className="bg-blue-600 text-white px-6 py-3 rounded">
//           Start Scanning
//         </button>
//       </div>

//       <div className="md:w-1/2 mt-10 md:mt-0">
//         <img
//           src={heroImg}
//           alt="medicine"
//           className="rounded-lg shadow"
//         />
//       </div>
//     </div>
//   );
// };

// export default HeroSection;
