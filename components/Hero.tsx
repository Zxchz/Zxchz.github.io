"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Client-only, loaded after first paint so the WebGL never blocks initial render.
const ColorBends = dynamic(
  () => import("./backgrounds/ColorBends").then((m) => m.ColorBends),
  { ssr: false }
);

const META = ["ML Researcher", "Audio Models", "High-Performance Infra", "Writer"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Exact device viewport, fed to the WebGL canvas so it draws full-bleed with
  // no aspect distortion (the mobile compression fix).
  const [vp, setVp] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const set = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    set();
    window.addEventListener("resize", set);
    window.addEventListener("orientationchange", set);
    window.visualViewport?.addEventListener("resize", set);
    return () => {
      window.removeEventListener("resize", set);
      window.removeEventListener("orientationchange", set);
      window.visualViewport?.removeEventListener("resize", set);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Spring-smoothed scroll so the hero exits with the same fluid inertia the
  // card stack uses — the whole page shares one motion language.
  const p = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    mass: 0.55,
    restDelta: 0.0005,
  });

  const oStatus = useTransform(p, [0, 0.12], [1, 0]);
  const yTitle = useTransform(p, [0, 1], [0, -60]);
  const oTitle = useTransform(p, [0.3, 0.62], [1, 0]);
  const oLede = useTransform(p, [0.12, 0.42], [1, 0]);
  const yLede = useTransform(p, [0.12, 0.42], [0, -40]);
  const oMeta = useTransform(p, [0.22, 0.5], [1, 0]);
  const oCue = useTransform(p, [0, 0.08], [1, 0]);

  const s = (style: object) => (reduce ? undefined : style);

  return (
    <section id="top" ref={ref} className="relative z-0 h-[185vh] bg-[#050506]">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        {/* Full-bleed background — sized to exact device pixels, no distortion. */}
        <div
          className="absolute inset-0 w-full overflow-hidden"
          style={{ height: vp.h ? `${vp.h}px` : "100svh" }}
        >
          <ColorBends
            width={vp.w || undefined}
            height={vp.h || undefined}
            className="h-full w-full"
          />
        </div>
        {/* Readability via dark gradient overlays (no glowing text). */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-[#050506]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />

        {/* Centered content. */}
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-[clamp(20px,6vw,56px)] pb-8 pt-24">
          <motion.p
            style={s({ opacity: oStatus })}
            className="mb-7 inline-flex items-center gap-2.5 text-sm tracking-wide text-zinc-400"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400/80" />
            Available for work
          </motion.p>

          <motion.h1
            style={s({ opacity: oTitle, y: yTitle })}
            className="text-[clamp(2.8rem,11vw,8.5rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-zinc-50"
          >
            Zach Krivis
          </motion.h1>

          <motion.p
            style={s({ opacity: oLede, y: yLede })}
            className="mt-[clamp(22px,4.5vh,40px)] max-w-xl text-[clamp(1.05rem,2.2vw,1.5rem)] font-normal leading-relaxed text-zinc-300"
          >
            I research machine learning, build high-performance infrastructure,
            and write about where the technology is heading.
          </motion.p>

          <motion.ul
            style={s({ opacity: oMeta })}
            className="mt-[clamp(26px,4.5vh,44px)] flex flex-wrap items-center gap-y-1 text-sm text-zinc-500"
          >
            {META.map((m) => (
              <li
                key={m}
                className="before:mx-2.5 before:text-zinc-700 before:content-['/'] first:before:hidden"
              >
                {m}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Scroll cue. */}
        <motion.div
          style={s({ opacity: oCue })}
          className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-2 px-[clamp(20px,6vw,56px)] pb-[max(20px,env(safe-area-inset-bottom))] text-[11px] uppercase tracking-[0.16em] text-zinc-500"
        >
          <span>Scroll</span>
          <span className="h-6 w-px bg-gradient-to-b from-zinc-500 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
