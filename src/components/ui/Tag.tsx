import type { GameStatus } from "@/types/game";
import { statusLabels } from "@/lib/gameStatus";

export function Tag({ status }: { status: GameStatus }) {
  const live = status === "live";
  return (
    <span
      className={`label inline-flex items-center gap-2 whitespace-nowrap ${live ? "text-signal" : "text-muted"}`}
    >
      <span
        aria-hidden="true"
        className={`size-2 ${live ? "bg-signal" : "border border-current"}`}
      />
      {statusLabels[status]}
    </span>
  );
}
