import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Landing } from "@/components/landing/Landing";
import { offer } from "@/lib/offer";
import { previewAllowed } from "@/lib/preview";
import type { Testimonial } from "@/lib/testimonials";

// The landing page with placeholder reviews, only on a local setup, to see the moving rows before real ones
// exist. The placeholders live here and never on the live page, which only shows lib/testimonials.ts.
export const metadata: Metadata = { title: `Reviews preview · ${offer.name}`, robots: { index: false } };

const placeholders: Testimonial[] = [
  { quote: "Placeholder review. A short one, with **a few words in bold**.", name: "Placeholder A", detail: "Her role, her city" },
  {
    quote: "Placeholder review. This one runs longer, about as long as most real ones, two or three sentences, with **one phrase in bold** in the middle of it.",
    name: "Placeholder B",
    detail: "Her role",
  },
  { quote: "Placeholder review. Medium length, **bold here**, and then a little more after it.", name: "Placeholder C" },
  {
    quote: "Placeholder review. A long one to check the cards share a height and the names line up at the bottom of each card, even when **the words run on** for four lines or more.",
    name: "Placeholder D",
    detail: "Her role, her city",
  },
  { quote: "Placeholder review. **All in bold.**", name: "Placeholder E", detail: "Her role" },
  { quote: "Placeholder review. Medium length again, with **a phrase in bold** at the end.", name: "Placeholder F", detail: "Her city" },
];

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
  return <Landing angle="default" reviews={placeholders} />;
}
