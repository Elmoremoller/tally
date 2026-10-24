import type { CoupleTypeId } from "./quiz";
import { requestOrigin } from "./site";
import { CURRENCY, PLAN_PRICE } from "./prices";
import { stripe } from "./stripe";

/** Marks Checkouts this site started, in case the Stripe account sells other things too. */
export const APP_TAG = "couple-standard";

/**
 * Starts a Stripe Checkout for the plan and returns its address. Adding a partner is free, so the plan is
 * the only thing on it. The name below is what people see on Stripe's page and on their receipt, so it
 * talks about the plan, never a product.
 */
export async function createCheckout({ email, coupleType }: { email: string; coupleType: CoupleTypeId }) {
  const origin = await requestOrigin();
  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    // Cards only (Apple Pay and Google Pay included), so a payment is either done or not when people come back.
    allowed_payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          unit_amount: PLAN_PRICE,
          product_data: { name: "Your plan", description: "Prevent, Pause, Repair, built around your answers." },
        },
      },
    ],
    metadata: { app: APP_TAG, email, kind: "plan", couple_type: coupleType },
    success_url: `${origin}/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/start/result`,
  });
  if (!session.url) throw new Error("Stripe did not return a checkout address.");
  return session.url;
}
