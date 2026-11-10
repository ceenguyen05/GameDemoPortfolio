"use client";
import { useEffect, useRef } from "react";

/** Opens/closes a native <dialog> from React state and locks page scroll while open. */
export function useDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-initial-focus]")?.focus();
      const previous = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      return () => {
        if (dialog.open) dialog.close();
        document.documentElement.style.overflow = previous;
      };
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return ref;
}
