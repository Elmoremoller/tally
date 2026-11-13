import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Landing } from "@/components/landing/Landing";
import { beginnerOffer } from "@/lib/beginner/copy";
import { angleFor, angles, isBeginner, offer } from "@/lib/offer";

// The landing page for one ad angle, built ahead of time for every angle in lib/offer.ts. proxy.ts serves it
// for /?angle=<id>, so the address people see stays the landing page's. Search engines are pointed at /.
// A beginner angle also gets the beginner version's title and description.
export async function generateMetadata({ params }: PageProps<"/angle/[angle]">): Promise<Metadata> {
  const { angle } = await params;
  const canonical = { alternates: { canonical: "/" } };
  if (!isBeginner(angleFor(angle))) return canonical;
  const title = `${offer.name} | ${beginnerOffer.meta.title}`;
  const { description } = beginnerOffer.meta;
  return { ...canonical, title, description, openGraph: { title, description, siteName: offer.name, type: "website" } };
}

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
