"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EMAIL, GITHUB, LINKEDIN, ESSAYS } from "@/lib/data";

type Cmd = { label: string; hint: string; run: () => void };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const go = useCallback((sel: string) => {
    document.querySelector(sel)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const commands = useMemo<Cmd[]>(
    () => [
      { label: "About", hint: "01", run: () => go("#about") },
      { label: "Experience", hint: "02", run: () => go("#work") },
      { label: "Projects", hint: "03", run: () => go("#projects") },
      { label: "Writing", hint: "04", run: () => go("#writing") },
      { label: "Education", hint: "05", run: () => go("#education") },
      { label: "Skills", hint: "06", run: () => go("#skills") },
      { label: "Contact", hint: "07", run: () => go("#contact") },
      {
        label: "Copy email",
        hint: EMAIL,
        run: () => navigator.clipboard?.writeText(EMAIL).catch(() => {}),
      },
      { label: "GitHub", hint: "↗", run: () => window.open(GITHUB, "_blank") },
      { label: "LinkedIn", hint: "↗", run: () => window.open(LINKEDIN, "_blank") },
      {
        label: "Read: The Misdiagnosis",
        hint: "essay",
        run: () => window.open(ESSAYS.misdiagnosis, "_blank"),
      },
      {
        label: "Read: A Million Noiseless Qubits",
        hint: "essay",
        run: () => window.open(ESSAYS.qubits, "_blank"),
      },
    ],
    [go]
  );

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    return commands.filter((c) => (c.label + " " + c.hint).toLowerCase().includes(s));
  }, [q, commands]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-cmdk", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-cmdk", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
    }
  }, [open]);

  const runIdx = (i: number) => {
    const c = filtered[i];
    setOpen(false);
    if (c) setTimeout(c.run, 80);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center bg-black/60 pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="w-[min(540px,92vw)] overflow-hidden rounded-lg border border-white/15 bg-[#131313] shadow-2xl"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, filtered.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  runIdx(active);
                }
              }}
              placeholder="Jump to a section or run a command"
              aria-label="Command"
              className="w-full border-b border-white/10 bg-transparent px-[18px] py-4 font-mono text-sm text-[#f2f2ee] outline-none placeholder:text-faint"
            />
            <div className="max-h-[320px] overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <div className="p-4 text-[13px] text-faint">No matches.</div>
              ) : (
                filtered.map((c, i) => (
                  <div
                    key={c.label}
                    onMouseMove={() => setActive(i)}
                    onClick={() => runIdx(i)}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2.5 text-[13px] ${
                      i === active ? "bg-accent/10" : ""
                    }`}
                  >
                    <span className={i === active ? "text-accent" : "text-[#f2f2ee]"}>
                      {c.label}
                    </span>
                    <span className={`font-mono text-[11px] ${i === active ? "text-accent" : "text-faint"}`}>
                      {c.hint}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
