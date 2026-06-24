"use client";

import { StackCard, CardInner, Item } from "@/components/StackCard";
import { experience } from "@/lib/data";

export function Experience() {
  return (
    <StackCard
      id="work"
      z={20}
      bg="bg-zinc-950 bg-[radial-gradient(100%_60%_at_50%_0%,rgba(30,41,59,0.35),transparent_60%)]"
    >
      <CardInner index="02" label="Experience">
        <ul className="flex flex-col">
          {experience.map((r, i) => (
            <Item
              as="li"
              key={r.role + i}
              className={`border-b border-white/[0.09] py-7 first:pt-0 last:border-b-0 ${
                r.minimal ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3
                  className={`font-semibold tracking-[-0.03em] ${
                    r.minimal
                      ? "text-[clamp(1rem,2vw,1.15rem)]"
                      : "text-[clamp(1.25rem,2.6vw,1.7rem)]"
                  }`}
                >
                  {r.role}
                  {r.aside && (
                    <span className="ml-2 text-[0.78rem] font-normal italic tracking-normal text-faint">
                      {r.aside}
                    </span>
                  )}
                </h3>
                <span className="flex-none whitespace-nowrap font-mono text-xs text-faint">
                  {r.date}
                </span>
              </div>
              <p className="mt-2.5 font-mono text-xs uppercase tracking-[0.03em] text-muted">
                {r.org}
              </p>
              {r.desc && (
                <p className="mt-3 max-w-[60ch] text-muted">{r.desc}</p>
              )}
              {r.extra && (
                <p className="mt-3 font-mono text-xs tracking-[0.02em] text-faint">
                  <span className="mr-2 text-muted">{r.extraLabel}</span>
                  {r.extra}
                </p>
              )}
            </Item>
          ))}
        </ul>
      </CardInner>
    </StackCard>
  );
}
