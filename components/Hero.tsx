"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ColorBends } from "./backgrounds/ColorBends";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const oStatus = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const oTitle = useTransform(scrollYProgress, [0.3, 0.62], [1, 0]);
  const sTitle = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const oLede = useTransform(scrollYProgress, [0.12, 0.42], [1, 0]);
  const yLede = useTransform(scrollYProgress, [0.12, 0.42], [0, -50]);
  const oMeta = useTransform(scrollYProgress, [0.22, 0.5], [1, 0]);
  const yMeta = useTransform(scrollYProgress, [0.22, 0.5], [0, -50]);
  const oCue = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const s = (style: object) => (reduce ? undefined : style);

  return (
    <section id="top" ref={ref} className="relative z-0 h-[185vh] bg-black">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <ColorBends className="absolute inset-0" />
        {/* readability vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_45%,rgba(0,0,0,0.15),rgba(0,0,0,0.72))]" />

        <div className="relative z-10 mx-auto w-full max-w-wrap px-[clamp(20px,5vw,64px)]">
          <motion.p
            style={s({ opacity: oStatus })}
            className="mb-7 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] text-muted"
          >
            <span className="relative inline-block h-[7px] w-[7px] rounded-full bg-accent">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
            </span>
            Available · Cleveland, OH
          </motion.p>

          <motion.h1
            style={s({ opacity: oTitle, y: yTitle, scale: sTitle })}
            className="origin-left text-[clamp(3.2rem,13vw,9rem)] font-semibold leading-[0.92] tracking-[-0.05em]"
          >
            Zach Krivis<span className="text-accent">.</span>
          </motion.h1>

          <motion.p
            style={s({ opacity: oLede, y: yLede })}
            className="mt-[clamp(28px,5vh,48px)] max-w-[30ch] text-[clamp(1.15rem,2.4vw,1.6rem)] font-normal leading-[1.32] tracking-[-0.02em]"
          >
            I research machine learning, build software close to the metal, and
            write about where the technology is heading.
          </motion.p>

          <motion.ul
            style={s({ opacity: oMeta, y: yMeta })}
            className="mt-[clamp(32px,5vh,52px)] flex flex-wrap"
          >
            {["ML Researcher", "Audio Models", "C++", "Writer"].map((m, i) => (
              <li
                key={m}
                className={`font-mono text-xs uppercase tracking-[0.04em] text-muted ${
                  i === 0 ? "pr-4" : "border-l border-white/15 px-4"
                }`}
              >
                {m}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          style={s({ opacity: oCue })}
          className="absolute bottom-[clamp(20px,5vh,44px)] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
        >
          <span>Scroll</span>
          <span className="h-[26px] w-px bg-gradient-to-b from-muted to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
