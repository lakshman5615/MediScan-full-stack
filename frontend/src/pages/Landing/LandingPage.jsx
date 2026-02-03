import Navbar from "../../components/common/Navbar";
import HeroSection from "../../components/landing/HeroSection";
import LandingMedicineOptions from "../../components/landing/LandingMedicineOptions";
import Features from "../../components/landing/Features";
import HowItWorks from "../../components/landing/HowItWorks";
import Footer from "../../components/common/Footer";

const LandingPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      <HeroSection />
      <LandingMedicineOptions />
      <Features />
      <HowItWorks/>
      <Footer/>
    </div>
  );
};

export default LandingPage;
