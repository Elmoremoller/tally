"use server";

import { APP_TAG } from "@/lib/checkout";
import { cleanText } from "@/lib/clean";
import type { AgreeResult } from "@/lib/fight-help";
import { AGREEMENT_MAX } from "@/lib/progress";
import { mentionsHarm } from "@/lib/safety";
import { PLAN_PRICE, stripe } from "@/lib/stripe";
import { sendLoginLink, supabaseAdmin } from "@/lib/supabase";

const SOMETHING_WRONG = "Something went wrong. Please try again in a minute.";

export type ResendState = { sent: boolean; error?: string } | null;

/** Send it again: emails the login link once more, to the address that paid for this Checkout. */
export async function resendLink(_: ResendState, form: FormData): Promise<ResendState> {
  const sessionId = String(form.get("session_id") ?? "");
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId);
    const email = session.metadata?.email ?? session.customer_details?.email;
    if (session.payment_status !== "paid" || !email) return { sent: false, error: "We couldn’t find that payment." };
    const { error } = await sendLoginLink(email, { create: true });
    if (error) return { sent: false, error: "Please wait a minute, then try again." };
    return { sent: true };
  } catch {
    return { sent: false, error: SOMETHING_WRONG };
  }
}

/**
 * Saves what they agreed in the 10 minute repair, before they've opened their plan link. The page passes
 * the Checkout it came from (bound on the server), and only a paid plan Checkout from this site counts.
 */
export async function saveRepairAgreementAfterPaying(sessionId: string, text: string): Promise<AgreeResult> {
  const agreement = cleanText(text, AGREEMENT_MAX);
  if (!agreement) return { error: SOMETHING_WRONG };
  if (mentionsHarm(agreement)) return { safety: true };
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId);
    const { app, kind, email } = session.metadata ?? {};
    if (app !== APP_TAG || kind !== "plan" || !email || session.payment_status !== "paid" || session.amount_total !== PLAN_PRICE) {
      return { error: SOMETHING_WRONG };
    }
    const { error } = await supabaseAdmin().rpc("save_agreement_after_paying", {
      p_email: email,
      p_step_id: "ten_minute",
      p_text: agreement,
    });
    if (error) {
      console.error("save_agreement_after_paying failed", error.message);
      return { error: SOMETHING_WRONG };
    }
    return null;
  } catch (error) {
    console.error("Saving the repair agreement failed", error);
    return { error: SOMETHING_WRONG };
  }
}
