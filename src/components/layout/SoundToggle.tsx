"use client";
import { useSound } from "@/hooks/useSound";

export function SoundToggle() {
  const { enabled, toggle } = useSound();
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={toggle}
      className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-muted transition-colors duration-100 hover:text-ink aria-pressed:text-ink"
    >
      <span aria-hidden="true" className="flex h-3.5 items-end gap-0.5">
        {[6, 14, 10].map((height) => (
          <i
            key={height}
            style={{ height }}
            className={`w-0.5 ${enabled ? "bg-signal" : "bg-current opacity-50"}`}
          />
        ))}
      </span>
      UI sounds
      <span
        aria-hidden="true"
        className={`label ${enabled ? "text-signal" : "text-muted"}`}
      >
        {enabled ? "On" : "Off"}
      </span>
    </button>
  );
}
