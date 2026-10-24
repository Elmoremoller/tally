import { Landing } from "@/components/landing/Landing";

// The landing page with the default headline. An ad's ?angle= is served from app/angle/[angle] instead
// (proxy.ts), so every version is built ahead of time and the headline never flickers.
export default function Home() {
  return <Landing angle="default" />;
}
