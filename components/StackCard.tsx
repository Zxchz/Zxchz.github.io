"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, type ReactNode, type RefObject } from "react";
import { stagger, fadeUp, fadeUpSmall } from "@/lib/animations";
import { AmbientBackground } from "./AmbientBackground";

type Props = {
  id?: string;
  z: number;
  /** Deep, near-black base color for the card (covers the previous card). */
  bg: string;
  /** Desaturated radial spotlight color for the ambient light behind the glass. */
  light: string;
  cardRef: RefObject<HTMLElement | null>;
  nextRef: RefObject<HTMLElement | null>;
  className?: string;
  children: ReactNode;
};

/**
 * A sticky card in the stack.
 *  - Readability: sticky `top` is derived from the card's own height.
 *  - Cinematic depth: as the next card rises, this card scales to 0.95, dims to
 *    0.5, and rotates back (rotateX -4deg) inside a perspective wrapper —
 *    a physical, recede-into-space parallax.
 * Sticky lives on the outer <section>; the 3D transform lives on an inner layer.
 */
export function StackCard({
  id,
  z,
  bg,
  light,
  cardRef,
  nextRef,
  className = "",
  children,
}: Props) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const setTop = () => {
      el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`;
    };
    setTop();
    const ro = new ResizeObserver(setTop);
    ro.observe(el);
    window.addEventListener("resize", setTop);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setTop);
    };
  }, [cardRef]);

  const { scrollYProgress } = useScroll({
    target: nextRef as RefObject<HTMLElement>,
    offset: ["start end", "start start"],
  });
  const scaleMV = useTransform(scrollYProgress, [0.1, 1], [1, 0.95]);
  const opacityMV = useTransform(scrollYProgress, [0.35, 0.95], [1, 0.5]);
  const rotateMV = useTransform(scrollYProgress, [0.1, 1], [0, -4]);
  const scale = reduce ? 1 : scaleMV;
  const opacity = reduce ? 1 : opacityMV;
  const rotateX = reduce ? 0 : rotateMV;

  return (
    <section
      ref={cardRef as RefObject<HTMLElement>}
      id={id}
      style={{ zIndex: z, perspective: "1400px" }}
      className={`sticky min-h-svh w-full ${className}`}
    >
      <motion.div
        style={{ scale, opacity, rotateX, transformOrigin: "center top" }}
        className={`relative min-h-svh overflow-hidden rounded-t-[28px] border-t border-white/[0.05] shadow-[0_-30px_60px_rgba(0,0,0,0.55)] ${bg}`}
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
      >
        <AmbientBackground color={light} />
        <div className="relative z-10">{children}</div>
      </motion.div>
    </section>
  );
}

/**
 * Content panel: a genuinely subtle dark-glass card — bg-zinc-950/60, razor-thin
 * border, backdrop blur — with a small eyebrow and a single readable column.
 */
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
    <div className="mx-auto w-full max-w-3xl px-[clamp(18px,5vw,40px)] py-[clamp(76px,14vh,150px)]">
      <motion.div
        variants={fadeUpSmall}
        className="overflow-hidden rounded-3xl border border-white/[0.06] bg-zinc-950/60 p-[clamp(24px,5vw,52px)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl"
      >
        <p className="mb-8 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          <span className="font-mono tabular-nums text-zinc-400">{index}</span>
          <span className="h-px w-6 bg-white/15" />
          {label}
        </p>
        {children}
      </motion.div>
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
