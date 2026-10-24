import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { SiteNav } from "@/components/SiteNav";
import { latestPlanForEmail } from "@/lib/funnel-db";
import { offer } from "@/lib/offer";
import { previewAllowed } from "@/lib/preview";
import { supabaseConfigured, supabaseWithSession } from "@/lib/supabase";

// Where the link in her email lands, once she's signed in: it opens her plan's private page. Anyone not
// signed in is sent to ask for a new link.
export const metadata: Metadata = {
  title: `Your plan · ${offer.name}`,
  robots: { index: false },
};

export default function Page() {
  return (
    <>
      <SiteNav cta={false} />
      <Suspense
        fallback={
          <main id="main" className="page-narrow" aria-busy="true">
            <Backdrop progress={0.3} />
          </main>
        }
      >
        <FindPlan />
      </Suspense>
    </>
  );
}

async function FindPlan() {
  // Always decided per request, from the login cookie.
  await connection();
  if (!supabaseConfigured) redirect(previewAllowed ? "/plan/preview" : "/login");
  const { data } = await (await supabaseWithSession()).auth.getClaims();
  const email = typeof data?.claims?.email === "string" ? data.claims.email.toLowerCase() : null;
  if (!email) redirect("/login");

  const plan = await latestPlanForEmail(email).catch((error) => {
    console.error("Finding a plan failed", error);
    return null;
  });
  if (plan) redirect(`/plan/${plan.access_token}`);
  return (
    <main id="main" className="page-narrow">
      <Backdrop progress={0.3} />
      <h1 className="page-title">Your plan isn’t open yet</h1>
      <p className="page-text">
        We couldn’t find a plan for <strong>{email}</strong>. If you just paid, give it a minute and refresh.
      </p>
      <Link href="/start" className="btn btn-lg page-cta">
        {offer.cta}
      </Link>
    </main>
  );
}
