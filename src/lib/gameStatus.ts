import type { GameStatus } from "@/types/game";

export const statusLabels: Record<GameStatus, string> = {
  live: "Live",
  "in-development": "In development",
  "coming-soon": "Coming soon",
};

export const statusOrder: GameStatus[] = [
  "live",
  "in-development",
  "coming-soon",
];
