"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Fraction of the element that must be visible to trigger. Lower for tall elements. @default 0.2 */
  amount?: number;
}

/**
 * Scroll-entry reveal: fade + slight rise. Respects prefers-reduced-motion.
 * Pure transform/opacity animation.
 */
export function Reveal({ children, delay = 0, className, amount = 0.2 }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
