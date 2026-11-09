"use client";
import { useSound } from "@/hooks/useSound";
export function SoundToggle() {
  const { enabled, toggle } = useSound();
  return (
    <button
      type="button"
      className="sound-toggle"
      aria-label={`UI sound ${enabled ? "on" : "off"}`}
      aria-pressed={enabled}
      onClick={toggle}
    >
      <span aria-hidden="true" className="sound-bars">
        <i />
        <i />
        <i />
      </span>
      <span>Sound {enabled ? "on" : "off"}</span>
    </button>
  );
}
