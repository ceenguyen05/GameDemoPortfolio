import type { Developer } from "@/types/developer";
import { Arrow } from "@/components/ui/Arrow";

/** Shared public links for compact game credits and the full maker profile. */
export function DeveloperLinks({ developer }: { developer: Developer }) {
  if (
    !developer.githubUrl &&
    !developer.linkedinUrl &&
    !developer.email &&
    !developer.websiteUrl
  )
    return null;
  return (
    <div className="developer-links">
      {developer.githubUrl && (
        <a href={developer.githubUrl} target="_blank" rel="noopener noreferrer">
          GitHub <Arrow />
        </a>
      )}
      {developer.linkedinUrl && (
        <a
          href={developer.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn <Arrow />
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
  );
}
