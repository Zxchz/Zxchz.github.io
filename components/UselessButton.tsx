"use client";

import { useRef, useState } from "react";

export function UselessButton() {
  const [label, setLabel] = useState("try it");
  const [on, setOn] = useState(false);
  const busy = useRef(false);

  const click = () => {
    if (busy.current) return;
    busy.current = true;
    setOn(true);
    setLabel("on");
    setTimeout(() => {
      setOn(false);
      setLabel("off");
      setTimeout(() => {
        setLabel("try it");
        busy.current = false;
      }, 750);
    }, 550);
  };

  return (
    <button onClick={click} aria-label="Demo toggle" className="inline-flex items-center gap-2.5">
      <span
        className={`relative h-6 w-11 flex-none rounded-[3px] border transition-colors duration-300 ${
          on ? "border-accent bg-accent/10" : "border-white/15"
        }`}
      >
        <span
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-[2px] transition-all duration-300 ${
            on ? "left-[25px] bg-accent" : "left-[3px] bg-zinc-500"
          }`}
        />
      </span>
      <span className="min-w-[5ch] text-left text-xs text-zinc-500">{label}</span>
    </button>
  );
}
