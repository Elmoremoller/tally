import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { PlanView } from "@/components/plan/PlanView";
import { needsSafetyCheck, SafetyCheckPage } from "@/components/plan/SafetyCheckPage";
import { SiteNav } from "@/components/SiteNav";
import { loadPlanState } from "@/lib/plan-state";
import { previewAllowed } from "@/lib/preview";
import { ACKS, type Ack } from "@/lib/progress";
import { supabaseConfigured } from "@/lib/supabase";
import { loadViewer } from "@/lib/viewer";

// Only people who paid, and partners they invited, can see a plan. Everyone else is sent to log in.
export const metadata: Metadata = {
  title: "Your plan · The Couple Standard",
  robots: { index: false },
};

export default function Page({ searchParams }: PageProps<"/plan">) {
  return (
    <>
      <SiteNav cta={false} />
      <Suspense
        fallback={
          <main id="main" className="plan" aria-busy="true">
            <Backdrop />
          </main>
        }
      >
        <SignedInPlan searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function SignedInPlan({ searchParams }: { searchParams: PageProps<"/plan">["searchParams"] }) {
  // Always decided per request, from the login cookie.
  await connection();
  if (!supabaseConfigured) redirect(previewAllowed ? "/plan/preview" : "/login");
  const { supabase, viewer, email } = await loadViewer();
  if (!email) redirect("/login");

  if (!viewer?.row.paid_at) {
    return (
      <main id="main" className="page-narrow">
        <Backdrop progress={0.3} />
        <h1 className="page-title">Your plan isn’t open yet</h1>
        <p className="page-text">
          We couldn’t find a paid plan for <strong>{email}</strong>. If you just paid, give it a minute and refresh.
        </p>
        <Link href="/start" className="btn btn-lg page-cta">
          Take the quiz
        </Link>
      </main>
    );
  }

  // An invited partner never took the quiz, so they get its safety question first, privately, once.
  if (await needsSafetyCheck(viewer.role)) return <SafetyCheckPage />;

  const state = await loadPlanState(supabase, viewer);
  // After an answer, the line for it shows once above the step it led to.
  const { after } = await searchParams;
  const ack = (ACKS as readonly unknown[]).includes(after) ? (after as Ack) : null;
  return (
    <PlanView
      ctx={viewer.ctx}
      name={viewer.name}
      role={viewer.role}
      partnerEmail={viewer.row.partner_email}
      progress={state.progress}
      reviewDue={state.reviewDue}
      history={state.counted}
      ack={ack}
      moment={state.moment}
      checkIn={state.checkIn}
    />
  );
}
