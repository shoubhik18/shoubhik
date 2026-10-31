import { FallbackField } from "@/components/FallbackField";
import { PortfolioCanvas } from "@/components/canvas/PortfolioCanvas";
import { Header } from "@/components/Header";
import { CasePanel } from "@/components/CasePanel";
import { Hero } from "@/components/sections/Hero";
import { Orbit } from "@/components/sections/Orbit";
import { Work } from "@/components/sections/Work";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

export default function Page() {
  return (
    <>
      <FallbackField />
      <PortfolioCanvas />
      <Header />
      <main id="content" className="relative z-10">
        <Hero />
        <Orbit />
        <Work />
        <About />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <CasePanel />
    </>
  );
}
