import Image from "next/image";
import type { CSSProperties } from "react";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { Arrow } from "@/components/ui/Arrow";
import { Spark } from "@/components/ui/Spark";
import { DeveloperLinks } from "@/components/makers/DeveloperLinks";
import { games } from "@/content/games";
import { makerProfiles } from "@/content/makerProfiles";
import { getMakers } from "@/lib/makers";
import { catalogNumber } from "@/lib/format";
import { statusLabels } from "@/lib/gameStatus";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

export function MakersView() {
  const makers = getMakers(games);
  return (
    <>
      <section className="makers-intro" aria-labelledby="makers-title">
        <div>
          <p className="label text-signal">The people behind the play</p>
          <h1 id="makers-title">
            Different minds.
            <br />
            <span>Shared curiosity.</span>
          </h1>
          <p className="makers-lead">
            Engineers, experimenters, and friends making things you can play.
            Meet the people turning a spare idea into your next open tab.
          </p>
        </div>
        <div className="makers-stamp">
          <span className="makers-stamp-art" aria-hidden="true">
            <Spark />
          </span>
          <p>
            <strong>{catalogNumber(makers.length)}</strong> makers
          </p>
          <p>
            <strong>{catalogNumber(games.length)}</strong> games in the
            collection
          </p>
          <span className="label">A little good company.</span>
        </div>
      </section>

      <nav className="makers-index" aria-label="Meet a maker">
        {makers.map(({ developer, games: credits }, index) => (
          <Link
            key={developer.slug}
            href={`#${developer.slug}`}
            className="maker-jump"
          >
            <span className="maker-monogram" aria-hidden="true">
              {initials(developer.name)}
            </span>
            <span className="maker-jump-copy">
              <span className="label text-muted">
                Maker {catalogNumber(index + 1)} / {credits.length}{" "}
                {credits.length === 1 ? "game" : "games"}
              </span>
              <strong>{developer.name}</strong>
              <span>
                {makerProfiles[developer.slug]?.role ?? "Game creator"}
              </span>
            </span>
            <Arrow direction="down-right" />
          </Link>
        ))}
      </nav>

      <div className="makers-profiles">
        {makers.map(({ developer, games: credits }, index) => {
          const profile = makerProfiles[developer.slug];
          return (
            <section
              key={developer.slug}
              id={developer.slug}
              tabIndex={-1}
              aria-labelledby={`${developer.slug}-title`}
              className="maker-profile"
            >
              <div className="maker-identity">
                <p className="label text-signal">
                  Meet maker {catalogNumber(index + 1)}
                </p>
                <h2 id={`${developer.slug}-title`}>{developer.name}</h2>
                <p className="maker-role">{profile?.role ?? "Game creator"}</p>
                {developer.bio && <p className="maker-bio">{developer.bio}</p>}
                {profile && (
                  <ul
                    className="maker-specialties"
                    aria-label={`${developer.name}'s interests`}
                  >
                    {profile.specialties.map((specialty) => (
                      <li key={specialty}>{specialty}</li>
                    ))}
                  </ul>
                )}
                <DeveloperLinks developer={developer} />
                <Link href="#main" className="maker-profile-link">
                  Back to the makers <Arrow />
                </Link>
              </div>
              <div className="maker-story">
                {profile && (
                  <>
                    <p className="maker-introduction">{profile.introduction}</p>
                    <div className="maker-background">
                      {profile.sections.map((section, sectionIndex) => (
                        <details
                          key={section.title}
                          open={sectionIndex === 0}
                          className="maker-detail"
                        >
                          <summary>
                            <h3>{section.title}</h3>
                            <span
                              className="maker-detail-toggle"
                              aria-hidden="true"
                            />
                          </summary>
                          <div className="maker-detail-content">
                            {section.entries.map((entry) => (
                              <div className="maker-entry" key={entry.title}>
                                <h4>{entry.title}</h4>
                                {entry.detail && (
                                  <p className="maker-entry-meta">
                                    {entry.detail}
                                  </p>
                                )}
                                <p>{entry.description}</p>
                              </div>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </>
                )}
                <section
                  className="maker-games"
                  aria-labelledby={`${developer.slug}-games`}
                  data-reveal=""
                >
                  <div className="maker-games-heading">
                    <h3 id={`${developer.slug}-games`}>In the collection</h3>
                    <span className="label text-muted">
                      {catalogNumber(credits.length)}
                    </span>
                  </div>
                  <div className="maker-game-list">
                    {credits.map((game) => (
                      <Link
                        key={game.slug}
                        prefetch={false}
                        href={`/games/${game.slug}`}
                        className="maker-game"
                        style={{ "--game": game.accentColor } as CSSProperties}
                      >
                        <div className="maker-game-image">
                          <Image
                            src={game.coverImage.src}
                            alt=""
                            width={180}
                            height={120}
                            sizes="(max-width: 639px) 72px, 112px"
                          />
                        </div>
                        <span className="maker-game-copy">
                          <span className="label text-muted">
                            {statusLabels[game.status]}
                          </span>
                          <strong>{game.title}</strong>
                          <span>{game.tagline}</span>
                        </span>
                        <Arrow />
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            </section>
          );
        })}
      </div>
      <section className="makers-outro" data-reveal="">
        <div>
          <p className="label text-signal">From the makers, to your browser</p>
          <h2>Go on. Try something.</h2>
        </div>
        <Link href="/#library" className="browse-button">
          Explore the games <Arrow />
        </Link>
      </section>
    </>
  );
}
