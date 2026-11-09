import type { GameStatus } from "@/types/game";
export const statusLabels: Record<GameStatus, string> = {
  live: "Live now",
  "in-development": "In development",
  "coming-soon": "Coming soon",
};
export function Tag({ status }: { status: GameStatus }) {
  return (
    <span className={`status-tag ${status === "live" ? "is-live" : ""}`}>
      <span className="status-dot" aria-hidden="true" />
      {statusLabels[status]}
    </span>
  );
}
