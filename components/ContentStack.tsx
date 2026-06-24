"use client";

import { useRef } from "react";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Writing } from "@/components/sections/Writing";
import { Education } from "@/components/sections/Education";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

/**
 * Owns the element refs for the sticky stack so each card can watch the *next*
 * card rise and scale/dim itself accordingly. Cards 1–6 stack; Contact is the
 * finale that covers card 6.
 */
export function ContentStack() {
  const about = useRef<HTMLElement | null>(null);
  const experience = useRef<HTMLElement | null>(null);
  const projects = useRef<HTMLElement | null>(null);
  const writing = useRef<HTMLElement | null>(null);
  const education = useRef<HTMLElement | null>(null);
  const skills = useRef<HTMLElement | null>(null);
  const contact = useRef<HTMLElement | null>(null);

  return (
    <>
      <About cardRef={about} nextRef={experience} />
      <Experience cardRef={experience} nextRef={projects} />
      <Projects cardRef={projects} nextRef={writing} />
      <Writing cardRef={writing} nextRef={education} />
      <Education cardRef={education} nextRef={skills} />
      <Skills cardRef={skills} nextRef={contact} />
      <Contact sectionRef={contact} />
    </>
  );
}
