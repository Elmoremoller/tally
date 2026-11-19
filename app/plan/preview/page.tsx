import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BeginnerPlanPage } from "@/components/beginner/BeginnerPlanPage";
import { PathPlanPage } from "@/components/beginner/PathPlanPage";
import { writtenPaths } from "@/lib/beginner/path-samples-written";
import { pathV4Samples } from "@/lib/beginner/path-v4-samples";
import { startPath } from "@/lib/beginner/workflow";
import { PlanPage } from "@/components/plan/PlanPage";
import { PlanWaiting } from "@/components/plan/PlanWaiting";
import { SiteNav } from "@/components/SiteNav";
import { beginnerSampleFor } from "@/lib/beginner/samples";
import { offer } from "@/lib/offer";
import { planSamples } from "@/lib/plan-samples";
import { previewAllowed } from "@/lib/preview";

// A sample plan, only on a local setup. /plan/preview shows the marketing coordinator's plan; add
// ?sample=law_firm for the executive assistant's, ?sample=dental, salon or nurse for a beginner plan,
// ?sample=path_dental, path_salon, path_planner or path_tutor for a paid path (Phase 6; Did it work is not saved,
// and the phone is kept in this browser only), ?sample=v4_office, v4_property or v4_hr for a Phase 10 path with
// both workflows written (add &fresh=1 to start it from the top, where writing a workflow calls the AI), &state=pending or &state=failed for the waiting page, and
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
  const { sample, state, welcome, fresh } = await searchParams;
  if (!previewAllowed) notFound();
  const content = sample === "law_firm" ? planSamples.law_firm : planSamples.marketing;
  const note = welcome === "1" ? { email: "you@example.com", token: null } : null;
  if (state === "pending" || state === "failed") return <PlanWaiting failed={state === "failed"} welcome={note} />;
  const path = typeof sample === "string" && sample.startsWith("path_") ? writtenPaths[sample.slice(5)] : undefined;
  if (path) return <PathPlanPage content={path} token={null} saved={{ answers: {}, phone: null }} welcome={note} />;
  const v4 = typeof sample === "string" ? pathV4Samples[sample] : undefined;
  if (v4 && typeof sample === "string")
    return (
      <PathPlanPage
        content={fresh === "1" ? startPath(v4.input) : v4.path}
        token={null}
        saved={{ answers: {}, phone: null }}
        welcome={note}
        sample={sample}
      />
    );
  const beginner = beginnerSampleFor(sample);
  if (beginner) return <BeginnerPlanPage content={beginner.plan} welcome={note} />;
  return <PlanPage content={content} welcome={note} />;
}
