"use client";

import { navLinks } from "@/lib/data";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-wrap items-center justify-between gap-4 px-[clamp(20px,5vw,64px)]">
        <a href="#top" className="text-sm font-semibold tracking-[-0.02em]">
          Zach Krivis
        </a>
        <nav aria-label="Primary" className="hidden gap-7 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="ulink py-1 font-mono text-xs tracking-[0.02em] text-muted transition-colors hover:text-[#f2f2ee]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => window.dispatchEvent(new Event("open-cmdk"))}
          aria-label="Open command menu"
          className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-[5px] transition-colors hover:border-accent"
        >
          <span className="font-mono text-[11px] text-muted">⌘</span>
          <span className="font-mono text-[11px] text-muted">K</span>
        </button>
      </div>
    </header>
  );
}
