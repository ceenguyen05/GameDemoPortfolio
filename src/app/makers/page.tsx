import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { MakersView } from "@/components/views/MakersView";

const description =
  "Meet the makers behind Playroom's browser games. Explore their backgrounds, engineering work, and the games they are building.";
export const metadata: Metadata = {
  title: "The makers",
  description,
  alternates: { canonical: "/makers" },
  openGraph: {
    title: "The makers",
    description,
    url: "/makers",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "The makers",
    description,
    images: ["/opengraph-image"],
  },
};

export default function MakersPage() {
  return (
    <PageShell>
      <MakersView />
    </PageShell>
  );
}
