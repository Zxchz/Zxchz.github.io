"use client";

import { PlainSection } from "@/components/PlainSection";
import { CardInner, Item } from "@/components/StackCard";
import { skills } from "@/lib/data";

export function Skills() {
  return (
    <PlainSection id="skills" className="border-t border-white/[0.09]">
      <CardInner index="06" label="Skills">
        <dl className="flex flex-col">
          {skills.map((s) => (
            <Item
              as="div"
              key={s.label}
              className="grid gap-1.5 border-b border-white/[0.09] py-[18px] last:border-b-0 md:grid-cols-[160px_1fr] md:gap-5"
            >
              <dt className="font-mono text-xs uppercase tracking-[0.05em] text-faint">
                {s.label}
              </dt>
              <dd className="m-0 text-[#f2f2ee]">{s.value}</dd>
            </Item>
          ))}
        </dl>
      </CardInner>
    </PlainSection>
  );
}
