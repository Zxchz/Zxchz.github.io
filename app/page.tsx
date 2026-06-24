import { Nav } from "@/components/Nav";
import { CommandPalette } from "@/components/CommandPalette";
import { Hero } from "@/components/Hero";
import { ContentStack } from "@/components/ContentStack";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <CommandPalette />
      <main>
        {/* Pinned hero with ColorBends */}
        <Hero />
        {/* Sticky card-stack (sections 1–6) + Contact finale */}
        <ContentStack />
      </main>
      <Footer />
    </>
  );
}
