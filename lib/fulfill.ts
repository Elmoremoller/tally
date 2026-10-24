import Stripe from "stripe";
import { APP_TAG } from "./checkout";
import { recordOrder } from "./funnel-db";
import { CURRENCY, PLAN_PRICE } from "./prices";
import { stripe } from "./stripe";
import { sendLoginLink } from "./supabase";

export type Fulfilment =
  | { paid: false; reason: "unpaid" | "not-ours" }
  | { paid: true; email: string; token: string; planId: string; first: boolean; linkSent?: boolean };

/**
 * Records her paid Checkout and adds her plan, waiting to be written. Called from the Stripe webhook and
 * from the page she lands on after paying, whichever comes first; the database counts each Checkout once,
 * so a repeated webhook never makes a second order, and the email with her plan link only goes out the
 * first time.
 */
export async function fulfillCheckout(checkoutId: string): Promise<Fulfilment> {
  let checkout: Stripe.Checkout.Session;
  try {
    checkout = await stripe().checkout.sessions.retrieve(checkoutId);
  } catch (error) {
    // No such Checkout on this account. Anything else (Stripe down, a bad key) is thrown, so it is retried.
    if (error instanceof Stripe.errors.StripeInvalidRequestError) return { paid: false, reason: "not-ours" };
    throw error;
  }
  const { app, kind, session_id: sessionId } = checkout.metadata ?? {};
  const email = checkout.customer_details?.email?.trim().toLowerCase();
  // Only plan Checkouts this site started, at the plan's price: the account also sells The Couple Standard's.
  if (app !== APP_TAG || kind !== "plan" || !sessionId) return { paid: false, reason: "not-ours" };
  if (checkout.amount_total !== PLAN_PRICE || checkout.currency !== CURRENCY) return { paid: false, reason: "not-ours" };
  if (checkout.payment_status !== "paid" || !email) return { paid: false, reason: "unpaid" };

  const order = await recordOrder({
    providerRef: checkout.id,
    sessionId,
    product: "plan",
    amountCents: checkout.amount_total,
    currency: checkout.currency,
    email,
  });
  if (!order.plan_id || !order.access_token) throw new Error(`No plan was added for Checkout ${checkout.id}`);

  let linkSent: boolean | undefined;
  if (order.first) {
    // The login is set up before the email goes out, so even if the email fails, "send it again" and the
    // login page still work. The email's link signs her in and opens her plan.
    const { error } = await sendLoginLink(email, { create: true }).catch((e: Error) => ({ error: e }));
    if (error) console.error("The plan link email failed", error.message);
    linkSent = !error;
  }
  return { paid: true, email, token: order.access_token, planId: order.plan_id, first: order.first, linkSent };
}
