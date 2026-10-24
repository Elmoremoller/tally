// The offer, in one place: a new name, a new price or a new ad angle is one edit here. Words here follow the
// copy rules: no dashes, no colons in headlines, no hype words, and it's always a plan. This file imports
// nothing, so Node can test it.

/** A sentence with non-breaking spaces, so a line can only break before or after it. */
const whole = (sentence: string) => sentence.replaceAll(" ", "\u00a0");

export const offer = {
  name: "Tally",
  /** Shown in brackets until it's a real address. */
  supportEmail: "[support email]",
  /** In cents, charged through Stripe Checkout. Paid once, no subscription. */
  price: { cents: 1999, currency: "usd" },
  refund: "[REFUND POLICY, Karl to confirm]",
  /** Under the hero headline. */
  lead: "Most of what keeps you late is busywork nobody notices. Tally builds you a plan to hand it to AI.",
  adLine: "Win back your hours. Get the credit you’ve earned.",
  cta: "Take the free quiz",
  quizTime: "Takes about 2 minutes",
  /** The way back to her plan, top right of the header and in the footer. It opens Open your plan at /login. */
  login: "Log in",
  /** Under the hero's button. When it wraps, on the smallest phones, it breaks between the sentences. */
  ctaNote: `${whole("See where your hours go.")} ${whole("About 2 minutes.")}`,
  /** The page title, and the line search engines and link previews show. The share image uses adLine. */
  meta: {
    title: "Close the laptop at 5",
    description: "The late nights, the weekend emails, the feeling that you’re always behind. See where your hours go with a free 2 minute quiz.",
  },
} as const;

export type AngleId = keyof typeof angles;

/**
 * The hero headline for each ad angle, picked with ?angle= in the address. `key` is the phrase set in bold
 * with the underline drawn under it. It must appear in the headline word for word, and stay short: it never
 * wraps, so it has to fit across a small phone. A key too wide for a small phone at the full size gets `fit`,
 * its width with the punctuation after it in em, measured in the browser: on narrow phones the headline then
 * shrinks just enough for it to fit. Measure it again whenever the key changes.
 */
export const angles = {
  default: { headline: "Close the laptop at 5. Without falling behind.", key: "Without falling behind", fit: 8.12 },
  note_taker: { headline: "Always the one taking the notes? Win those hours back.", key: "those hours" },
  late_nights: { headline: "Stop working late on work nobody notices.", key: "working late" },
  always_yes: { headline: "Said yes to everything? Get time back for your real job.", key: "your real job" },
  socials_add_on: { headline: "“Can you just run our socials?” Take your hours back.", key: "your hours" },
  secret_ai: { headline: "Use AI at work openly and get the credit for it.", key: "the credit" },
  vague_policy: { headline: "Everyone says use AI. Here’s what you can actually do.", key: "actually do" },
} as const satisfies Record<string, Angle>;

type Angle = { headline: string; key: string; fit?: number };

/** How wide an angle's key is in em, when it's too wide for a small phone at the full size. */
export const angleFit = (angle: AngleId): number | undefined => (angles[angle] as Angle).fit;

/** The angle for a value from the address, or default when it's missing or unknown. */
export const angleFor = (value: unknown): AngleId =>
  typeof value === "string" && Object.hasOwn(angles, value) ? (value as AngleId) : "default";

/** "$19.99", or "$20" for a whole number of dollars. */
export const dollars = (cents: number) => `$${cents % 100 ? (cents / 100).toFixed(2) : cents / 100}`;
