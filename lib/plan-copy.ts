import { planParts } from "./landing";
import { dollars, offer } from "./offer";
import { hoursText, toolLabels, type AiTool, type Pile } from "./week";

// The words around her plan: the paywall, checkout, the page after paying and the plan page. The paywall's
// headline, price line and button are the brief's; lines marked DRAFT fill a gap and wait for approval.

/** "Meeting notes" becomes "meeting notes" inside a sentence; "HR onboarding" stays as it is. */
const inSentence = (name: string) => (/^\p{Lu}\p{Ll}/u.test(name) ? name.charAt(0).toLowerCase() + name.slice(1) : name);

export const paywallCopy = {
  title: "Get your plan to win those hours back and turn them into credit.",
  prompts: (task: string) => `Ready prompts for ${inSentence(task)}`,
  handBack: (task: string) => `A polite script to hand back ${inSentence(task)}`,
  parts: planParts.parts.map((p) => ({ title: p.title, text: p.text })),
  price: `${dollars(offer.price.cents)}, paid once. No subscription.`,
  refund: offer.refund,
  cta: "Get my plan",
  pending: "One moment",
  secure: "Secure payment with Stripe.",
  quizFirst: "Please take the quiz first, so we can make your plan.",
  error: "Something went wrong. Please try again in a minute.",
  notSetUp: "Payments are not set up yet. Add the Stripe test key to .env.local.",
};

/** What people see on Stripe's page and their receipt. DRAFT */
export const checkoutCopy = {
  name: "Your plan",
  description: "A personal plan to win back your hours and get the credit you’ve earned.",
};

/** Under each pile's name on the plan page. DRAFT */
export const pileNotes: Record<Pile, string> = {
  hand_to_ai: "Busywork AI can draft or do for you.",
  hand_back: "Work that isn’t really yours, with a polite way to hand it back.",
  keep_visible: "Work that builds your name. Keep it, and make sure people see it.",
};

const part = (id: (typeof planParts.parts)[number]["id"]) => planParts.parts.find((p) => p.id === id)!;

export const planCopy = {
  title: "Your plan",
  audit: part("audit"),
  hours: part("hours"),
  setup: part("setup"),
  handoff: part("handoff"),
  visibility: part("visibility"),
  handBackLabel: "A polite way to hand it back", // DRAFT
  hoursLabel: "Hours back",
  hoursTitle: (hours: number) => `${hoursText(hours)} a week`,
  hoursNone: "None of your tasks are ones to hand off yet.", // DRAFT
  profileLabel: (tool: AiTool | null) => (tool ? `Your work profile for ${toolLabels[tool]}` : "Your work profile"),
  profileLead: (tool: AiTool | null) =>
    tool ? `Paste it where ${toolLabels[tool]} lets you add custom instructions.` : "Paste it into whichever AI tool your company approves.", // DRAFT
  rulesTitle: "Safe use rules",
  askLabel: "Ask what’s approved", // DRAFT
  askLead: "Send this to IT or your manager.", // DRAFT
  promptLabel: "Ready prompt",
  promptsGroup: "Your tasks to hand to AI",
  promptsNone: "None of your tasks are ones to hand to AI yet. Your plan leans on handing back and getting seen.", // DRAFT
  projectLabel: "Your project",
  stepsLabel: "First steps",
  talkLabel: "Talking about AI with your manager",
  copy: "Copy",
  copied: "Copied",
  changeWords: "Change anything you like, then copy it.", // DRAFT
  keepLink: "This page is private to you. Keep the link to come back to it.", // DRAFT
  pendingTitle: "Your plan is being prepared",
  pendingText: "It usually takes under a minute. This page opens it by itself.", // DRAFT
  failedTitle: "Your plan is taking longer than usual",
  failedText: "We’ve been told and we’re on it. Keep this link: your plan appears here as soon as it’s ready.", // DRAFT
  welcomeNote: (email: string) => `We also sent a link to ${email}, so you can always come back to your plan.`, // DRAFT
  notFoundTitle: "We couldn’t find that plan",
  notFoundText: "Check the link in your email, or enter your email for a new one.",
};

/** The page after paying, when something isn't right. */
export const welcomeCopy = {
  stillOpening: "We’re still opening your plan",
  stillOpeningText: "This can take a minute. Refresh this page soon, or watch for an email with the link to your plan.",
  notPaid: "That payment didn’t go through",
  notPaidText: "Nothing has changed on your side. You can try again whenever you’re ready.",
  tryAgain: "Try again",
};
