"use client";
import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "casey-games-sound";
const CHANGE_EVENT = "casey-games-sound-change";

/** Used when localStorage is unavailable (private mode, blocked storage). */
let memoryEnabled = false;

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readEnabled(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? memoryEnabled : stored === "on";
  } catch {
    return memoryEnabled;
  }
}

let audio: AudioContext | null = null;

/** Short synthesized blips. No audio files; nothing plays until the user opts in. */
function blip(kind: "click" | "launch") {
  try {
    audio ??= new AudioContext();
    const ctx = audio;
    void ctx
      .resume()
      .then(() => {
        const notes = kind === "launch" ? [440, 660] : [520];
        notes.forEach((frequency, index) => {
          const start = ctx.currentTime + index * 0.06;
          const tone = ctx.createOscillator();
          const gain = ctx.createGain();
          tone.type = "triangle";
          tone.frequency.setValueAtTime(frequency, start);
          gain.gain.setValueAtTime(0.04, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.07);
          tone.connect(gain).connect(ctx.destination);
          tone.start(start);
          tone.stop(start + 0.08);
        });
      })
      .catch(() => {});
  } catch {
    /* Audio may be unavailable or blocked; sound is never required. */
  }
}

export function useSound() {
  const enabled = useSyncExternalStore(subscribe, readEnabled, () => false);

  useEffect(() => {
    if (!enabled) return;
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const control = event.target.closest("a, button");
      if (!control || control.matches(":disabled")) return;
      blip(control.matches("[data-sound='launch']") ? "launch" : "click");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [enabled]);

  const toggle = () => {
    memoryEnabled = !enabled;
    try {
      localStorage.setItem(STORAGE_KEY, memoryEnabled ? "on" : "off");
    } catch {
      /* Storage unavailable: the in-memory value lasts for this page view. */
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return { enabled, toggle };
}
