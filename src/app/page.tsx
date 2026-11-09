import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { HomeContent } from "@/components/layout/HomeContent";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function HomePage() {
  return (
    <PageShell>
      <HomeContent />
    </PageShell>
  );
}
