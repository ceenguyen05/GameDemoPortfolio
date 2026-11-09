import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { AboutContent } from "@/components/layout/AboutContent";
export const metadata: Metadata = {
  title: "About Casey",
  description:
    "Casey Nguyen, software engineer building browser-first games. Find the source code and get in touch.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Casey Nguyen",
    description: "Software engineer. Browser-first games.",
    url: "/about",
    images: ["/opengraph-image"],
  },
};
export default function AboutPage() {
  return (
    <PageShell>
      <AboutContent />
    </PageShell>
  );
}
