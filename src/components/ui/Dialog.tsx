"use client";
import { useDialog } from "@/hooks/useDialog";

/**
 * Native <dialog> shown modally: the browser handles focus containment,
 * Escape, the inert background, and returning focus to the opener.
 */
export function Dialog({
  open,
  onClose,
  labelId,
  children,
  className = "w-[min(40rem,calc(100%-2rem))]",
}: {
  open: boolean;
  onClose: () => void;
  labelId: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useDialog(open);
  return (
    <dialog
      ref={ref}
      aria-labelledby={labelId}
      className={`m-auto max-h-[88dvh] overflow-auto border border-ink bg-surface p-0 text-ink backdrop:bg-ink/70 ${className}`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onClick={(event) => {
        // A click on the dialog element itself (not its content) is the backdrop.
        if (event.target !== event.currentTarget) return;
        const box = event.currentTarget.getBoundingClientRect();
        const inside =
          event.clientX >= box.left &&
          event.clientX <= box.right &&
          event.clientY >= box.top &&
          event.clientY <= box.bottom;
        if (!inside) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
