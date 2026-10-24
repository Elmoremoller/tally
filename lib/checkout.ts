import { checkoutCopy } from "./plan-copy";
import { CURRENCY, PLAN_PRICE } from "./prices";
import { requestOrigin } from "./site";
import { stripe } from "./stripe";

/** Marks Checkouts this site started, since the Stripe account also sells The Couple Standard's plan. */
export const APP_TAG = "worth-her-time";

/**
 * Starts a Stripe Checkout for her plan and returns its address. It carries her quiz session, so the payment
 * opens the plan built from her answers. Stripe asks for her email.
 */
export async function createCheckout(sessionId: string) {
  const origin = await requestOrigin();
  const checkout = await stripe().checkout.sessions.create({
    mode: "payment",
    // Cards only (Apple Pay and Google Pay included), so a payment is either done or not when she comes back.
    allowed_payment_method_types: ["card"],
    client_reference_id: sessionId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          unit_amount: PLAN_PRICE,
          product_data: { name: checkoutCopy.name, description: checkoutCopy.description },
        },
      },
    ],
    metadata: { app: APP_TAG, kind: "plan", session_id: sessionId },
    success_url: `${origin}/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/start/result`,
  });
  if (!checkout.url) throw new Error("Stripe did not return a checkout address.");
  return checkout.url;
}
