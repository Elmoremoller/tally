import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { CheckInFlow } from "@/components/check-in/CheckInFlow";
import { NothingDue } from "@/components/check-in/NothingDue";
import { needsSafetyCheck } from "@/components/plan/SafetyCheckPage";
import { SiteNav } from "@/components/SiteNav";
import { previewAllowed, previewCheckIn, previewPlan, previewQuery, sampleViewer } from "@/lib/preview";

// A sample check in, only on a local setup: /plan/preview/check-in?type=slow_simmer&checkin=day_14 takes the
// same options as /plan/preview, with checkin set to start (the default), day_14, day_30 or none. Nothing is
// saved.
export const metadata: Metadata = { title: "Check in preview · The Couple Standard", robots: { index: false } };

export default function Page({ searchParams }: PageProps<"/plan/preview/check-in">) {
  return (
    <>
      <SiteNav cta={false} />
      <main id="main" className="plan checkin-page">
        <Backdrop part="prevent" />
        <Suspense>
          <Preview searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

async function Preview({ searchParams }: { searchParams: PageProps<"/plan/preview/check-in">["searchParams"] }) {
  // Reading the address first keeps this page decided per request, so PLAN_PREVIEW at start up is what counts.
  const params = await searchParams;
  if (!previewAllowed) notFound();
  const plan = previewPlan(params);
  const viewer = sampleViewer(plan.type, plan.as);
  const query = previewQuery(plan);
  if (await needsSafetyCheck(viewer.role)) redirect(`/plan/preview?${query}`);
  const id = params.checkin === "none" ? null : (previewCheckIn(params) ?? "start");
  if (!id) return <NothingDue planHref={`/plan/preview?${query}`} />;
  return (
    <CheckInFlow id={id} planHref={`/plan/preview?${query}`} nowHref={`/plan/preview/now?${query}`} preview askQuote />
  );
}
