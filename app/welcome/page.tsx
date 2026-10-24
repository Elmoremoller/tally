import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { SiteNav } from "@/components/SiteNav";
import { fulfillCheckout, type Fulfilment } from "@/lib/fulfill";
import { offer } from "@/lib/offer";
import { welcomeCopy } from "@/lib/plan-copy";
import { writePlanAfterResponse } from "@/lib/plan-generation";

// Where Stripe sends her after paying. It records the payment straight away (the webhook does the same,
// whichever is first), starts writing her plan, and opens her plan's private page, which shows "Your plan
// is being prepared" until it's ready.
export const maxDuration = 300;
export const metadata: Metadata = {
  title: `Your plan · ${offer.name}`,
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
  const { session_id: checkoutId } = await searchParams;
  let result: Fulfilment | "error" = { paid: false, reason: "not-ours" };
  if (typeof checkoutId === "string" && checkoutId.startsWith("cs_")) {
    try {
      result = await fulfillCheckout(checkoutId);
    } catch (error) {
      console.error("Welcome fulfilment failed", error);
      result = "error";
    }
  }

  if (result !== "error" && result.paid) {
    writePlanAfterResponse(result.planId);
    redirect(`/plan/${result.token}?welcome=1`);
  }

  // Something on our side failed, but the payment may well have gone through. Never ask her to pay again.
  if (result === "error") {
    return (
      <>
        <h1 className="page-title">{welcomeCopy.stillOpening}</h1>
        <p className="page-text">{welcomeCopy.stillOpeningText}</p>
      </>
    );
  }
  return (
    <>
      <h1 className="page-title">{welcomeCopy.notPaid}</h1>
      <p className="page-text">{welcomeCopy.notPaidText}</p>
      <Link href="/start/result" className="btn btn-lg page-cta">
        {welcomeCopy.tryAgain}
      </Link>
    </>
  );
}
