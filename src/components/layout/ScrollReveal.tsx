"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** One-time reveals, with complete content before JS and when motion is reduced. */
export function ScrollReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const revealAll = () => {
      observer?.disconnect();
      document
        .querySelectorAll<HTMLElement>('[data-reveal="pending"]')
        .forEach((target) => {
          target.dataset.reveal = "";
        });
    };
    const start = () => {
      revealAll();
      if (preference.matches) return;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).dataset.reveal = "";
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      for (const target of document.querySelectorAll<HTMLElement>(
        "[data-reveal]",
      )) {
        if (target.getBoundingClientRect().top < window.innerHeight) continue;
        target.dataset.reveal = "pending";
        observer.observe(target);
      }
    };
    start();
    // Turning reduced motion on reveals pending content immediately; turning it
    // off does not replay sections that this visitor has already seen.
    const change = () => {
      if (preference.matches) revealAll();
    };
    preference.addEventListener("change", change);
    return () => {
      revealAll();
      preference.removeEventListener("change", change);
    };
  }, [pathname]);
  return null;
}
