import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Landing } from "@/components/landing/Landing";
import { angleFor, angles } from "@/lib/offer";

// The landing page for one ad angle, built ahead of time for every angle in lib/offer.ts. proxy.ts serves it
// for /?angle=<id>, so the address people see stays the landing page's. Search engines are pointed at /.
export const metadata: Metadata = { alternates: { canonical: "/" } };

export function generateStaticParams() {
  return Object.keys(angles)
    .filter((angle) => angle !== "default")
    .map((angle) => ({ angle }));
}

export default async function Page({ params }: PageProps<"/angle/[angle]">) {
  const { angle } = await params;
  const id = angleFor(angle);
  if (id === "default") notFound();
  return <Landing angle={id} />;
}
