"use client";

import { navLinks } from "@/lib/data";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-white/[0.06] bg-[#050506]/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-wrap items-center justify-between gap-4 px-[clamp(20px,5vw,64px)]">
        <a href="#top" className="text-sm font-semibold tracking-[-0.01em] text-zinc-100">
          Zach Krivis
        </a>
        <nav aria-label="Primary" className="hidden gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="ulink py-1 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => window.dispatchEvent(new Event("open-cmdk"))}
          aria-label="Open command menu"
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-[5px] text-zinc-400 transition-colors hover:border-white/25 hover:text-zinc-200"
        >
          <span className="font-mono text-[11px]">⌘</span>
          <span className="font-mono text-[11px]">K</span>
        </button>
      </div>
    </header>
  );
}
