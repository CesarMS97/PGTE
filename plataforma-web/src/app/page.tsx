import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import CallToAction from "@/components/landing/CallToAction";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Navbar />

      <main>
        <Hero />
        <ProblemSection />
        <Features />
        <HowItWorks />
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}
