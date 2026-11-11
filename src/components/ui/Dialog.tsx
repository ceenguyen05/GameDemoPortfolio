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
      className={`m-auto max-h-[88dvh] overflow-auto rounded-[14px] border border-line bg-surface p-0 text-ink backdrop:bg-black/80 ${className}`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={(event) => {
        // The browser fires `close` a moment after the dialog closes. If it has
        // been reopened in between, that late event must not close it again.
        if (!event.currentTarget.open) onClose();
      }}
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
