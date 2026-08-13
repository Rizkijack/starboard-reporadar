"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Fraction of the element that must be visible to trigger (or "some"/"all"). Lower for tall elements. @default 0.05 */
  amount?: number | "some" | "all";
}

/**
 * Scroll-entry reveal: fade + slight rise. Respects prefers-reduced-motion.
 * Pure transform/opacity animation.
 */
export function Reveal({ children, delay = 0, className, amount = 0.05 }: RevealProps) {
  const reduce = useReducedMotion();
  const [forced, setForced] = useState(false);

  // Safety net: never leave content permanently invisible. If whileInView
  // never fires (e.g. a very tall element whose visible fraction never
  // reaches the `amount` threshold in Motion v12), force the element visible
  // shortly after mount. Skipped under prefers-reduced-motion, where the
  // element is already visible via initial={false}.
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let timer = 0;
    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        timer = window.setTimeout(() => {
          setForced(true);
        }, 1000);
      });
    });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [reduce]);

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={forced ? { opacity: 1, y: 0 } : undefined}
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
