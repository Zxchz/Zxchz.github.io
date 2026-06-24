"use client";

import { motion } from "framer-motion";
import { type RefObject } from "react";
import { StackCard, CardInner, Item } from "@/components/StackCard";
import { coursework } from "@/lib/data";
import { fadeUpSmall } from "@/lib/animations";

const LIGHT = "rgba(46,52,70,0.28)";

type StackProps = {
  cardRef: RefObject<HTMLElement | null>;
  nextRef: RefObject<HTMLElement | null>;
};

export function Education({ cardRef, nextRef }: StackProps) {
  return (
    <StackCard id="education" z={15} bg="bg-[#0a0a0c]" light={LIGHT} cardRef={cardRef} nextRef={nextRef}>
      <CardInner index="05" label="Education">
        <div className="flex items-baseline justify-between gap-4">
          <Item as="h3" className="text-[clamp(1.2rem,2.4vw,1.6rem)] font-semibold tracking-[-0.02em] text-zinc-100">
            Solon High School
          </Item>
          <Item as="div" className="flex-none whitespace-nowrap font-mono text-xs text-zinc-500">
            2023 — 2027
          </Item>
        </div>
        <Item as="p" className="mt-2 text-sm text-zinc-500">
          Senior · Class of 2027
        </Item>

        <motion.ul variants={fadeUpSmall} className="mt-7 flex flex-wrap gap-2.5">
          {coursework.map((c) => (
            <li
              key={c}
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-zinc-300 backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            >
              {c}
            </li>
          ))}
        </motion.ul>
      </CardInner>
    </StackCard>
  );
}
