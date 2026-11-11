"use client";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import type { GamePreview } from "@/types/gamePreview";
import { Arrow } from "@/components/ui/Arrow";
const QuickLookDialog = dynamic(
  () => import("./QuickLookDialog").then((module) => module.QuickLookDialog),
  {
    ssr: false,
    loading: () => (
      <span role="status" className="sr-only">
        Opening game preview…
      </span>
    ),
  },
);
export function QuickLook({ game }: { game: GamePreview }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() =>
      trigger.current?.focus({ preventScroll: true }),
    );
  };
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="quick-look-trigger"
        aria-label={`Quick look: ${game.title}`}
        onClick={() => setOpen(true)}
      >
        Quick look <Arrow />
      </button>
      {open && <QuickLookDialog game={game} onClose={close} />}
    </>
  );
}
