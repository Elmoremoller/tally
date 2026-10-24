import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { FightHelp } from "@/components/fight-help/FightHelp";
import { needsSafetyCheck } from "@/components/plan/SafetyCheckPage";
import { SiteNav } from "@/components/SiteNav";
import { helpCopy, helpStart } from "@/lib/fight-help";
import { previewAllowed } from "@/lib/preview";
import { supabaseConfigured } from "@/lib/supabase";
import { loadViewer } from "@/lib/viewer";
import { saveRepairAgreement } from "../actions";

// Help for right after a fight, from the box at the top of the plan and from four of its steps
// (?go=repair, ?go=pause). Only for people who can see the plan.
export const metadata: Metadata = {
  title: `${helpCopy.box.title} · The Couple Standard`,
  robots: { index: false },
};

export default function Page({ searchParams }: PageProps<"/plan/now">) {
  return (
    <>
      <SiteNav cta={false} />
      <main id="main" className="plan help-page">
        <Backdrop part="pause" />
        <Suspense>
          <SignedInHelp searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

async function SignedInHelp({ searchParams }: { searchParams: PageProps<"/plan/now">["searchParams"] }) {
  // Always decided per request, from the login cookie.
  await connection();
  if (!supabaseConfigured) redirect(previewAllowed ? "/plan/preview/now" : "/login");
  const { viewer, email } = await loadViewer();
  if (!email) redirect("/login");
  // Not paid yet, or an invited partner who hasn't had the safety question: the plan page sees to both.
  if (!viewer?.row.paid_at || (await needsSafetyCheck(viewer.role))) redirect("/plan");

  const { go } = await searchParams;
  return (
    <FightHelp
      names={{ me: viewer.name, partner: viewer.ctx.partnerName }}
      entry={{ name: "how" }}
      go={helpStart(go)}
      planHref="/plan"
      save={saveRepairAgreement}
    />
  );
}
