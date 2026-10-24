import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { WelcomeFlow } from "@/components/fight-help/WelcomeFlow";
import { ResendLink } from "@/components/plan/ResendLink";
import { SiteNav } from "@/components/SiteNav";
import type { HelpNames } from "@/lib/fight-help";
import { fulfillCheckout, type Fulfilment } from "@/lib/fulfill";
import { previewAllowed } from "@/lib/preview";
import { supabaseAdmin } from "@/lib/supabase";
import { saveRepairAgreementAfterPaying } from "./actions";

// Where Stripe sends people after paying. It opens the plan straight away (the webhook does the same,
// whichever is first), asks whether they just had a fight, and tells them where their login link went.
// On a local setup, /welcome?preview=1 shows it with a sample couple, without Stripe, and saves nothing.
export const metadata: Metadata = {
  title: "Your plan is ready · The Couple Standard",
  robots: { index: false },
};

export default function Page({ searchParams }: PageProps<"/welcome">) {
  return (
    <>
      <Backdrop progress={1} />
      <SiteNav cta={false} />
      <main id="main" className="page-narrow">
        <Suspense fallback={<p className="page-text">One moment</p>}>
          <Welcome searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

async function Welcome({ searchParams }: { searchParams: PageProps<"/welcome">["searchParams"] }) {
  // Always decided per request: it asks Stripe about this payment.
  await connection();
  const params = await searchParams;
  if (previewAllowed && params.preview === "1") {
    return (
      <WelcomeFlow names={{ me: "Sam", partner: "Alex" }} save={null}>
        <LinkLine email="sam@example.com" sent />
        <ResendLink sessionId="cs_preview" />
      </WelcomeFlow>
    );
  }
  const sessionId = params.session_id;
  let result: Fulfilment | "error" = { paid: false, reason: "not-ours" };
  if (typeof sessionId === "string" && sessionId.startsWith("cs_")) {
    try {
      result = await fulfillCheckout(sessionId);
    } catch (error) {
      console.error("Welcome fulfilment failed", error);
      result = "error";
    }
  }

  // Something on our side failed, but the payment may well have gone through. Never ask them to pay again.
  if (result === "error") {
    return (
      <>
        <h1 className="page-title">We’re still opening your plan</h1>
        <p className="page-text">
          This can take a minute. Refresh this page soon, or watch for an email with the link to your plan.
        </p>
      </>
    );
  }

  if (!result.paid || typeof sessionId !== "string") {
    return (
      <>
        <h1 className="page-title">That payment didn’t go through</h1>
        <p className="page-text">Nothing has changed on your side. You can try again whenever you’re ready.</p>
        <Link href="/start/result" className="btn btn-lg page-cta">
          Try again
        </Link>
      </>
    );
  }

  return (
    <WelcomeFlow names={await namesFor(result.email)} save={saveRepairAgreementAfterPaying.bind(null, sessionId)}>
      <LinkLine email={result.email} sent={result.linkSent !== false} />
      <ResendLink sessionId={sessionId} />
    </WelcomeFlow>
  );
}

function LinkLine({ email, sent }: { email: string; sent: boolean }) {
  return sent ? (
    <p className="page-text">
      We sent a link to <strong>{email}</strong>. Open it to see your plan.
    </p>
  ) : (
    <p className="page-text">
      We couldn’t email your link to <strong>{email}</strong> just now. Try sending it again below.
    </p>
  );
}

/** Their first names from the quiz, for the help after a fight. It still works without them. */
async function namesFor(email: string): Promise<HelpNames> {
  try {
    const { data } = await supabaseAdmin()
      .from("people")
      .select("your_name, partner_name")
      .eq("email", email.toLowerCase())
      .maybeSingle();
    return { me: data?.your_name ?? null, partner: data?.partner_name ?? null };
  } catch {
    return { me: null, partner: null };
  }
}
