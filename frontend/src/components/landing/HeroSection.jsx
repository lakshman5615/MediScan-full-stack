import heroBg from "../../assets/images/hero-bg.png";
import heroMobile from "../../assets/images/hero-right2.png"; // 👈 2 mobile image

const HeroSection = () => {

    const handleStartScanning = () => {
    const section = document.getElementById("medicine-options");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="w-full min-h-[85vh] flex items-center pt-24 bg-no-repeat bg-center  bg-cover"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="w-full px-6 md:px-16">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          
          {/* LEFT : TEXT */}
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Scan, Verify & <br />
              Manage <br /> Your Medicines
            </h1>

            <p className="text-gray-700 text-base md:text-lg mb-6">
              Scan medicines, verify expiry dates and get detailed information.
            </p>

            <button 
            onClick={handleStartScanning}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-lg">
              Start Scanning
            </button>
          </div>

          {/* RIGHT : IMAGE */}
          <div className="flex justify-center md:justify-end">
            <img
              src={heroMobile}
              alt="Medicine Scan App"
              className="w-[260px] sm:w-[320px] md:w-[420px] lg:w-[480px]"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;








// import heroImg from "../../assets/images/hero.png";


// const HeroSection = () => {

//     const handleStartScanning = () => {
//     const section = document.getElementById("medicine-options");

//     if (section) {
//       section.scrollIntoView({
//         behavior: "smooth",
//       });
//     }
//   };

  
//   return (
//     <div
//       id="home"
//       className="flex flex-col md:flex-row items-center px-10 py-20"
//     >
//       <div className="md:w-1/2">
//         <h1 className="text-4xl font-bold mb-4 text-gray-800">
//           Scan, Verify & Manage Your Medicines
//         </h1>
//         <p className="text-gray-600 mb-6">
//           Scan medicines, verify expiry dates and get detailed information.
//         </p>

//         <button 
//         onClick={handleStartScanning}
//         className="bg-blue-600 text-white px-6 py-3 rounded">
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


