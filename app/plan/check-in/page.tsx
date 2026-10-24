import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { CheckInFlow } from "@/components/check-in/CheckInFlow";
import { NothingDue } from "@/components/check-in/NothingDue";
import { needsSafetyCheck } from "@/components/plan/SafetyCheckPage";
import { SiteNav } from "@/components/SiteNav";
import { loadCheckIn, quoteReady } from "@/lib/check-in-state";
import { previewAllowed } from "@/lib/preview";
import { supabaseConfigured } from "@/lib/supabase";
import { loadViewer } from "@/lib/viewer";

// The check in that's due, for people who can see the plan. It's also the link to send by email: someone
// signed out signs in first and comes back here (see lib/after-sign-in.ts).
export const metadata: Metadata = {
  title: "How’s it going? · The Couple Standard",
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <SiteNav cta={false} />
      <main id="main" className="plan checkin-page">
        <Backdrop part="prevent" />
        <Suspense>
          <SignedInCheckIn />
        </Suspense>
      </main>
    </>
  );
}

async function SignedInCheckIn() {
  // Always decided per request, from the login cookie.
  await connection();
  if (!supabaseConfigured) redirect(previewAllowed ? "/plan/preview/check-in" : "/login");
  const { supabase, viewer, email } = await loadViewer();
  if (!email) redirect("/login");
  // Not paid yet, or an invited partner who hasn't had the safety question: the plan page sees to both.
  if (!viewer?.row.paid_at || (await needsSafetyCheck(viewer.role))) redirect("/plan");

  const [id, askQuote] = await Promise.all([loadCheckIn(supabase, viewer), quoteReady(supabase)]);
  if (!id) return <NothingDue planHref="/plan" />;
  return <CheckInFlow id={id} planHref="/plan" nowHref="/plan/now" preview={false} askQuote={askQuote} />;
}
