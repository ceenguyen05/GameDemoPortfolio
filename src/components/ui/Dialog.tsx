"use client";
import { useDialog } from "@/hooks/useDialog";
export function Dialog({
  open,
  onClose,
  labelId,
  children,
  className = "",
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
      className={`dialog ${className}`}
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const b = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < b.left ||
            event.clientX > b.right ||
            event.clientY < b.top ||
            event.clientY > b.bottom
          )
            onClose();
        }
      }}
    >
      {children}
    </dialog>
  );
}
