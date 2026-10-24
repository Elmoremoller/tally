import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PlanView } from "@/components/plan/PlanView";
import { needsSafetyCheck, SafetyCheckPage } from "@/components/plan/SafetyCheckPage";
import { SiteNav } from "@/components/SiteNav";
import { previewAllowed, previewCheckIn, previewPlan, previewProgress, sampleViewer } from "@/lib/preview";
import { momentIndex, reviewDue, type ReviewRow } from "@/lib/progress";

// A sample plan, only on a local setup: /plan/preview?type=quick_sparks&day=3&as=partner&review=1
// (see previewPlan in lib/preview.ts for every option, and checkin=day_14 for a check in's card). Answers
// move the sample on without saving anything.
export const metadata: Metadata = { title: "Plan preview · The Couple Standard", robots: { index: false } };

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
  const params = await searchParams;
  if (!previewAllowed) notFound();
  const plan = previewPlan(params);
  const viewer = sampleViewer(plan.type, plan.as);
  if (await needsSafetyCheck(viewer.role)) return <SafetyCheckPage />;

  const now = new Date();
  const progress = previewProgress(plan, now);
  // The sample's earlier steps all count as It helped.
  const history: ReviewRow[] = progress.path
    .slice(0, progress.index)
    .map((stepId, i) => ({ stepId, version: "main", outcome: "helped", at: new Date(now.getTime() - (progress.index - i) * 86_400_000) }));
  const started = new Date(now.getTime() - plan.day * 86_400_000);
  return (
    <PlanView
      ctx={viewer.ctx}
      name={viewer.name}
      role={viewer.role}
      partnerEmail={viewer.row.partner_email}
      progress={progress}
      reviewDue={reviewDue(progress, now)}
      history={history}
      ack={progress.current ? plan.after : null}
      moment={momentIndex(started, now, plan.wants)}
      checkIn={previewCheckIn(params)}
      preview={plan}
    />
  );
}
