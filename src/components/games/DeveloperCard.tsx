import type { Developer } from "@/types/developer";
import { Arrow } from "@/components/ui/Arrow";
import { SiteLink } from "@/components/ui/SiteLink";
import { DeveloperLinks } from "@/components/makers/DeveloperLinks";

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
        <DeveloperLinks developer={developer} />
        <SiteLink
          href={`/makers#${developer.slug}`}
          className="maker-profile-link"
        >
          More about {developer.name} <Arrow />
        </SiteLink>
      </div>
    </section>
  );
}
