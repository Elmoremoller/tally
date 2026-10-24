import type { HelpNames } from "./fight-help";

// Their Couple Standard, exactly as approved: what the two of them agree on, in their own words, in the
// brief's four parts. Same rules as the rest of the site: no dashes as punctuation, no testimonials or
// statistics, never "course", "program", "product", "module" or "lesson", and no big promises.

/** The shared lines, one each. Five come from the plan's agree steps, one from the 10 minute repair. */
export const SLOT_IDS = ["agree_pause", "coming_back", "running_on_empty", "first_move", "ten_minute", "practical", "check_in"] as const;
export type SlotId = (typeof SLOT_IDS)[number];

/** One shared line, as the person reading sees it. */
export type StandardLine = { text: string; mine: boolean; agreed: boolean };

export type StandardState = {
  lines: Partial<Record<SlotId, StandardLine>>;
  /** How each of them brings up something hard. */
  myWayIn: string | null;
  theirWayIn: string | null;
  /** Whether the other person has opened the plan. Until they have, whoever wrote a line can mark it agreed. */
  otherOpened: boolean;
  /** The summary they confirmed in the quiz. Only ever their own. */
  started: string[] | null;
};

/** What a line can say about agreeing. */
export type LineStatus = "agreed" | "waiting" | "suggested" | "notYet";
export const statusOf = (line: StandardLine, otherOpened: boolean): LineStatus =>
  line.agreed ? "agreed" : !line.mine ? "suggested" : otherOpened ? "waiting" : "notYet";

const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const them = (n: HelpNames) => n.partner ?? "your partner";

const practicalHints: Record<string, string> = {
  chores: "Like who does which chores, and when.",
  money: "Like when you look at money together, and what you check with each other first.",
  phones_and_trust: "Like what feels okay with phones, and what doesn’t.",
  time_with_friends: "Like a night that’s yours, and a night that’s ours.",
  family: "Like how often you visit, and how you decide.",
  sharing_space: "Like one chore or one corner that changes.",
  texts_that_land_wrong: "Like which things get a call instead of a text.",
};

export const standardCopy = {
  // On the plan
  card: {
    title: "Your Couple Standard",
    text: "What you two agree on, in your own words. It fills in as you go through your plan.",
    open: "Open your Couple Standard",
  },

  // The page
  title: (n: HelpNames) => (n.me && n.partner ? `${n.me} and ${n.partner}’s Couple Standard` : "Your Couple Standard"),
  intro:
    "What you two agree on, in your own words. What you agree on in your plan’s steps shows up here, and you can change any of it, any time.",
  invite: (n: HelpNames) => `When you invite ${them(n)}, they’ll see this too, and can agree to it.`,
  started: "Where you started",
  onlyYou: "Only you can see this.",

  wayIn: {
    title: "How I bring up something hard",
    text: "Your own way in. You each write your own.",
    me: (n: HelpNames) => n.me ?? "You",
    partner: (n: HelpNames) => n.partner ?? "Your partner",
    hint: "Like starting with one sentence about you, not them.",
  },
  parts: {
    space: "How we take space and come back",
    trying: (topic: string) => `What we’re trying with ${topic}`,
    check: "When we check if it’s helping",
  },
  slots: {
    agree_pause: { label: "Our pause", hint: "A word or sign that means we stop for now, and come back to it." },
    coming_back: { label: "Coming back", hint: "When, where, and who starts." },
    running_on_empty: { label: "When one of us is running on empty", hint: "A signal that means big topics wait until tomorrow." },
    first_move: { label: "Who goes first after a fight", hint: "Taking turns keeps it fair." },
    ten_minute: { label: "One small thing we’re trying", hint: "Like the one thing you agreed at the end of a 10 minute repair." },
    practical: { label: "The practical part", hint: "" },
    check_in: { label: "Our weekly check in", hint: "Same day, same time. Like Sundays at 7." },
  } satisfies Record<SlotId, { label: string; hint: string }>,
  /** The practical part's hint, for their main topic. */
  practicalHint: (topicId: string | undefined) => practicalHints[topicId ?? ""] ?? "Like one small thing at home that changes.",

  // What each line can show
  write: "Write it",
  cancel: "Cancel",
  change: "Change",
  waiting: (n: HelpNames) => `Waiting for ${them(n)} to agree`,
  suggested: (n: HelpNames) => `${capital(them(n))} suggested this`,
  agree: "I agree",
  notYet: "Not agreed yet",
  weAgreed: "We agreed on this",
  agreed: "Agreed",
};

/** The three shared parts, in the brief's order after each person's own way in. */
export const standardParts = (topic: string): { title: string; slots: SlotId[] }[] => [
  { title: standardCopy.parts.space, slots: ["agree_pause", "coming_back", "running_on_empty", "first_move"] },
  { title: standardCopy.parts.trying(topic), slots: ["ten_minute", "practical"] },
  { title: standardCopy.parts.check, slots: ["check_in"] },
];
