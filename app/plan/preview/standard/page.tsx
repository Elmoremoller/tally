import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { needsSafetyCheck } from "@/components/plan/SafetyCheckPage";
import { SiteNav } from "@/components/SiteNav";
import { CoupleStandard } from "@/components/standard/CoupleStandard";
import { mainTopic } from "@/lib/plan";
import { previewAllowed, previewPlan, previewQuery, previewStandard, sampleViewer } from "@/lib/preview";

// A sample couple's Couple Standard, only on a local setup: /plan/preview/standard?type=slow_simmer&lines=1
// takes the same options as /plan/preview, plus those in previewStandard. Nothing is saved.
export const metadata: Metadata = { title: "Couple Standard preview · The Couple Standard", robots: { index: false } };

export default function Page({ searchParams }: PageProps<"/plan/preview/standard">) {
  return (
    <>
      <SiteNav cta={false} />
      <main id="main" className="plan standard-page">
        <Backdrop part="repair" />
        <Suspense>
          <Preview searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

async function Preview({ searchParams }: { searchParams: PageProps<"/plan/preview/standard">["searchParams"] }) {
  // Reading the address first keeps this page decided per request, so PLAN_PREVIEW at start up is what counts.
  const params = await searchParams;
  if (!previewAllowed) notFound();
  const plan = previewPlan(params);
  const viewer = sampleViewer(plan.type, plan.as);
  const planHref = `/plan/preview?${previewQuery(plan)}`;
  if (await needsSafetyCheck(viewer.role)) redirect(planHref);
  return (
    <CoupleStandard
      names={{ me: viewer.name, partner: viewer.ctx.partnerName }}
      topic={mainTopic(viewer.ctx)}
      topicId={viewer.ctx.topics[0]}
      state={previewStandard(params, viewer)}
      showInvite={viewer.role === "owner" && !viewer.row.partner_email}
      planHref={planHref}
      preview
    />
  );
}
