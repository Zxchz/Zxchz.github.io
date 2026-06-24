"use client";

import { type RefObject } from "react";
import { StackCard, CardInner, Item } from "@/components/StackCard";
import { projects } from "@/lib/data";
import { UselessButton } from "@/components/UselessButton";

const LIGHT = "rgba(42,47,66,0.30)";

type StackProps = {
  cardRef: RefObject<HTMLElement | null>;
  nextRef: RefObject<HTMLElement | null>;
};

export function Projects({ cardRef, nextRef }: StackProps) {
  return (
    <StackCard id="projects" z={13} bg="bg-[#0a0a0c]" light={LIGHT} cardRef={cardRef} nextRef={nextRef}>
      <CardInner index="03" label="Projects">
        <ul className="flex flex-col">
          {projects.map((p) => (
            <Item
              as="li"
              key={p.title}
              className="border-b border-white/[0.08] py-7 first:pt-0 last:border-b-0"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[clamp(1.2rem,2.4vw,1.6rem)] font-semibold tracking-[-0.02em] text-zinc-100">
                  {p.title}
                </h3>
                <span className="flex-none whitespace-nowrap font-mono text-xs text-zinc-500">
                  {p.date}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-500">{p.org}</p>
              <p className="mt-3 max-w-prose leading-relaxed text-zinc-400">{p.desc}</p>
              <p className="mt-3 text-xs text-zinc-500">
                <span className="mr-2">{p.extraLabel}</span>
                <span className="font-mono text-zinc-400">{p.extra}</span>
              </p>
              {(p.demo || p.source) && (
                <div className="mt-5 flex flex-wrap items-center gap-6">
                  {p.demo && <UselessButton />}
                  {p.source && (
                    <a
                      href={p.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ulink text-sm text-zinc-300"
                    >
                      Source ↗
                    </a>
                  )}
                </div>
              )}
            </Item>
          ))}
        </ul>
      </CardInner>
    </StackCard>
  );
}
