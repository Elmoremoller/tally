import type { Metadata } from "next";
import { Landing } from "@/components/landing/Landing";

// Ad links add things like ?utm_source=, so the canonical address tells search engines they are all this one page.
export const metadata: Metadata = { alternates: { canonical: "/" } };

// The landing page with the default headline. An ad's ?angle= is served from app/angle/[angle] instead
// (proxy.ts), so every version is built ahead of time and the headline never flickers.
export default function Home() {
  return <Landing angle="default" />;
}
