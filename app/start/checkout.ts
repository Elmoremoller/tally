"use server";

import { redirect } from "next/navigation";
import { createCheckout } from "@/lib/checkout";
import { loadWeek, noteSessionCheckout, planForSession } from "@/lib/funnel-db";
import { paywallCopy } from "@/lib/plan-copy";
import { readSessionId } from "@/lib/session-cookie";
import { stripeConfigured } from "@/lib/stripe";

export type CheckoutState = { error: string } | null;

/** Get my plan: sends her to Stripe Checkout for the plan built from this browser's quiz. */
export async function startCheckout(): Promise<CheckoutState> {
  const sessionId = await readSessionId();
  if (!sessionId) return { error: paywallCopy.quizFirst };
  if (!stripeConfigured) {
    return { error: process.env.NODE_ENV === "production" ? paywallCopy.error : paywallCopy.notSetUp };
  }

  let url: string;
  try {
    const { session, intake } = await loadWeek(sessionId);
    if (!session || session.status === "started") return { error: paywallCopy.quizFirst };
    // Already paid for: back to her plan rather than paying twice.
    if (session.status === "paid") {
      const plan = await planForSession(sessionId);
      if (plan) url = `/plan/${plan.access_token}`;
      else return { error: paywallCopy.error };
    } else {
      // So the privacy cleanup never removes her answers while she's paying.
      await noteSessionCheckout(sessionId).catch((error) => console.error("note_session_checkout failed", error));
      url = await createCheckout(sessionId, { beginner: Boolean(intake?.beginner) });
    }
  } catch (error) {
    console.error("Checkout failed", error);
    return { error: paywallCopy.error };
  }
  redirect(url);
}
