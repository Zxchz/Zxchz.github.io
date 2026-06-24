"use client";

import { StackCard, CardInner, Item } from "@/components/StackCard";
import { projects } from "@/lib/data";
import { UselessButton } from "@/components/UselessButton";

export function Projects() {
  return (
    <StackCard
      id="projects"
      z={30}
      bg="bg-zinc-900 bg-[radial-gradient(100%_60%_at_50%_0%,rgba(30,27,75,0.32),transparent_60%)]"
    >
      <CardInner index="03" label="Projects">
        <ul className="flex flex-col">
          {projects.map((p) => (
            <Item
              as="li"
              key={p.title}
              className="border-b border-white/[0.09] py-7 first:pt-0 last:border-b-0"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[clamp(1.25rem,2.6vw,1.7rem)] font-semibold tracking-[-0.03em]">
                  {p.title}
                </h3>
                <span className="flex-none whitespace-nowrap font-mono text-xs text-faint">
                  {p.date}
                </span>
              </div>
              <p className="mt-2.5 font-mono text-xs uppercase tracking-[0.03em] text-muted">
                {p.org}
              </p>
              <p className="mt-3 max-w-[60ch] text-muted">{p.desc}</p>
              <p className="mt-3 font-mono text-xs tracking-[0.02em] text-faint">
                <span className="mr-2 text-muted">{p.extraLabel}</span>
                {p.extra}
              </p>
              {(p.demo || p.source) && (
                <div className="mt-[18px] flex flex-wrap items-center gap-6">
                  {p.demo && <UselessButton />}
                  {p.source && (
                    <a
                      href={p.source}
                      target="_blank"
                      rel="noopener"
                      className="ulink font-mono text-xs tracking-[0.03em]"
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
