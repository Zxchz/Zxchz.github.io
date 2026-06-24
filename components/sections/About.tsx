"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";
import { StackCard, CardInner, Item } from "@/components/StackCard";
import { fadeUp } from "@/lib/animations";

const LIGHT = "rgba(48,54,74,0.30)";

const stats = [
  { value: 50, suffix: "+", label: "people taught tech" },
  { value: 1, prefix: "#", label: "hackathon finish" },
  { value: 2, label: "essays published" },
];

function Counter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || done.current) return;
          done.current = true;
          let t0: number | null = null;
          const step = (ts: number) => {
            if (t0 === null) t0 = ts;
            const p = Math.min((ts - t0) / 850, 1);
            setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="text-[clamp(2rem,5vw,2.6rem)] font-semibold tracking-[-0.03em] tabular-nums text-zinc-50">
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

type StackProps = {
  cardRef: RefObject<HTMLElement | null>;
  nextRef: RefObject<HTMLElement | null>;
};

export function About({ cardRef, nextRef }: StackProps) {
  return (
    <StackCard id="about" z={11} bg="bg-[#0a0a0c]" light={LIGHT} cardRef={cardRef} nextRef={nextRef}>
      <CardInner index="01" label="About">
        <Item as="p" className="max-w-prose text-[clamp(1.15rem,1.9vw,1.4rem)] leading-relaxed text-zinc-200">
          I&apos;m a high school student in Cleveland, Ohio who got into machine
          learning and software the way most people fall into a hobby that
          quietly takes over.
        </Item>
        <Item as="p" className="mt-5 max-w-prose leading-relaxed text-zinc-400">
          Most of what I know came from building things, breaking them, and
          figuring out why. Lately that means interpretability research on audio
          foundation models, low-level performance work, and the occasional
          essay when an idea won&apos;t leave me alone. I like problems that are
          technically hard and actually useful.
        </Item>
        <motion.ul
          variants={fadeUp}
          className="mt-10 flex flex-wrap gap-x-[clamp(24px,5vw,56px)] gap-y-6 border-t border-white/[0.08] pt-8"
        >
          {stats.map((st) => (
            <li key={st.label} className="flex flex-col gap-1">
              <Counter value={st.value} prefix={st.prefix} suffix={st.suffix} />
              <span className="text-sm text-zinc-500">{st.label}</span>
            </li>
          ))}
        </motion.ul>
      </CardInner>
    </StackCard>
  );
}
