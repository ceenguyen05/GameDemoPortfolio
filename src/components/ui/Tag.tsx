import type { GameStatus } from "@/types/game";
import { statusLabels } from "@/lib/gameStatus";
export function Tag({ status }: { status: GameStatus }) {
  return (
    <span className={`status-tag ${status === "live" ? "is-live" : ""}`}>
      <span className="status-dot" aria-hidden="true" />
      {statusLabels[status]}
    </span>
  );
}
