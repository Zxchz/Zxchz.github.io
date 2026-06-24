"use client";

import { PlainSection } from "@/components/PlainSection";
import { CardInner, Item } from "@/components/StackCard";
import { Aurora } from "@/components/backgrounds/Aurora";
import { EMAIL, GITHUB, LINKEDIN } from "@/lib/data";

export function Contact() {
  return (
    <PlainSection id="contact" className="overflow-hidden border-t border-white/[0.09]">
      {/* Aurora strictly behind contact */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(120%_80%_at_50%_18%,rgba(59,130,246,0.16),transparent_70%)]">
        <Aurora className="absolute inset-0" />
      </div>

      <div className="relative z-10">
        <CardInner index="07" label="Contact">
          <Item as="p" className="mb-6 max-w-[22ch] text-[clamp(1.3rem,3vw,2rem)] font-medium tracking-[-0.03em]">
            Open to research, engineering, and a good problem.
          </Item>
          <Item as="div">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-block break-words text-[clamp(1.4rem,5vw,2.6rem)] font-semibold tracking-[-0.04em] transition-colors hover:text-accent"
            >
              {EMAIL}
            </a>
          </Item>
          <Item as="ul" className="mt-7 flex flex-wrap gap-6">
            <li>
              <a href={GITHUB} target="_blank" rel="noopener" className="ulink font-mono text-xs tracking-[0.03em]">
                GitHub ↗
              </a>
            </li>
            <li>
              <a href={LINKEDIN} target="_blank" rel="noopener" className="ulink font-mono text-xs tracking-[0.03em]">
                LinkedIn ↗
              </a>
            </li>
          </Item>
        </CardInner>
      </div>
    </PlainSection>
  );
}
