"use client";

import { type RefObject } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { PlainSection } from "@/components/PlainSection";
import { CardInner, Item } from "@/components/StackCard";
import { EMAIL, GITHUB, LINKEDIN } from "@/lib/data";

// Client-only WebGL, loaded after first paint.
const Aurora = dynamic(
  () => import("@/components/backgrounds/Aurora").then((m) => m.Aurora),
  { ssr: false }
);

export function Contact({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion();

  // As the finale rises over the last card, drift the aurora up a touch — a
  // soft parallax so the section settles into place instead of snapping in.
  const { scrollYProgress } = useScroll({
    target: sectionRef as RefObject<HTMLElement>,
    offset: ["start end", "start start"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    mass: 0.55,
    restDelta: 0.0005,
  });
  const auroraYMV = useTransform(p, [0, 1], [56, 0]);
  const auroraY = reduce ? 0 : auroraYMV;

  return (
    <PlainSection
      id="contact"
      sectionRef={sectionRef}
      className="z-20 overflow-hidden border-t border-white/[0.08] bg-[#060608]"
    >
      {/* Aurora behind everything (blurred through the glass). */}
      <motion.div
        aria-hidden
        style={{ y: auroraY, willChange: "transform" }}
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(120%_80%_at_50%_16%,rgba(59,130,246,0.14),transparent_70%)]"
      >
        <Aurora className="absolute inset-0" />
      </motion.div>

      <div className="relative z-10">
        <CardInner index="07" label="Contact">
          <Item as="p" className="mb-7 max-w-prose text-[clamp(1.3rem,2.6vw,1.9rem)] font-medium leading-snug tracking-[-0.02em] text-zinc-100">
            Open to research, engineering, and a good problem.
          </Item>
          <Item as="div">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-block break-words text-[clamp(1.4rem,4.5vw,2.4rem)] font-semibold tracking-[-0.03em] text-zinc-50 transition-colors hover:text-accent"
            >
              {EMAIL}
            </a>
          </Item>
          <Item as="ul" className="mt-7 flex flex-wrap gap-6">
            <li>
              <a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="ulink text-sm text-zinc-300"
              >
                GitHub ↗
              </a>
            </li>
            <li>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="ulink text-sm text-zinc-300"
              >
                LinkedIn ↗
              </a>
            </li>
          </Item>
        </CardInner>
      </div>
    </PlainSection>
  );
}
