import type { HelpNames } from "./fight-help";

// The check ins, exactly as approved: a few quick questions at the start of each person's plan, two weeks in
// and a month in, for the pilot. Only we see the answers, never the partner, apart from a quote someone
// chooses to let us show on the website. Same rules as the rest of the site: no dashes as punctuation, no
// statistics, no testimonials except real founding couple quotes shown with consent (lib/quotes.ts), never
// "course", "program", "product", "module" or "lesson", and no big promises. This file imports nothing at
// runtime, so Node can test it.

export const CHECK_INS = ["start", "day_14", "day_30"] as const;
export type CheckInId = (typeof CHECK_INS)[number];

const DAY_MS = 24 * 60 * 60_000;

/** How many whole days into their plan someone is, counted from the first time they opened it. */
export const planDay = (startedAt: Date, now: Date) => Math.max(0, Math.floor((now.getTime() - startedAt.getTime()) / DAY_MS));

/**
 * The check in to ask now, if any. The start one is asked in the first week, two weeks in from day 14 and a
 * month in from day 30, one at a time: a missed one gives way to the next.
 */
export function dueCheckIn(day: number, answered: readonly string[]): CheckInId | null {
  const id: CheckInId | null = day >= 30 ? "day_30" : day >= 14 ? "day_14" : day < 7 ? "start" : null;
  return id && !answered.includes(id) ? id : null;
}

/** The answers, by the ids the database keeps. */
export const heardChoices = [
  { id: "not_at_all", label: "Not heard at all" },
  { id: "a_little", label: "A little heard" },
  { id: "mostly", label: "Mostly heard" },
  { id: "really", label: "Really heard" },
] as const;
export const endingChoices = [
  { id: "talk_it_through", label: "We talk it through" },
  { id: "one_gives_in", label: "One of us gives in" },
  { id: "drop_it", label: "We drop it without sorting it out" },
  { id: "blows_up", label: "It blows up" },
] as const;
export const usedChoices = [
  { id: "today", label: "Today’s step" },
  { id: "moment", label: "Today’s small moment" },
  { id: "pause", label: "The 20 minutes" },
  { id: "repair", label: "The 10 minute repair" },
  { id: "look_back", label: "Looking back on your own" },
  { id: "words", label: "The words for your fights" },
  { id: "message_check", label: "The message check" },
] as const;
export const moreHeardChoices = [
  { id: "more", label: "More heard" },
  { id: "same", label: "About the same" },
  { id: "less", label: "Less heard" },
] as const;
export const keptChoices = [
  { id: "yes", label: "Yes" },
  { id: "partly", label: "Partly" },
  { id: "not_really", label: "Not really" },
  { id: "none_yet", label: "We haven’t agreed on anything yet" },
] as const;
export const lastChoices = [
  { id: "better", label: "Better than it used to" },
  { id: "same", label: "About the same" },
  { id: "worse", label: "Worse than it used to" },
  { id: "avoided", label: "We didn’t really talk about it" },
  { id: "none_yet", label: "Nothing’s come up yet" },
] as const;
export const payChoices = [
  { id: "yes", label: "Yes" },
  { id: "maybe", label: "Maybe" },
  { id: "no", label: "No" },
] as const;

const ids = <T extends readonly { id: string }[]>(choices: T) => choices.map((c) => c.id) as T[number]["id"][];
export const USED_IDS = ids(usedChoices);
export const NOTE_MAX = 500;
/** Short enough to show on the website as it was written. */
export const QUOTE_MAX = 300;

/** What someone answered, as the server action takes it. */
export type CheckInAnswers =
  | { heard: (typeof heardChoices)[number]["id"]; ending: (typeof endingChoices)[number]["id"] }
  | {
      used: (typeof usedChoices)[number]["id"][];
      moreHeard: (typeof moreHeardChoices)[number]["id"];
      kept: (typeof keptChoices)[number]["id"];
      last: (typeof lastChoices)[number]["id"];
      pay: (typeof payChoices)[number]["id"];
      /** What they'd tell another couple, and whether we may show it on the website with their first name. */
      quote: string;
      showQuote: boolean;
      note: string;
    };

/** The questions with one answer each, in order, for each check in. */
export const singleQuestions = {
  start: [
    { key: "heard", title: "When you two disagree, how heard do you feel?", choices: heardChoices },
    { key: "ending", title: "How do your disagreements usually end?", choices: endingChoices },
  ],
  later: [
    { key: "moreHeard", title: "When you two disagree, do you feel more heard than when you started?", choices: moreHeardChoices },
    { key: "kept", title: "Have you two kept to something you agreed on?", choices: keptChoices },
    { key: "last", title: "The last time you two disagreed, how did it go?", choices: lastChoices },
    { key: "pay", title: "If you could practice a hard conversation before you have it, would you pay for that?", choices: payChoices },
  ],
} as const;

const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const private_ = (n: HelpNames) => `Only we see your answers. ${capital(n.partner ?? "your partner")} never does.`;

export const checkInCopy = {
  // The card on the plan
  card: {
    start: { title: "Two quick questions", text: (n: HelpNames) => `So we can see what changes as you go. ${private_(n)}` },
    day_14: { title: "Two weeks in", text: (n: HelpNames) => `How’s it going? A few quick questions. ${private_(n)}` },
    day_30: { title: "A month in", text: (n: HelpNames) => `How’s it going? A few quick questions. ${private_(n)}` },
  } satisfies Record<CheckInId, { title: string; text: (n: HelpNames) => string }>,
  answer: "Answer now",
  later: "Not now",

  // Two weeks in and a month in
  used: { title: "Which of these have you used for real?", notYet: "Not yet" },
  // Asked only once its SQL has run (lib/check-in-state.ts). Unticked unless they tick it.
  quote: {
    title: "What would you tell another couple about it?",
    show: "You can show this on the website with my first name",
  },
  note: { title: "Anything else you’d like us to know?", hint: "A few words is enough.", send: "Send" },

  // The end
  thanks: {
    start: "Thank you. We’ll ask again two weeks in.",
    day_14: "Thank you. We’ll ask once more a month in.",
    day_30: "Thank you. That’s the last one.",
  } satisfies Record<CheckInId, string>,
  helps: "Your answers help us make the plan better.",

  // Opening the page with nothing to answer
  nothing: "Nothing to answer right now",
};
