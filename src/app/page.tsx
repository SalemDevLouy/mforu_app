import { LandingNavbar } from "../components/Home/LandingNavbar";
import { HeroSection } from "../components/Home/HeroSection";
import { StatsSection } from "../components/Home/StatsSection";
import { FeaturesSection } from "../components/Home/FeaturesSection";
import { HowItWorksSection } from "../components/Home/HowItWorksSection";
import { TestimonialsSection } from "../components/Home/TestimonialsSection";
import { CTABanner } from "../components/Home/CTABanner";
import { LandingFooter } from "../components/Home/LandingFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTABanner />
      <LandingFooter />
    </div>
  );
}
