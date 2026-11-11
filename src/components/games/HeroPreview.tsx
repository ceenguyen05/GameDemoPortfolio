"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import type { GameImage } from "@/types/game";
import { catalogNumber } from "@/lib/format";

const SIZES = "(min-width: 1440px) 800px, (min-width: 1024px) 55vw, 100vw";

/**
 * The large image in a game's feature panel, with numbered buttons to switch
 * between the cover and screenshots. ← → move between buttons. The chosen
 * image fades in over the previous one.
 */
export function HeroPreview({
  images,
  priority = true,
}: {
  images: GameImage[];
  priority?: boolean;
}) {
  const [selected, setSelected] = useState(0);
  const [ready, setReady] = useState<string | null>(null);
  const lastLoaded = useRef(0);
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);
  const [previous, setPrevious] = useState<number | null>(null);
  const active = images[selected];
  const below = previous === null ? null : images[previous];
  const isFirstPaint = priority && selected === 0 && previous === null;

  const choose = (next: number) => {
    if (next === selected) return;
    setPrevious(lastLoaded.current);
    setSelected(next);
  };

  return (
    <figure className="hero-preview">
      <div
        className="preview-image"
        aria-busy={below !== null && ready !== active.src}
        onPointerDown={(event) => {
          if (
            event.pointerType !== "touch" ||
            !event.isPrimary ||
            images.length < 2 ||
            (event.target as Element).closest("button")
          )
            return;
          swipe.current = {
            x: event.clientX,
            y: event.clientY,
            id: event.pointerId,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          const start = swipe.current;
          swipe.current = null;
          if (!start || start.id !== event.pointerId) return;
          const dx = event.clientX - start.x,
            dy = event.clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4)
            choose(
              (selected + (dx < 0 ? 1 : -1) + images.length) % images.length,
            );
        }}
        onPointerCancel={() => {
          swipe.current = null;
        }}
      >
        {below && (
          <Image
            key={`below-${below.src}`}
            src={below.src}
            alt=""
            fill
            quality={60}
            sizes={SIZES}
            className="object-cover"
          />
        )}
        <Image
          key={active.src}
          src={active.src}
          alt={active.alt}
          fill
          preload={isFirstPaint}
          fetchPriority={isFirstPaint ? "high" : "auto"}
          quality={60}
          sizes={SIZES}
          onLoad={() => {
            lastLoaded.current = selected;
            setReady(active.src);
          }}
          className={`preview-current object-cover ${below ? (ready === active.src ? "preview-enter" : "preview-loading") : ""}`}
        />
        {images.length > 1 && (
          <div className="preview-navigation">
            <button
              type="button"
              aria-label="Previous preview"
              onClick={() =>
                choose((selected - 1 + images.length) % images.length)
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m14 6-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next preview"
              onClick={() => choose((selected + 1) % images.length)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m10 6 6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
        <span className="preview-counter" aria-hidden="true">
          {catalogNumber(selected + 1)} / {catalogNumber(images.length)}
        </span>
      </div>
      {images.length > 1 && (
        <div className="preview-progress" aria-hidden="true">
          {images.map((img, index) => (
            <span key={img.src} data-active={selected === index} />
          ))}
        </div>
      )}
      <div className="preview-bar">
        <figcaption aria-live="polite">{active.caption}</figcaption>
        {images.length > 1 && (
          <div
            className="preview-options"
            role="group"
            aria-label="Choose a preview"
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
                return;
              event.preventDefault();
              const step = event.key === "ArrowRight" ? 1 : -1;
              const buttons = [
                ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
                  "button",
                ),
              ];
              // Step from the focused button; it may not be the selected one.
              const focused = buttons.indexOf(
                event.target as HTMLButtonElement,
              );
              const from = focused === -1 ? selected : focused;
              const next = (from + step + images.length) % images.length;
              choose(next);
              buttons[next]?.focus();
            }}
          >
            {images.map((item, index) => {
              const number = catalogNumber(index + 1);
              return (
                <button
                  key={item.src}
                  type="button"
                  // Starts with the visible number so voice control can target it.
                  aria-label={`${number}: preview ${item.caption}`}
                  aria-pressed={selected === index}
                  onClick={() => choose(index)}
                >
                  {number}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </figure>
  );
}
