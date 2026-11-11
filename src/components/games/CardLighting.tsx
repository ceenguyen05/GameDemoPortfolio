"use client";
import { useEffect } from "react";
/** Delegated, frame-limited pointer lighting. No render loop, no React updates. */
export function CardLighting() {
  useEffect(() => {
    const root = document.getElementById("library");
    if (!root) return;
    const motion = window.matchMedia(
      "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
    );
    let frame = 0;
    let active: HTMLElement | null = null;
    let x = 0,
      y = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (active) {
        for (const key of ["--light-x", "--light-y", "--tilt-x", "--tilt-y"])
          active.style.removeProperty(key);
        active.removeAttribute("data-lit");
        active = null;
      }
    };
    const move = (event: PointerEvent) => {
      if (!motion.matches || event.pointerType !== "mouse") return;
      const tile = (event.target as Element).closest<HTMLElement>(".game-tile");
      if (tile !== active) {
        reset();
        active = tile;
      }
      if (!active) return;
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!active) return;
        const rect = active.getBoundingClientRect();
        const dx = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
        const dy = Math.max(0, Math.min(1, (y - rect.top) / rect.height));
        active.style.setProperty("--light-x", `${dx * 100}%`);
        active.style.setProperty("--light-y", `${dy * 100}%`);
        active.style.setProperty("--tilt-x", `${(0.5 - dy) * 3}deg`);
        active.style.setProperty("--tilt-y", `${(dx - 0.5) * 4}deg`);
        active.dataset.lit = "";
      });
    };
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", reset);
    root.addEventListener("focusin", reset);
    window.addEventListener("blur", reset);
    motion.addEventListener("change", reset);
    return () => {
      reset();
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", reset);
      root.removeEventListener("focusin", reset);
      window.removeEventListener("blur", reset);
      motion.removeEventListener("change", reset);
    };
  }, []);
  return null;
}
