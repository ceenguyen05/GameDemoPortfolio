"use client";
import { useEffect, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Copies the game page's public URL. If the clipboard is blocked, shows the
 * link in a field the visitor can select and copy by hand.
 */
export function ShareGame({ title, path }: { title: string; path: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");
  const url = siteConfig.url + path;

  // Return to the resting label so the link can be copied again.
  useEffect(() => {
    if (status !== "copied") return;
    const timer = setTimeout(() => setStatus("idle"), 2500);
    return () => clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("manual");
    }
  }

  return (
    <section className="share-game" aria-label={`Share ${title}`}>
      <div>
        <p className="label text-muted">Better with company</p>
        <h2>Pass this one along.</h2>
      </div>
      <button type="button" onClick={copy} className="browse-button">
        {status === "copied" ? (
          "Link copied ✓"
        ) : (
          <>
            Copy game link <Arrow />
          </>
        )}
      </button>
      <p
        role="status"
        className={status === "manual" ? "share-note" : "sr-only"}
      >
        {status === "copied" && "Game page link copied to clipboard."}
        {status === "manual" && "Copy this link to share the game:"}
      </p>
      {status === "manual" && (
        <input
          aria-label="Game page link"
          readOnly
          value={url}
          onFocus={(event) => event.currentTarget.select()}
          className="share-fallback"
        />
      )}
    </section>
  );
}
