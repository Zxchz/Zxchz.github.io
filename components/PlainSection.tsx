"use client";

import { motion } from "framer-motion";
import { type ReactNode, type RefObject } from "react";
import { stagger } from "@/lib/animations";

/** A normal-flow section (the finale, after the card-stack) that still gets the
    spring-staggered entrance choreography. */
export function PlainSection({
  id,
  className = "",
  sectionRef,
  children,
}: {
  id?: string;
  className?: string;
  sectionRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  return (
    <motion.section
      ref={sectionRef as RefObject<HTMLElement>}
      id={id}
      className={`relative ${className}`}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.section>
  );
}
