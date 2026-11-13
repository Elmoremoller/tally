import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BeginnerPlanPage } from "@/components/beginner/BeginnerPlanPage";
import { PlanPage } from "@/components/plan/PlanPage";
import { PlanWaiting } from "@/components/plan/PlanWaiting";
import { SiteNav } from "@/components/SiteNav";
import { beginnerSampleFor } from "@/lib/beginner/samples";
import { offer } from "@/lib/offer";
import { planSamples } from "@/lib/plan-samples";
import { previewAllowed } from "@/lib/preview";

// A sample plan, only on a local setup. /plan/preview shows the marketing coordinator's plan; add
// ?sample=law_firm for the executive assistant's, ?sample=dental, salon or nurse for a beginner plan, &state=pending or &state=failed for the waiting page, and
// &welcome=1 for the note shown right after paying. Nothing is saved or sent.
export const metadata: Metadata = { title: `Plan preview · ${offer.name}`, robots: { index: false } };

export default function Page({ searchParams }: PageProps<"/plan/preview">) {
  return (
    <>
      <SiteNav cta={false} />
      <Suspense>
        <Preview searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Preview({ searchParams }: { searchParams: PageProps<"/plan/preview">["searchParams"] }) {
  // Reading the address first keeps this page decided per request, so PLAN_PREVIEW at start up is what counts.
  const { sample, state, welcome } = await searchParams;
  if (!previewAllowed) notFound();
  const content = sample === "law_firm" ? planSamples.law_firm : planSamples.marketing;
  const note = welcome === "1" ? { email: "you@example.com", token: null } : null;
  if (state === "pending" || state === "failed") return <PlanWaiting failed={state === "failed"} welcome={note} />;
  const beginner = beginnerSampleFor(sample);
  if (beginner) return <BeginnerPlanPage content={beginner.plan} welcome={note} />;
  return <PlanPage content={content} welcome={note} />;
}
