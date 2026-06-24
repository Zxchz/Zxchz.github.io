import { Nav } from "@/components/Nav";
import { CommandPalette } from "@/components/CommandPalette";
import { Hero } from "@/components/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Writing } from "@/components/sections/Writing";
import { Education } from "@/components/sections/Education";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <CommandPalette />
      <main>
        {/* Pinned hero with ColorBends */}
        <Hero />

        {/* Readable card-stack: each section slides up and covers the previous */}
        <About />
        <Experience />
        <Projects />
        <Writing />

        {/* Post-stack sections resolve back to normal flow */}
        <div className="relative z-50 bg-black">
          <Education />
          <Skills />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
