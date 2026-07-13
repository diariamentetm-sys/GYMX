import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { TickerStrip } from "../components/TickerStrip";
import { AboutSection } from "../components/AboutSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { PricingSection } from "../components/PricingSection";
import { FAQSection } from "../components/FAQSection";
import { FinalCTA } from "../components/FinalCTA";
import { ContactFormSection } from "../components/ContactFormSection";
import { Footer } from "../components/Footer";

export function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 overflow-x-hidden" id="inicio">
      <Header />
      <Hero />
      <TickerStrip />
      <AboutSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <ContactFormSection />
      <Footer />
    </div>
  );
}
