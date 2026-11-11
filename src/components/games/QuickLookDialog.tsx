"use client";
import Image from "next/image";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import type { CSSProperties } from "react";
import type { GamePreview } from "@/types/gamePreview";
import { Dialog } from "@/components/ui/Dialog";
import { Tag } from "@/components/ui/Tag";
import { Arrow } from "@/components/ui/Arrow";
import { PlayButton } from "./PlayButton";
import { SaveGame } from "./SaveGame";
export function QuickLookDialog({
  game,
  onClose,
}: {
  game: GamePreview;
  onClose: () => void;
}) {
  return (
    <Dialog
      open
      onClose={onClose}
      labelId="quick-look-title"
      className="quick-look-dialog"
    >
      <article style={{ "--game": game.accentColor } as CSSProperties}>
        <div className="quick-look-top">
          <p className="label text-muted">A closer look</p>
          <button
            type="button"
            data-initial-focus
            onClick={onClose}
            className="quick-close"
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <figure className="quick-look-cover">
          <Image
            src={game.coverImage.src}
            alt={game.coverImage.alt}
            width={1280}
            height={720}
            sizes="(min-width: 700px) 640px, 100vw"
            quality={60}
          />
          <figcaption>{game.coverImage.caption}</figcaption>
        </figure>
        <div className="quick-look-content">
          <div className="quick-look-status">
            <Tag status={game.status} />
            <SaveGame slug={game.slug} title={game.title} />
          </div>
          <h2 id="quick-look-title">{game.title}</h2>
          <p className="quick-tagline">{game.tagline}</p>
          <p className="quick-description">{game.description}</p>
          <ul className="quick-facts" aria-label="Game details">
            {[...game.genre.slice(0, 2), ...game.platforms.slice(0, 1)].map(
              (item) => (
                <li key={item}>{item}</li>
              ),
            )}
          </ul>
          <div className="quick-look-actions">
            <PlayButton game={game} />
            <Link
              prefetch={false}
              href={`/games/${game.slug}`}
              onClick={onClose}
              className="feature-details"
            >
              Explore the game <Arrow />
            </Link>
          </div>
        </div>
      </article>
    </Dialog>
  );
}
