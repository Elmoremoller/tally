import { topics } from "./content";
import type { KeptReflection } from "./reflection";

// Quiz copy, exactly as approved. Keep it free of dashes, testimonials and statistics.
// Every answer has a stable id. The ids are what gets saved, so the wording can change without breaking saved answers.

/** "Phones and trust" becomes "phones_and_trust". */
const toId = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, "_");

export const fightTopics = topics.map((label) => ({ id: toId(label), label }));
export type TopicId = string;

type Choice<Id extends string> = { id: Id; label: string };

/** How someone acts when a fight starts. "toward" means moving toward the fight, "away" means moving away from it. */
const fightMoves = {
  sort_it_out_now: "toward",
  go_quiet: "away",
  get_sharp: "toward",
  say_sorry_fast: "away",
} as const;
export type FightMove = keyof typeof fightMoves;

export const youInAFight: Choice<FightMove>[] = [
  { id: "sort_it_out_now", label: "I want to sort it out right now" },
  { id: "go_quiet", label: "I go quiet and need some space" },
  { id: "get_sharp", label: "I get sharp, then feel bad about it" },
  { id: "say_sorry_fast", label: "I say sorry fast, just to end it" },
];

export const partnerInAFight: Choice<FightMove>[] = [
  { id: "sort_it_out_now", label: "They want to sort it out right now" },
  { id: "go_quiet", label: "They go quiet and need some space" },
  { id: "get_sharp", label: "They get sharp, then feel bad about it" },
  { id: "say_sorry_fast", label: "They say sorry fast, just to end it" },
];

export const howFightsStart = [
  { id: "said_the_wrong_way", label: "Something small, said the wrong way" },
  { id: "building_up", label: "Something that’s been building up" },
  { id: "tired_or_stressed", label: "One of us is tired or stressed" },
  { id: "old_fight", label: "An old fight coming back" },
] as const;

export const okayAgainAfter = [
  { id: "few_hours", label: "A few hours" },
  { id: "about_a_day", label: "About a day" },
  { id: "few_days", label: "A few days" },
  { id: "week_or_more", label: "A week or more" },
] as const;

export const howYouMakeUp = [
  { id: "talk_it_through", label: "We talk it through" },
  { id: "one_says_sorry", label: "One of us says sorry" },
  { id: "move_on", label: "We move on without talking about it" },
  { id: "wait_it_out", label: "We wait until it fades" },
] as const;

type Ids<T extends readonly { id: string }[]> = T[number]["id"];

/** One question per screen, in this order. */
export const choiceQuestions = [
  { key: "you", title: "When a fight starts, what do you usually do?", choices: youInAFight },
  { key: "partner", title: "And what does your partner usually do?", choices: partnerInAFight },
  { key: "start", title: "How do most of your fights start?", choices: howFightsStart },
  { key: "okayAgain", title: "How long until you both feel okay again?", choices: okayAgainAfter },
  { key: "makeUp", title: "After a fight, how do you usually make up?", choices: howYouMakeUp },
] as const;

export const topicsQuestion = { title: "What do you two fight about most?", hint: "Pick all that fit" };
export const namesQuestion = { title: "What are your first names?", hint: "Optional" };
export const emailQuestion = { title: "Where should we send your plan?" };

/** The open question after the safety question. Optional: Skip goes straight on to the names. */
export const storyQuestion = {
  title: "What happened the last time you two fought?",
  hint: "A few lines is enough.",
  privacy: "We use this only to shape your plan. It’s never shown to your partner.",
  skip: "Skip this question",
};
/** Shown while the reflection is being written. */
export const readingLine = "Looking at the pattern, not the person.";
export const reflectionCopy = {
  title: "Here’s what we’re hearing",
  question: "Did we get that right?",
  yes: "Yes, that’s us",
  notQuite: "Not quite",
};
/** After Not quite, once. */
export const fixQuestion = { title: "What did we miss?", hint: "One line is enough." };

/** How each topic starts the line under the couple type: "When chores come up, you go quiet and ...". */
export const topicMoments: Record<TopicId, string> = {
  chores: "When chores come up",
  money: "When money comes up",
  phones_and_trust: "When phones and trust come up",
  time_with_friends: "When time with friends comes up",
  family: "When family comes up",
  sharing_space: "When sharing space comes up",
  texts_that_land_wrong: "When a text lands wrong",
};

export type QuizAnswers = {
  topics: TopicId[];
  you: FightMove;
  partner: FightMove;
  start: Ids<typeof howFightsStart>;
  okayAgain: Ids<typeof okayAgainAfter>;
  makeUp: Ids<typeof howYouMakeUp>;
  yourName: string;
  partnerName: string;
  email: string;
  /** What happened the last time they fought, if they wrote it, and the reflection they kept. */
  story?: string;
  reflection?: KeptReflection;
};

export type CoupleTypeId = "push_and_pull" | "quick_sparks" | "slow_simmer";

export const coupleTypes: Record<
  CoupleTypeId,
  { name: string; description: string; focus: string; focusDetail: string }
> = {
  push_and_pull: {
    name: "Push and Pull",
    description:
      "One of you wants to sort it out now. The other needs space first. The more one pushes, the more the other pulls away, so a small fight turns into a long one.",
    focus: "Pause",
    focusDetail: "an agreed way to take a break, and an agreed time to come back.",
  },
  quick_sparks: {
    name: "Quick Sparks",
    description:
      "You both jump in fast. Fights get loud quickly and cool down quickly, but the same ones keep coming back.",
    focus: "Pause and Repair",
    focusDetail: "slowing down in the first minute, then actually finishing the fight.",
  },
  slow_simmer: {
    name: "Slow Simmer",
    description:
      "You both go quiet or smooth it over. Fights rarely get loud, but small things pile up unsaid until one spills over.",
    focus: "Prevent",
    focusDetail: "saying small things early, before they pile up.",
  },
};

/** The couple type comes from what each of you does when a fight starts. */
export function coupleTypeFor(you: FightMove, partner: FightMove): CoupleTypeId {
  const a = fightMoves[you];
  const b = fightMoves[partner];
  if (a !== b) return "push_and_pull";
  return a === "toward" ? "quick_sparks" : "slow_simmer";
}

/** Every allowed id per answer, so the server can check what it is sent. */
export const allowedIds = {
  topics: fightTopics.map((t) => t.id),
  you: youInAFight.map((c) => c.id),
  partner: partnerInAFight.map((c) => c.id),
  start: howFightsStart.map((c) => c.id),
  okayAgain: okayAgainAfter.map((c) => c.id),
  makeUp: howYouMakeUp.map((c) => c.id),
};

export const NAME_MAX = 40;
/** What they write in the open question, and the one line after Not quite. */
export const STORY_MAX = 1000;
export const CORRECTION_MAX = 200;
export const looksLikeEmail = (value: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
