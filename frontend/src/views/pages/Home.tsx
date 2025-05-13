import FloatingDockItems from "../components/FloatingDockItems";
import FooterSection from "../components/Home/FooterSection";
import HeroSection from "../components/Home/HeroSection";
import PurposeSection from "../components/Home/PurposeSection";
import TeamSection from "../components/Home/TeamSection";

const Home: React.FC = () => {
  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <FloatingDockItems />
      </div>
      <main className="w-full overflow-x-hidden">
        <HeroSection />
        <PurposeSection />
        <TeamSection />
        <FooterSection />
      </main>
    </>
  );
};

export default Home;
