"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
const key = "casey-games-sound";
const eventName = "casey-sound-change";
function subscribe(callback: () => void) {
  window.addEventListener(eventName, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(eventName, callback);
    window.removeEventListener("storage", callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(key) === "on";
  } catch {
    return false;
  }
}
export function useSound() {
  const enabled = useSyncExternalStore(subscribe, snapshot, () => false);
  const context = useRef<AudioContext | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const click = (event: MouseEvent) => {
      if (
        !(event.target instanceof Element) ||
        !event.target.closest("a,button")
      )
        return;
      try {
        const audio = context.current ?? new AudioContext();
        context.current = audio;
        void audio
          .resume()
          .then(() => {
            const tone = audio.createOscillator();
            const gain = audio.createGain();
            tone.frequency.setValueAtTime(520, audio.currentTime);
            tone.frequency.exponentialRampToValueAtTime(
              300,
              audio.currentTime + 0.04,
            );
            gain.gain.setValueAtTime(0.025, audio.currentTime);
            gain.gain.exponentialRampToValueAtTime(
              0.001,
              audio.currentTime + 0.045,
            );
            tone.connect(gain);
            gain.connect(audio.destination);
            tone.start();
            tone.stop(audio.currentTime + 0.05);
          })
          .catch(() => {});
      } catch {
        /* Optional audio may be blocked. */
      }
    };
    document.addEventListener("click", click);
    return () => {
      document.removeEventListener("click", click);
      void context.current?.close().catch(() => {});
      context.current = null;
    };
  }, [enabled]);
  const toggle = () => {
    try {
      localStorage.setItem(key, enabled ? "off" : "on");
    } catch {
      /* Storage may be unavailable. */
    }
    window.dispatchEvent(new Event(eventName));
  };
  return { enabled, toggle };
}
