"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { stagger } from "@/lib/animations";

/** A normal-flow section (after the card-stack) that still gets the
    spring-staggered entrance choreography. */
export function PlainSection({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.section
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
