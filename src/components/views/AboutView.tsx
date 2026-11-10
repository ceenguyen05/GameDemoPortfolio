import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { displayUrl } from "@/lib/format";

const contacts = [
  {
    label: "GitHub",
    value: displayUrl(siteConfig.github),
    href: siteConfig.github,
  },
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
];

export function AboutView() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="py-4">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
        >
          <span aria-hidden="true">←</span> Home
        </Link>
      </nav>

      <section className="grid gap-10 pt-8 pb-section lg:grid-cols-12 lg:gap-6 lg:pt-12">
        <div className="lg:col-span-8">
          <p className="label text-muted">Casey Nguyen · Software engineer</p>
          <h1 className="mt-5 text-display">
            I write code.
            <br />
            Sometimes,
            <br />
            <span className="text-signal">you can play it.</span>
          </h1>
        </div>
        <div className="space-y-5 text-lead text-muted lg:col-span-6 lg:col-start-4">
          <p>
            I’m Casey. I build browser-first games, starting with ACI: Series 1,
            a tactical shooter written in TypeScript and Three.js.
          </p>
          <p>
            I like games you can send as a link. This collection is the home for
            that work: a quick look, the controls, and a straight shot into the
            game.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="contact-title"
        className="grid gap-8 border-t border-line pt-10 lg:grid-cols-12 lg:gap-6"
      >
        <div className="lg:col-span-4">
          <p className="label text-muted">Get in touch</p>
          <h2 id="contact-title" className="mt-3 text-h2">
            Say hello.
          </h2>
          <p className="mt-3 text-muted">
            Source code, questions, or something worth building.
          </p>
        </div>
        <ul className="border-t border-ink lg:col-span-6 lg:col-start-7">
          {contacts.map((contact) => (
            <li key={contact.label} className="border-b border-line">
              <a
                href={contact.href}
                className="group flex min-h-20 items-center justify-between gap-4 py-4"
              >
                <span className="min-w-0">
                  <span className="block text-h3 group-hover:underline group-hover:underline-offset-4">
                    {contact.label}
                  </span>
                  <span className="mt-1 block font-mono text-sm break-all text-muted">
                    {contact.value}
                  </span>
                </span>
                <span aria-hidden="true" className="text-h3">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
