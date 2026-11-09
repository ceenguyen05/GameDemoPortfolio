"use client";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
export function CommandPanel({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={reduced ? false : { opacity: 0.8, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.12 }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
