import type { Variants } from "framer-motion";

/* Critically damped spring (stiffness 100 / damping 20, mass 1 => ratio 1.0):
   a controlled, mechanical settle with no overshoot. */
export const SPRING = { type: "spring", stiffness: 100, damping: 20 } as const;

export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

export const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: SPRING },
};
