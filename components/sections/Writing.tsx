"use client";

import { type RefObject } from "react";
import { StackCard, CardInner, Item } from "@/components/StackCard";
import { writing } from "@/lib/data";

const LIGHT = "rgba(40,48,58,0.28)";

type StackProps = {
  cardRef: RefObject<HTMLElement | null>;
  nextRef: RefObject<HTMLElement | null>;
};

export function Writing({ cardRef, nextRef }: StackProps) {
  return (
    <StackCard id="writing" z={14} bg="bg-[#0a0a0c]" light={LIGHT} cardRef={cardRef} nextRef={nextRef}>
      <CardInner index="04" label="Writing">
        <div className="flex flex-col gap-14">
          {writing.map((a) => (
            <Item as="div" key={a.title}>
              <article>
                <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight tracking-[-0.02em] text-zinc-100">
                  {a.title}
                </h3>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-zinc-500">
                  {a.meta} · {a.date}
                </p>
                <blockquote className="my-6 border-l-2 border-accent/70 pl-5 text-[clamp(1.1rem,2vw,1.35rem)] font-medium leading-snug text-zinc-200">
                  {a.pull}
                </blockquote>
                <p className="max-w-prose text-[1.02rem] leading-relaxed text-zinc-400">
                  {a.body}
                </p>
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ulink mt-6 inline-block text-sm text-zinc-300"
                >
                  Read the essay ↗
                </a>
                <p className="mt-6 max-w-prose border-l border-white/10 pl-4 text-sm leading-relaxed text-zinc-500">
                  <span className="mr-1.5 text-zinc-400">Aside —</span>
                  {a.aside}
                </p>
              </article>
            </Item>
          ))}
        </div>
      </CardInner>
    </StackCard>
  );
}
