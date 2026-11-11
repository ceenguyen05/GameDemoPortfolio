import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { AboutView } from "@/components/views/AboutView";
export const metadata: Metadata = {
  title: "About the collection",
  description:
    "A shared home for browser games, their creators, and the people who play them.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About the collection",
    description: "Small games. Good company.",
    url: "/about",
    images: ["/opengraph-image"],
  },
};
export default function AboutPage() {
  return (
    <PageShell>
      <AboutView />
    </PageShell>
  );
}
