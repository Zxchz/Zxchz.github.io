"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { StackCard, CardInner, Item } from "@/components/StackCard";
import { fadeUp } from "@/lib/animations";

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
    <span ref={ref} className="font-sans text-[clamp(2rem,5vw,2.8rem)] font-semibold tracking-[-0.04em] tabular-nums text-[#f2f2ee]">
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <StackCard id="about" z={10} bg="bg-black">
      <CardInner index="01" label="About">
        <Item as="p" className="mb-4 text-[clamp(1.15rem,2vw,1.45rem)] leading-[1.45] tracking-[-0.015em]">
          I&apos;m a high school student in Cleveland, Ohio who got into machine
          learning and software the way most people fall into a hobby that
          quietly takes over. Most of what I know came from building things,
          breaking them, and figuring out why.
        </Item>
        <Item as="p" className="text-[1.02rem] text-muted">
          Lately that means interpretability research on audio foundation
          models, low-level work in C++, and the occasional essay when an idea
          won&apos;t leave me alone. I like problems that are technically hard and
          actually useful.
        </Item>
        <motion.ul
          variants={fadeUp}
          className="mt-10 flex flex-wrap gap-[clamp(24px,5vw,56px)] border-t border-white/[0.09] pt-7"
        >
          {stats.map((s) => (
            <li key={s.label} className="flex flex-col gap-1.5 font-mono text-xs uppercase tracking-[0.04em] text-faint">
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              {s.label}
            </li>
          ))}
        </motion.ul>
      </CardInner>
    </StackCard>
  );
}
