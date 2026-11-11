"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/** Keep Next's route navigation, but always honor a link within the current page. */
export function SiteLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        onClick?.(event);
        const anchor = event.currentTarget;
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          (anchor.target && anchor.target !== "_self") ||
          anchor.hasAttribute("download") ||
          props.scroll === false
        )
          return;

        const destination = new URL(anchor.href);
        const current = new URL(window.location.href);
        if (
          destination.origin !== current.origin ||
          destination.pathname !== current.pathname ||
          destination.search !== current.search
        )
          return;

        let id: string;
        try {
          id = decodeURIComponent(destination.hash.slice(1));
        } catch {
          return;
        }
        const target = document.getElementById(id || "main");
        if (!target) return;

        event.preventDefault();
        // Repeated activation must not fill Back history with the same location.
        if (destination.href !== current.href) {
          const method = props.replace ? "replaceState" : "pushState";
          window.history[method](window.history.state, "", destination.href);
        }
        // Let a search dialog close and restore focus before moving to its target.
        requestAnimationFrame(() => {
          if (!target.isConnected) return;
          const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;
          target.focus({ preventScroll: true });
          if (id)
            target.scrollIntoView({
              block: "start",
              behavior: reducedMotion ? "instant" : "smooth",
            });
          else
            window.scrollTo({
              top: 0,
              behavior: reducedMotion ? "instant" : "smooth",
            });

          const cue = target.querySelector<HTMLElement>("[data-section-cue]");
          if (cue && !reducedMotion) {
            cue.getAnimations().forEach((animation) => animation.cancel());
            cue.animate(
              [
                { transform: "scaleX(0.35)", opacity: 0.3 },
                { transform: "scaleX(1)", opacity: 1 },
              ],
              {
                duration: 800,
                delay: 250,
                easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
              },
            );
          }
        });
      }}
    />
  );
}
