import { planParts } from "./landing";
import { dollars, offer } from "./offer";
import { hoursText, toolLabels, type AiTool, type ChatTool, type Pile } from "./week";

// The words around her plan: the paywall, checkout, the page after paying and the plan page. The paywall's
// headline, price line and button are the brief's; lines marked DRAFT fill a gap and wait for approval.

/** "Meeting notes" becomes "meeting notes" inside a sentence; "HR onboarding" stays as it is. */
const inSentence = (name: string) => (/^\p{Lu}\p{Ll}/u.test(name) ? name.charAt(0).toLowerCase() + name.slice(1) : name);

export const paywallCopy = {
  title: "Get your plan to win those hours back and turn them into credit.",
  lead: "Here’s what’s inside, built from your answers.", // approved 2026-10-24
  handBack: (task: string) => `A polite script to hand back ${inSentence(task)}`,
  price: `${dollars(offer.price.cents)}, paid once. No subscription.`,
  refund: offer.refund,
  cta: "Get my plan",
  pending: "One moment",
  secure: "Secure payment with Stripe.",
  quizFirst: "Please take the quiz first, so we can make your plan.",
  error: "Something went wrong. Please try again in a minute.",
  notSetUp: "Payments are not set up yet. Add the Stripe test key to .env.local.",
};

/**
 * The look at her plan under the paywall: one card per part, with her own tasks, hours and tool in clear and
 * the words the plan writer adds after checkout behind a lock. Approved on 2026-10-24.
 */
export const previewCopy = {
  lock: "Written for you after checkout",
  moreScripts: (others: string[]) =>
    others.length === 1
      ? `Plus a script for ${inSentence(others[0])}.`
      : `Plus ${others.length} more scripts for your other tasks to hand back.`,
  piles: "Your tasks in three piles",
  rules: { encouraged: "With safe use rules for a company that encourages AI.", restricted: "With safe use rules for a company that restricts AI." },
  rulesAsk: "With safe use rules, and a message to ask what’s approved.",
  prompts: (count: number) => `${count} ready ${count === 1 ? "prompt" : "prompts"}`,
  projectTitle: "One project for the work you want credit for",
  projectLine: "With first steps, and a script for talking about your AI use with your manager.",
  /**
   * Blurred behind each lock and hidden from screen readers, so it is never read as hers. Sample words only,
   * there to give the lock the shape of real writing.
   */
  standIn:
    "I’d like to put my time into the work that moves things forward, so here’s a simple way we could share this from now on. If you send it over a few days ahead, I can review it and keep it where it should be.",
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
  /** Under the work profile's label when she picked no chat tool, or must check which one is approved. */
  profileLead: "Paste it into whichever AI tool your company approves.", // DRAFT
  /** At the top of AI setup when her company restricts AI or she has no idea of its view. DRAFT */
  checkFirst: "Before you start, check which AI tool your company has approved. There’s a message below you can send to ask.",
  /** Where to paste her work profile in each chat tool she picked. DRAFT */
  pasteTitle: (checkFirst: boolean) => (checkFirst ? "Where to paste it, once you know it’s approved" : "Where to paste it"),
  pasteWhere: {
    chatgpt: "In ChatGPT, open Settings, then Personalization, and paste it into Custom instructions.",
    copilot: "In Copilot Chat, open Settings, then Personalization, and paste it into Custom instructions.",
    gemini: "In Gemini, make a new Gem, paste it into the Gem’s instructions, and start your work chats from that Gem.",
    claude: "In Claude, open Settings and paste it into the box for your personal preferences.",
  } satisfies Record<ChatTool, string>,
  pasteFallback: "Menus change. If you can’t find the spot, paste it at the start of a new chat.",
  /** Over the plan writer's suggestion, when she picked no chat tool. DRAFT */
  startTitle: "Which tool to start with",
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
  welcomeNote: (email: string) => `We’re emailing the link to your plan to ${email}, so you can always come back to it.`, // DRAFT
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
