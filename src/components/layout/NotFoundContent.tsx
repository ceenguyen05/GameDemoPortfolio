import Link from "next/link";
export function NotFoundContent() {
  return (
    <section className="not-found">
      <p className="eyebrow accent-text">404 / Page not found</p>
      <span className="error-code" aria-hidden="true">
        404
      </span>
      <h1>This page wandered off.</h1>
      <p>
        We couldn’t find that page. Head back to the library and pick your next
        session.
      </p>
      <Link href="/#library" className="play-button">
        Return to library <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
