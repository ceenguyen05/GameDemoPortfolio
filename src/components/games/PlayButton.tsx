import { statusLabels } from "@/components/ui/Tag";
import type { Game } from "@/types/game";
export function PlayButton({
  game,
  compact = false,
}: {
  game: Game;
  compact?: boolean;
}) {
  if (game.status !== "live")
    return (
      <div className="launch-group">
        <button type="button" className="play-button locked" disabled>
          <span aria-hidden="true">⊠</span>
          {statusLabels[game.status]}
        </button>
        <span className="destination">No launch date announced</span>
      </div>
    );
  return (
    <div className={`launch-group ${compact ? "compact" : ""}`}>
      <a
        className="play-button"
        href={game.playUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Play now: ${game.title} (opens in a new tab)`}
      >
        <span aria-hidden="true" className="play-triangle">
          ▶
        </span>
        <span>Play now</span>
        <span aria-hidden="true" className="launch-arrow">
          ↗
        </span>
      </a>
      <span className="destination">
        {new URL(game.playUrl).hostname} <span aria-hidden="true">↗</span>
        <span className="launch-note">Opens in a new tab</span>
      </span>
    </div>
  );
}
