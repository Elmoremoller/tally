import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { FightHelp } from "@/components/fight-help/FightHelp";
import { needsSafetyCheck } from "@/components/plan/SafetyCheckPage";
import { SiteNav } from "@/components/SiteNav";
import { helpStart } from "@/lib/fight-help";
import { previewAllowed, previewPlan, previewQuery, sampleViewer } from "@/lib/preview";

// The help after a fight for a sample couple, only on a local setup: /plan/preview/now?type=quick_sparks&go=repair
// takes the same options as /plan/preview. Nothing is saved.
export const metadata: Metadata = { title: "Help preview · The Couple Standard", robots: { index: false } };

export default function Page({ searchParams }: PageProps<"/plan/preview/now">) {
  return (
    <>
      <SiteNav cta={false} />
      <main id="main" className="plan help-page">
        <Backdrop part="pause" />
        <Suspense>
          <Preview searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

async function Preview({ searchParams }: { searchParams: PageProps<"/plan/preview/now">["searchParams"] }) {
  // Reading the address first keeps this page decided per request, so PLAN_PREVIEW at start up is what counts.
  const params = await searchParams;
  if (!previewAllowed) notFound();
  const plan = previewPlan(params);
  const viewer = sampleViewer(plan.type, plan.as);
  const planHref = `/plan/preview?${previewQuery(plan)}`;
  if (await needsSafetyCheck(viewer.role)) redirect(planHref);
  return (
    <FightHelp
      names={{ me: viewer.name, partner: viewer.ctx.partnerName }}
      entry={{ name: "how" }}
      go={helpStart(params.go)}
      planHref={planHref}
      save={null}
    />
  );
}
