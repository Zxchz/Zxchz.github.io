"use client";

import { type RefObject } from "react";
import { StackCard, CardInner, Item } from "@/components/StackCard";
import { skills } from "@/lib/data";

const LIGHT = "rgba(46,48,58,0.30)";

type StackProps = {
  cardRef: RefObject<HTMLElement | null>;
  nextRef: RefObject<HTMLElement | null>;
};

export function Skills({ cardRef, nextRef }: StackProps) {
  return (
    <StackCard id="skills" z={16} bg="bg-[#0a0a0c]" light={LIGHT} cardRef={cardRef} nextRef={nextRef}>
      <CardInner index="06" label="Skills">
        <dl className="flex flex-col">
          {skills.map((sk) => (
            <Item
              as="div"
              key={sk.label}
              className="grid gap-1.5 border-b border-white/[0.08] py-5 last:border-b-0 md:grid-cols-[170px_1fr] md:gap-6"
            >
              <dt className="text-sm font-medium text-zinc-500">{sk.label}</dt>
              <dd className="m-0 max-w-prose leading-relaxed text-zinc-300">{sk.value}</dd>
            </Item>
          ))}
        </dl>
      </CardInner>
    </StackCard>
  );
}
