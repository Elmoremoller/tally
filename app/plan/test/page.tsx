import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { PathPlanPage } from "@/components/beginner/PathPlanPage";
import { SiteNav } from "@/components/SiteNav";
import { readAsResponsibilities } from "@/lib/beginner/free-result";
import { startPath } from "@/lib/beginner/workflow";
import { loadPathInput, loadWeek, wantsPath, type PlanRow } from "@/lib/funnel-db";
import { offer } from "@/lib/offer";
import { previewAllowed } from "@/lib/preview";
import { readSessionId } from "@/lib/session-cookie";

// Her paid path from her own quiz, without paying: only on a local setup (a dev server, or a production build started
// with PLAN_PREVIEW=1). Take the quiz at /begin in the same browser, then open /plan/test. The path opens as it would
// right after paying, and its follow up questions and workflows run live, with the real AI call. Nothing touches
// Stripe, prices or checkout, no plan is saved, and "Did it work?" is not saved.
export const maxDuration = 300;
export const metadata: Metadata = { title: `Test path · ${offer.name}`, robots: { index: false } };

export default function Page() {
  return (
    <>
      <SiteNav cta={false} />
      <Suspense fallback={<main id="main" className="plan" aria-busy="true"><Backdrop progress={1} /></main>}>
        <TestPath />
      </Suspense>
    </>
  );
}

async function TestPath() {
  await connection();
  if (!previewAllowed) notFound();
  const session = await readSessionId();
  const { intake } = session ? await loadWeek(session) : { intake: null };
  const shown = intake?.beginner?.shown;
  if (!session || !wantsPath(intake?.beginner) || !shown || !readAsResponsibilities(shown.map)) {
    return (
      <main id="main" className="page-narrow">
        <Backdrop progress={0.3} />
        <h1 className="page-title">No finished quiz in this browser</h1>
        <p className="page-text">Take the quiz at /begin in this browser, up to your free result, then open /plan/test again.</p>
      </main>
    );
  }
  const content = startPath(await loadPathInput({ session_id: session } as PlanRow));
  return <PathPlanPage content={content} token={null} saved={{ answers: {}, phone: null }} />;
}
