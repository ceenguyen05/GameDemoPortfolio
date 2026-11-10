"use client";
import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** True on macOS and iOS, so shortcut hints can show ⌘ instead of Ctrl. Server render assumes Ctrl. */
export function useIsMac(): boolean {
  return useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => false,
  );
}
