"use client";

import { motion } from "framer-motion";
import { PlainSection } from "@/components/PlainSection";
import { CardInner, Item } from "@/components/StackCard";
import { coursework } from "@/lib/data";
import { fadeUpSmall } from "@/lib/animations";

export function Education() {
  return (
    <PlainSection id="education" className="border-t border-white/[0.09]">
      <CardInner index="05" label="Education">
        <div className="flex items-baseline justify-between gap-4">
          <Item as="h3" className="text-[clamp(1.25rem,2.6vw,1.7rem)] font-semibold tracking-[-0.03em]">
            Solon High School
          </Item>
          <Item as="div" className="flex-none whitespace-nowrap font-mono text-xs text-faint">
            2023 — 2027
          </Item>
        </div>
        <Item as="p" className="mt-2.5 font-mono text-xs uppercase tracking-[0.03em] text-muted">
          Senior · Class of 2027
        </Item>

        {/* iOS-style liquid glass coursework */}
        <motion.ul variants={fadeUpSmall} className="mt-7 flex flex-wrap gap-2.5">
          {coursework.map((c) => (
            <li
              key={c}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs tracking-[0.01em] text-[#e7e7e1] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            >
              {c}
            </li>
          ))}
        </motion.ul>
      </CardInner>
    </PlainSection>
  );
}
