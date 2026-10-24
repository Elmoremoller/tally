import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Landing } from "@/components/landing/Landing";
import { offer } from "@/lib/offer";
import { previewAllowed } from "@/lib/preview";
import { placeholderTestimonials } from "@/lib/testimonials";

// The landing page with the placeholder reviews, only on a local setup, to see them even once real ones exist.
// The placeholders live in lib/testimonials.ts and never show on the live site.
export const metadata: Metadata = { title: `Reviews preview · ${offer.name}`, robots: { index: false } };

export default function Page() {
  return (
    <Suspense>
      <Preview />
    </Suspense>
  );
}

async function Preview() {
  // Decided per request, so PLAN_PREVIEW at start up is what counts.
  await connection();
  if (!previewAllowed) notFound();
  return <Landing angle="default" reviews={placeholderTestimonials} />;
}
