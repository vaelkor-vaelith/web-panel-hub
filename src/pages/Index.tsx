import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TribesSection from "@/components/TribesSection";
import CardShowcase from "@/components/CardShowcase";
import LoreSection from "@/components/LoreSection";
import MechanicsSection from "@/components/MechanicsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TribesSection />
      <CardShowcase />
      <LoreSection />
      <MechanicsSection />
      <Footer />
    </div>
  );
};

export default Index;
