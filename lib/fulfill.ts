import Stripe from "stripe";
import { APP_TAG } from "./checkout";
import { PLAN_PRICE } from "./prices";
import { stripe } from "./stripe";
import { sendLoginLink, supabaseAdmin } from "./supabase";

export type Fulfilment =
  | { paid: false; reason: "unpaid" | "not-ours" }
  | { paid: true; email: string; first: boolean; linkSent?: boolean };

/**
 * Opens the plan once Stripe says a Checkout is paid. Called from the Stripe webhook and from the page
 * people land on after paying, whichever comes first; the database makes sure it only counts once, and
 * the login email only goes out that first time.
 */
export async function fulfillCheckout(sessionId: string): Promise<Fulfilment> {
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe().checkout.sessions.retrieve(sessionId);
  } catch (error) {
    // No such Checkout on this account. Anything else (Stripe down, a bad key) is thrown, so it is retried.
    if (error instanceof Stripe.errors.StripeInvalidRequestError) return { paid: false, reason: "not-ours" };
    throw error;
  }
  const { app, kind, email } = session.metadata ?? {};
  // Only plan Checkouts this site started. The Stripe account may also sell other things.
  if (app !== APP_TAG || kind !== "plan" || !email) return { paid: false, reason: "not-ours" };
  // And only at the plan's price, so a payment for anything else on the account can't open a plan.
  if (session.amount_total !== PLAN_PRICE) return { paid: false, reason: "not-ours" };
  if (session.payment_status !== "paid") return { paid: false, reason: "unpaid" };

  const { data: first, error } = await supabaseAdmin().rpc("record_payment", {
    p_session_id: session.id,
    p_email: email,
    p_kind: "plan",
    p_with_partner: false,
    p_amount_total: session.amount_total,
    p_currency: session.currency ?? "usd",
  });
  if (error) throw new Error(`record_payment failed: ${error.message}`);

  let linkSent: boolean | undefined;
  if (first) {
    // The login is set up before the email goes out, so even if the email fails, "send it again" and
    // the login page still work.
    const { error: linkError } = await sendLoginLink(email, { create: true });
    if (linkError) console.error("Login link failed", linkError.message);
    linkSent = !linkError;
  }
  return { paid: true, email, first: Boolean(first), linkSent };
}
