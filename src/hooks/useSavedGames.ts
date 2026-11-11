"use client";
import { useMemo, useSyncExternalStore } from "react";

const KEY = "playroom-saved-games";
const EVENT = "playroom-saved-games-change";
let memory = "[]";
let sessionOnly = false;

function snapshot(): string {
  if (sessionOnly) return memory;
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return memory;
  }
}
function subscribe(update: () => void) {
  const storage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) update();
  };
  window.addEventListener(EVENT, update);
  window.addEventListener("storage", storage);
  return () => {
    window.removeEventListener(EVENT, update);
    window.removeEventListener("storage", storage);
  };
}
function parse(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter(
              (item): item is string =>
                typeof item === "string" &&
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item),
            ),
          ),
        ].slice(0, 200)
      : [];
  } catch {
    return [];
  }
}
export function useSavedGames() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  const saved = useMemo(() => parse(raw), [raw]);
  function toggle(slug: string) {
    const current = parse(snapshot());
    memory = JSON.stringify(
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
    try {
      localStorage.setItem(KEY, memory);
      sessionOnly = false;
    } catch {
      sessionOnly = true;
    }
    window.dispatchEvent(new Event(EVENT));
  }
  return { saved, toggle, sessionOnly };
}
