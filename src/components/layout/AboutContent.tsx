import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
export function AboutContent() {
  return (
    <>
      <div className="breadcrumb eyebrow">
        <Link href="/">← Back to the collection</Link>
        <span>About Casey</span>
      </div>
      <section className="about-intro">
        <p className="eyebrow accent-text">Casey Nguyen / Software engineer</p>
        <h1>
          I write code.
          <br />
          Sometimes,
          <br />
          <span>you can play it.</span>
        </h1>
        <p>
          I’m Casey. I build browser-first games, starting with ACI: Series 1, a
          tactical shooter built with TypeScript and Three.js.
        </p>
        <p>
          I like games you can send as a link. This collection is a home for
          that work: a quick look, the controls, and a straight shot into the
          game.
        </p>
      </section>
      <section className="contact-section">
        <div>
          <p className="eyebrow accent-text">Get in touch</p>
          <h2>Say hello.</h2>
          <p>Source code, questions, or something worth building.</p>
        </div>
        <div className="contact-links">
          <a href={siteConfig.github}>
            <span>
              GitHub<small>ceenguyen05</small>
            </span>
            <span aria-hidden="true">↗</span>
          </a>
          <a href={`mailto:${siteConfig.email}`}>
            <span>
              Email
              <small>
                {siteConfig.email}
              </small>
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </>
  );
}
