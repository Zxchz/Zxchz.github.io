"use client";

import { type RefObject } from "react";
import { StackCard, CardInner, Item } from "@/components/StackCard";
import { experience } from "@/lib/data";

const LIGHT = "rgba(44,46,55,0.30)";

type StackProps = {
  cardRef: RefObject<HTMLElement | null>;
  nextRef: RefObject<HTMLElement | null>;
};

export function Experience({ cardRef, nextRef }: StackProps) {
  return (
    <StackCard id="work" z={12} bg="bg-[#0a0a0c]" light={LIGHT} cardRef={cardRef} nextRef={nextRef}>
      <CardInner index="02" label="Experience">
        <ul className="flex flex-col">
          {experience.map((r, i) => (
            <Item
              as="li"
              key={r.role + i}
              className={`border-b border-white/[0.08] py-7 first:pt-0 last:border-b-0 ${
                r.minimal ? "opacity-70" : ""
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3
                  className={`font-semibold tracking-[-0.02em] text-zinc-100 ${
                    r.minimal ? "text-base" : "text-[clamp(1.2rem,2.4vw,1.6rem)]"
                  }`}
                >
                  {r.role}
                  {r.aside && (
                    <span className="ml-2 text-[0.8rem] font-normal italic text-zinc-500">
                      {r.aside}
                    </span>
                  )}
                </h3>
                <span className="flex-none whitespace-nowrap font-mono text-xs text-zinc-500">
                  {r.date}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-500">{r.org}</p>
              {r.desc && (
                <p className="mt-3 max-w-prose leading-relaxed text-zinc-400">{r.desc}</p>
              )}
              {r.extra && (
                <p className="mt-3 text-xs text-zinc-500">
                  <span className="mr-2">{r.extraLabel}</span>
                  <span className="font-mono text-zinc-400">{r.extra}</span>
                </p>
              )}
            </Item>
          ))}
        </ul>
      </CardInner>
    </StackCard>
  );
}
