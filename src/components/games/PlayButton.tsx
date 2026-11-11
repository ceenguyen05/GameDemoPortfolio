import type { GameLaunch } from "@/types/gamePreview";
import { Arrow } from "@/components/ui/Arrow";
import { statusLabels } from "@/lib/gameStatus";
import { hostname } from "@/lib/format";

/**
 * The launch control. Live games get a real anchor to the game's own site,
 * opened in a new tab so the hub stays put; nothing is JavaScript-driven.
 * Games that aren't live get a disabled control with their status.
 */
export function PlayButton({
  game,
  size = "lg",
}: {
  game: GameLaunch;
  size?: "lg" | "md";
}) {
  if (game.status !== "live")
    return (
      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          disabled
          className="inline-flex min-h-12 cursor-not-allowed items-center gap-3 rounded-control border border-dashed border-line-strong bg-sunken px-4 font-semibold text-muted"
        >
          <svg aria-hidden="true" viewBox="0 0 12 14" className="h-3.5 w-3">
            <rect x="1" y="6" width="10" height="7.5" fill="currentColor" />
            <path
              d="M3 6V4a3 3 0 0 1 6 0v2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
          {statusLabels[game.status]}
        </button>
        <p className="font-mono text-xs text-muted">Not playable yet</p>
      </div>
    );

  return (
    <div className="flex flex-col items-start gap-2">
      <a
        href={game.playUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-sound="launch"
        // Starts with the visible text, so voice control ("click Play now") still works.
        aria-label={`Play now: ${game.title} (opens in a new tab)`}
        className={`play ${size === "md" ? "play-md" : ""}`}
      >
        <span className="play-block" aria-hidden="true">
          <svg viewBox="0 0 10 12" className="h-3 w-2.5">
            <path d="M0 0 10 6 0 12Z" fill="currentColor" />
          </svg>
        </span>
        <span className="play-text">
          <span>Play now</span>
          <span aria-hidden="true" className="play-arrow">
            <Arrow />
          </span>
        </span>
      </a>
      <p className="font-mono text-xs text-muted">
        {hostname(game.playUrl)} <Arrow />
        {/* Tiles are narrow: the link's accessible name already says "new tab". */}
        {size === "lg" && " · opens in a new tab"}
      </p>
    </div>
  );
}
