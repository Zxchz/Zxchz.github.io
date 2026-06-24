"use client";

import { StackCard, CardInner, Item } from "@/components/StackCard";
import { writing } from "@/lib/data";

export function Writing() {
  return (
    <StackCard id="writing" z={40} bg="bg-[#0a0a0a]">
      <CardInner index="04" label="Writing">
        <div className="flex max-w-2xl flex-col gap-16">
          {writing.map((a) => (
            <Item as="div" key={a.title}>
              <article>
                {/* title */}
                <h3 className="text-[clamp(1.6rem,3.2vw,2.1rem)] font-semibold leading-tight tracking-[-0.03em]">
                  {a.title}
                </h3>
                {/* meta-data */}
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                  {a.meta} · {a.date}
                </p>
                {/* pull quote */}
                <blockquote className="my-7 border-l-2 border-accent pl-5 text-[clamp(1.15rem,2.2vw,1.45rem)] font-medium leading-snug tracking-[-0.01em] text-[#f2f2ee]">
                  {a.pull}
                </blockquote>
                {/* body copy */}
                <p className="text-[1.05rem] leading-[1.85] text-[#d6d6cf]">
                  {a.body}
                </p>
                {/* link */}
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener"
                  className="ulink mt-6 inline-block font-mono text-xs tracking-[0.03em]"
                >
                  Read the essay ↗
                </a>
                {/* aside */}
                <p className="mt-6 border-l border-white/10 pl-3 font-mono text-[11px] leading-[1.6] text-faint">
                  <span className="mr-1.5 text-muted">Aside</span>
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
