// The offer, in one place: a new name, a new price or a new ad angle is one edit here. Words here follow the
// copy rules: no dashes, no colons in headlines, no hype words, and it's always a plan. This file imports
// nothing, so Node can test it.

export const offer = {
  name: "Tally",
  /** Shown in brackets until it's a real address. */
  supportEmail: "[support email]",
  /** In cents, charged through Stripe Checkout. Paid once, no subscription. */
  price: { cents: 1999, currency: "usd" },
  refund: "[REFUND POLICY, Karl to confirm]",
  /** The sentence, word for word from the brief. */
  sentence:
    "I help women who keep the team running win back hours every week and the credit they’ve earned, without working late or looking like they’re slacking.",
  adLine: "Win back your hours. Get the credit you’ve earned.",
  cta: "Take the free quiz",
  quizTime: "Takes about 2 minutes",
  /** Under the hero's button. */
  ctaNote: "Find out how many hours a week you spend on work nobody notices. Takes about 2 minutes.",
  /** The page title, the line search engines and link previews show, and the words on the share image. */
  meta: {
    title: "Win back your hours",
    description: "A personal plan, built from a short quiz, to win back hours every week and get the credit you’ve earned.",
  },
} as const;

export type AngleId = keyof typeof angles;

/**
 * The hero headline for each ad angle, picked with ?angle= in the address. `key` is the phrase set in bold
 * with the underline drawn under it. It must appear in the headline word for word, and stay short: it never
 * wraps, so it has to fit across a small phone.
 */
export const angles = {
  default: { headline: "Win back your hours. Get the credit you’ve earned.", key: "your hours" },
  note_taker: { headline: "Always the one taking the notes? Win those hours back.", key: "those hours" },
  late_nights: { headline: "Stop working late on work nobody notices.", key: "working late" },
  always_yes: { headline: "Said yes to everything? Get time back for your real job.", key: "your real job" },
  socials_add_on: { headline: "“Can you just run our socials?” Take your hours back.", key: "your hours" },
  secret_ai: { headline: "Use AI at work openly and get the credit for it.", key: "the credit" },
  vague_policy: { headline: "Everyone says use AI. Here’s what you can actually do.", key: "actually do" },
} as const satisfies Record<string, { headline: string; key: string }>;

/** The angle for a value from the address, or default when it's missing or unknown. */
export const angleFor = (value: unknown): AngleId =>
  typeof value === "string" && Object.hasOwn(angles, value) ? (value as AngleId) : "default";

/** "$19.99", or "$20" for a whole number of dollars. */
export const dollars = (cents: number) => `$${cents % 100 ? (cents / 100).toFixed(2) : cents / 100}`;
