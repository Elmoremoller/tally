import Stripe from "stripe";

export { CURRENCY, PLAN_PRICE } from "./prices";

export const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

let client: Stripe | undefined;
/** Stripe, with the secret key. Use the test key (sk_test_...) until launch. Server only. */
export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set. See SETUP.md.");
  client ??= new Stripe(key);
  return client;
}
