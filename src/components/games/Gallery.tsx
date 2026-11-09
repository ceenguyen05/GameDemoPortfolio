"use client";
import Image from "next/image";
import { useState } from "react";
import type { GameImage } from "@/types/game";
import { Dialog } from "@/components/ui/Dialog";
export function Gallery({ images }: { images: GameImage[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  if (!images.length) return null;
  const current = images[selected ?? 0];
  const step = (delta: number) =>
    setSelected(
      (value) => ((value ?? 0) + delta + images.length) % images.length,
    );
  return (
    <section className="gallery" aria-labelledby="gallery-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow accent-text">A closer look</p>
          <h2 id="gallery-title">See it in action.</h2>
        </div>
        <span className="eyebrow">Select to enlarge ↗</span>
      </div>
      <div className="gallery-grid">
        {images.map((item, index) => (
          <button
            key={item.src}
            className="gallery-item"
            type="button"
            onClick={() => setSelected(index)}
            aria-label={`Enlarge image ${index + 1}: ${String(index + 1).padStart(2, "0")} / ${item.caption}`}
          >
            <span className="gallery-image">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 760px) 100vw, 33vw"
              />
            </span>
            <span className="gallery-caption">
              <span>
                {String(index + 1).padStart(2, "0")} / {item.caption}
              </span>
              <span aria-hidden="true">↗</span>
            </span>
          </button>
        ))}
      </div>
      <Dialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        labelId="gallery-dialog-title"
        className="lightbox"
      >
        <div
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              step(-1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              step(1);
            }
          }}
        >
          <div className="dialog-top">
            <h3 id="gallery-dialog-title" className="eyebrow">
              {current.caption}
            </h3>
            <button
              className="text-button"
              type="button"
              autoFocus
              onClick={() => setSelected(null)}
              aria-label="Close image gallery"
            >
              Close ×
            </button>
          </div>
          <Image
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            sizes="95vw"
            className="lightbox-image"
          />
          <div className="lightbox-controls">
            <button
              className="text-button"
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
            >
              ← Previous
            </button>
            <span className="eyebrow" aria-live="polite">
              {(selected ?? 0) + 1} / {images.length}
            </span>
            <button
              className="text-button"
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
            >
              Next →
            </button>
          </div>
        </div>
      </Dialog>
    </section>
  );
}
