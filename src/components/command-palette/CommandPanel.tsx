"use client";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

/** The palette's only motion: a 120ms fade and 4px drop. Skipped under reduced motion. */
export function CommandPanel({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={reduced ? false : { opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
