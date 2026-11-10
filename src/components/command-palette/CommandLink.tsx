import Link from "next/link";
import type { Command } from "@/types/command";

/** One palette result: a real anchor for launches (new tab), a Next link otherwise. */
export function CommandLink({
  command,
  selected,
  onFocus,
  onPick,
}: {
  command: Command;
  selected: boolean;
  onFocus: () => void;
  onPick: () => void;
}) {
  const className = `flex min-h-12 items-center gap-3 rounded-control px-3 py-2 ${selected ? "bg-sunken" : "hover:bg-paper"}`;
  const content = (
    <>
      <span
        aria-hidden="true"
        className={`size-2.5 shrink-0 ${command.accent ? "" : "border border-line-strong"}`}
        style={command.accent ? { background: command.accent } : undefined}
      />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{command.label}</span>
        <span className="block truncate font-mono text-xs text-muted">
          {command.detail}
        </span>
      </span>
      <span aria-hidden="true" className="text-muted">
        {command.kind === "launch" ? "↗" : "→"}
      </span>
    </>
  );
  return command.kind === "launch" ? (
    <a
      href={command.href}
      target="_blank"
      rel="noopener noreferrer"
      data-command=""
      data-sound="launch"
      className={className}
      onFocus={onFocus}
      onClick={onPick}
    >
      {content}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  ) : (
    <Link
      href={command.href}
      data-command=""
      className={className}
      onFocus={onFocus}
      onClick={onPick}
    >
      {content}
    </Link>
  );
}
