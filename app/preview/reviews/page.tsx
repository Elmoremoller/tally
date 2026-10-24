import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Landing } from "@/components/landing/Landing";
import { offer } from "@/lib/offer";
import { previewAllowed } from "@/lib/preview";
import type { Testimonial } from "@/lib/testimonials";

// The landing page with placeholder reviews, only on a local setup, to show how the page will look once real
// ones exist. The names and words below are invented for that showcase: they live here and never on the live
// page, which only shows real, consented reviews from lib/testimonials.ts.
export const metadata: Metadata = { title: `Reviews preview · ${offer.name}`, robots: { index: false } };

const placeholders: Testimonial[] = [
  {
    quote: "I used to take notes in every single meeting. The plan gave me **one polite line to hand it back**, and it worked the first time.",
    name: "Megan T.",
    detail: "Project coordinator, Columbus",
  },
  {
    quote: "Took the quiz on my lunch break. Seeing my hours written down was **a little embarrassing, honestly**, but so useful.",
    name: "Priya S.",
    detail: "Marketing manager, Austin",
  },
  {
    quote: "My company is weird about AI, so I liked that it **stuck to what we’re actually allowed** to use.",
    name: "Dana L.",
    detail: "Paralegal, Chicago",
  },
  {
    quote: "The work profile for Copilot was **ready to paste**. I had it set up before my coffee got cold.",
    name: "Rachel K.",
    detail: "Executive assistant, Atlanta",
  },
  { quote: "I finally said no to planning the holiday party. **Nobody even blinked.**", name: "Lauren M.", detail: "Account manager, Denver" },
  { quote: "It’s not another course, thankfully. **Ten minutes and I had a plan.**", name: "Keisha W.", detail: "Operations lead, Charlotte" },
  {
    quote: "The script for talking to my manager about AI was the best part. **She asked me to show the whole team.**",
    name: "Emily R.",
    detail: "HR generalist, Minneapolis",
  },
  {
    quote: "I got **about five hours back** in my first week, mostly from status updates I used to write by hand.",
    name: "Sofia G.",
    detail: "Office manager, Phoenix",
  },
  {
    quote: "It felt like it was written by someone who’s sat in my meetings. **Weirdly specific, in a good way.**",
    name: "Hannah B.",
    detail: "Sales coordinator, Nashville",
  },
  {
    quote: "I’d been using ChatGPT in secret for months. Now **I use it out in the open** and get credit for it.",
    name: "Jasmine P.",
    detail: "Financial analyst, Seattle",
  },
  { quote: "Sent it to two friends at work the same day. **We’re all handing stuff back now.**", name: "Caroline D.", detail: "Program manager, Boston" },
  {
    quote: "The visibility plan picked one project for me to own. **My review this year was the best I’ve had.**",
    name: "Natalie H.",
    detail: "Recruiter, San Diego",
  },
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
