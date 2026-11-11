"use client";
import { useSavedGames } from "@/hooks/useSavedGames";
import { Bookmark } from "@/components/ui/Bookmark";
export function SaveGame({
  slug,
  title,
  compact = false,
}: {
  slug: string;
  title: string;
  compact?: boolean;
}) {
  const { saved, toggle, sessionOnly } = useSavedGames();
  const active = saved.includes(slug);
  return (
    <button
      type="button"
      className={`save-game ${compact ? "save-game-compact" : ""}`}
      aria-label={`${active ? "Saved" : "Save for later"}: ${title}`}
      aria-pressed={active}
      title={
        active
          ? sessionOnly
            ? "Saved for this visit"
            : "Saved on this device"
          : "Save for later"
      }
      onClick={() => toggle(slug)}
    >
      <Bookmark filled={active} />
      {!compact && <span>{active ? "Saved" : "Save for later"}</span>}
    </button>
  );
}
