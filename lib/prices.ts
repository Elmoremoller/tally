// What things cost, in cents. Shown on the paywall and charged through Stripe. Adding a partner is free.
export const PLAN_PRICE = 1999;
export const CURRENCY = "usd";

/** "$19.99", or "$20" for a whole number of dollars */
export const dollars = (cents: number) => `$${cents % 100 ? (cents / 100).toFixed(2) : cents / 100}`;
