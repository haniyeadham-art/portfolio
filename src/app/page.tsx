import { CaseStudiesSection } from "@/components/home/CaseStudiesSection";
import { ContactSection } from "@/components/home/ContactSection";
import { Footer } from "@/components/home/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { Navbar } from "@/components/home/Navbar";
import { OtherProjectsSection } from "@/components/home/OtherProjectsSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <CaseStudiesSection />
        <OtherProjectsSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
