"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { stagger, fadeUp, fadeUpSmall } from "@/lib/animations";

type Props = {
  id?: string;
  z: number;
  /** Tailwind background + tint classes for this card. */
  bg: string;
  /** First card (hero) skips the card chrome. */
  first?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * A sticky "card" in the stack. The next card slides up and covers this one
 * like a deck. Critically, the sticky `top` is computed from the card's own
 * height: short cards pin at the top; cards taller than the viewport pin
 * bottom-aligned only after you've scrolled through all of them — so
 * reading-heavy sections are never covered before they can be read.
 */
export function StackCard({ id, z, bg, first = false, className = "", children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setTop = () => {
      const offset = Math.min(0, window.innerHeight - el.offsetHeight);
      el.style.top = `${offset}px`;
    };
    setTop();
    const ro = new ResizeObserver(setTop);
    ro.observe(el);
    window.addEventListener("resize", setTop);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setTop);
    };
  }, []);

  const chrome = first
    ? ""
    : "rounded-t-[28px] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]";

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      style={{ zIndex: z }}
      className={`sticky min-h-svh w-full ${bg} ${chrome} ${className}`}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
    >
      {children}
    </motion.section>
  );
}

/** Inner wrapper: the editorial indexed grid (sticky label column + body). */
export function CardInner({
  index,
  label,
  children,
}: {
  index: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-wrap px-[clamp(20px,5vw,64px)] py-[clamp(64px,12vh,128px)]">
      <div className="grid gap-x-[clamp(24px,5vw,64px)] gap-y-4 md:grid-cols-[200px_1fr]">
        <motion.p
          variants={fadeUpSmall}
          className="font-mono text-[13px] tracking-wide text-[#f2f2ee] md:sticky md:top-[84px] md:h-max md:self-start"
        >
          <span className="mr-2 text-accent md:mb-2 md:mr-0 md:block">{index}</span>
          {label}
        </motion.p>
        <div className="min-w-0 max-w-[640px]">{children}</div>
      </div>
    </div>
  );
}

/** A spring-staggered child. */
export function Item({
  as = "div",
  className = "",
  children,
}: {
  as?: "div" | "li" | "ul" | "p" | "h2" | "h3" | "span";
  className?: string;
  children: ReactNode;
}) {
  const M = motion[as];
  return (
    <M variants={fadeUp} className={className}>
      {children}
    </M>
  );
}
