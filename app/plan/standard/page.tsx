import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { needsSafetyCheck } from "@/components/plan/SafetyCheckPage";
import { SiteNav } from "@/components/SiteNav";
import { CoupleStandard } from "@/components/standard/CoupleStandard";
import { mainTopic } from "@/lib/plan";
import { previewAllowed } from "@/lib/preview";
import { standardCopy } from "@/lib/standard";
import { loadStandard } from "@/lib/standard-state";
import { supabaseConfigured } from "@/lib/supabase";
import { loadViewer } from "@/lib/viewer";

// Their Couple Standard: what the two of them agree on, in their own words. Only for people who can see
// the plan.
export const metadata: Metadata = {
  title: `${standardCopy.card.title} · The Couple Standard`,
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <SiteNav cta={false} />
      <main id="main" className="plan standard-page">
        <Backdrop part="repair" />
        <Suspense>
          <SignedInStandard />
        </Suspense>
      </main>
    </>
  );
}

async function SignedInStandard() {
  // Always decided per request, from the login cookie.
  await connection();
  if (!supabaseConfigured) redirect(previewAllowed ? "/plan/preview/standard" : "/login");
  const { supabase, viewer, email } = await loadViewer();
  if (!email) redirect("/login");
  // Not paid yet, or an invited partner who hasn't had the safety question: the plan page sees to both.
  if (!viewer?.row.paid_at || (await needsSafetyCheck(viewer.role))) redirect("/plan");

  const state = await loadStandard(supabase, viewer);
  return (
    <CoupleStandard
      names={{ me: viewer.name, partner: viewer.ctx.partnerName }}
      topic={mainTopic(viewer.ctx)}
      topicId={viewer.ctx.topics[0]}
      state={state}
      showInvite={viewer.role === "owner" && !viewer.row.partner_email}
      planHref="/plan"
      preview={false}
    />
  );
}
