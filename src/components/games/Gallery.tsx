"use client";
import Image from "next/image";
import { useState } from "react";
import type { GameImage } from "@/types/game";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Keycap } from "@/components/ui/Keycap";
import { catalogNumber } from "@/lib/format";

/**
 * Screenshot grid with a lightbox. The first image runs full width. The
 * lightbox is a native modal dialog: ← → step through images, Esc closes,
 * and focus returns to the thumbnail that opened it.
 */
export function Gallery({ images }: { images: GameImage[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  if (!images.length) return null;
  const index = selected ?? 0;
  const current = images[index];
  const step = (delta: number) =>
    setSelected(
      (value) => ((value ?? 0) + delta + images.length) % images.length,
    );

  return (
    <section aria-labelledby="gallery-title" className="defer-render">
      <div className="flex items-baseline justify-between gap-4 border-t border-ink pt-3">
        <h2 id="gallery-title" className="label">
          Gallery
        </h2>
        <p className="label text-muted">
          {images.length} {images.length === 1 ? "capture" : "captures"}
        </p>
      </div>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {images.map((image, position) => (
          <li key={image.src} className={position === 0 ? "sm:col-span-2" : ""}>
            <button
              type="button"
              onClick={() => setSelected(position)}
              className="group block w-full text-left"
            >
              <span className="relative block aspect-video overflow-hidden border border-line bg-sunken transition-colors duration-100 group-hover:border-game">
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes={
                    position === 0
                      ? "(min-width: 1440px) 900px, (min-width: 1024px) 62vw, 100vw"
                      : "(min-width: 1440px) 450px, (min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
                  }
                  className="object-cover"
                />
              </span>
              <span className="mt-2 flex justify-between gap-4 font-mono text-xs text-muted">
                <span>
                  <span className="sr-only">Enlarge: {image.alt}. </span>
                  {catalogNumber(position + 1)} — {image.caption}
                </span>
                <span aria-hidden="true">Enlarge ↗</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        labelId="lightbox-title"
        className="w-[min(75rem,calc(100%-2rem))]"
      >
        <div
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              step(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
        >
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-1 sm:px-6">
            <h2 id="lightbox-title" className="label">
              {catalogNumber(index + 1)} — {current.caption}
            </h2>
            <button
              type="button"
              autoFocus
              data-initial-focus
              onClick={() => setSelected(null)}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold"
            >
              Close <Keycap>Esc</Keycap>
            </button>
          </div>
          <Image
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            sizes="(min-width: 1232px) 1200px, 100vw"
            className="block h-auto max-h-[70dvh] w-full bg-ink object-contain"
          />
          <div className="flex items-center justify-between gap-4 border-t border-line px-2 py-1 sm:px-4">
            <Button variant="text" onClick={() => step(-1)}>
              <span aria-hidden="true">←</span> Previous
            </Button>
            <p aria-live="polite" className="font-mono text-xs text-muted">
              {index + 1} / {images.length}
            </p>
            <Button variant="text" onClick={() => step(1)}>
              Next <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>
      </Dialog>
    </section>
  );
}
