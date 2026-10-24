import { dollars, offer } from "./offer";

// What things cost, in cents, from the offer config. Shown on the paywall and charged through Stripe.
export const PLAN_PRICE = offer.price.cents;
export const CURRENCY = offer.price.currency;
export { dollars };
