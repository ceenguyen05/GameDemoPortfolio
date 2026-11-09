import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { HomeView } from "@/components/views/HomeView";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function HomePage() {
  return (
    <PageShell>
      <HomeView />
    </PageShell>
  );
}
