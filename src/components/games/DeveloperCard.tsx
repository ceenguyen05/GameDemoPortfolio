import type { Developer } from "@/types/developer";
import { Arrow } from "@/components/ui/Arrow";

/** "Meet the maker": the developer of this game, with only the links they supplied. */
export function DeveloperCard({ developer }: { developer: Developer }) {
  const initials = developer.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  return (
    <section
      className="developer-card"
      aria-labelledby="developer-title"
      data-reveal=""
    >
      <div className="developer-avatar" aria-hidden="true">
        {initials}
      </div>
      <div>
        <p className="label text-muted">Meet the maker</p>
        <h2 id="developer-title">{developer.name}</h2>
        {developer.bio && <p className="developer-bio">{developer.bio}</p>}
        <div className="developer-links">
          {developer.githubUrl && (
            <a
              href={developer.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <Arrow />
            </a>
          )}
          {developer.email && (
            <a href={`mailto:${developer.email}`}>{developer.email}</a>
          )}
          {developer.websiteUrl && (
            <a
              href={developer.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Website <Arrow />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
