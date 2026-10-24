import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { PlanPage } from "@/components/plan/PlanPage";
import { PlanWaiting } from "@/components/plan/PlanWaiting";
import { SiteNav } from "@/components/SiteNav";
import { orderEmail, planByToken } from "@/lib/funnel-db";
import { offer } from "@/lib/offer";
import { planCopy } from "@/lib/plan-copy";
import { writePlanAfterResponse } from "@/lib/plan-generation";
import type { PlanContent } from "@/lib/plan-writer";

// Her plan's private page. The long random token in the address is the only way in. While the plan is
// being written it shows a calm waiting page that refreshes itself, and picks the writing up again if no
// attempt is running, so a paid plan always gets written. Kept out of search results.
export const maxDuration = 300;
export const metadata: Metadata = {
  title: `Your plan · ${offer.name}`,
  robots: { index: false },
};

export default function Page({ params, searchParams }: PageProps<"/plan/[token]">) {
  return (
    <>
      <SiteNav cta={false} />
      <Suspense
        fallback={
          <main id="main" className="plan" aria-busy="true">
            <Backdrop progress={1} />
          </main>
        }
      >
        <TokenPlan params={params} searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function TokenPlan({
  params,
  searchParams,
}: {
  params: PageProps<"/plan/[token]">["params"];
  searchParams: PageProps<"/plan/[token]">["searchParams"];
}) {
  // Always decided per request: the plan is read from the database every time.
  await connection();
  const { token } = await params;
  const { welcome } = await searchParams;
  const plan = await planByToken(token);
  if (!plan) {
    return (
      <main id="main" className="page-narrow">
        <Backdrop progress={0.3} />
        <h1 className="page-title">{planCopy.notFoundTitle}</h1>
        <p className="page-text">{planCopy.notFoundText}</p>
        <Link href="/login" className="btn btn-lg page-cta">
          Send me a link
        </Link>
      </main>
    );
  }

  const email = welcome === "1" ? await orderEmail(plan.order_id).catch(() => null) : null;
  const note = email ? { email, token } : null;
  const content = plan.content as PlanContent | null;
  if (plan.status === "ready" && content?.version === 1) return <PlanPage content={content} welcome={note} />;

  // The database starts an attempt only when none is running (or one stopped over 3 minutes ago).
  if (plan.status === "pending") await writePlanAfterResponse(plan.id);
  return <PlanWaiting failed={plan.status === "failed"} welcome={note} />;
}
