// Words the context quiz at /begin uses that aren't in lib/beginner/copy.ts. Kept apart so that file's other
// edits stay their own. Every line here waits for Elmore's approval.

/**
 * When her answers were too thin to read, she goes back to the screen of things she does over and over, with
 * this under it. Used in place of quizErrors.thin, which asks about her week.
 */
export const thinAnswers = "We need a little more to go on. Add another thing you do over and over, then try again."; // DRAFT

/**
 * The follow up question for this quiz when the AI asks for more but writes no question of its own. It assumes
 * no desk, inbox or computer. lib/beginner/intake.ts uses it in place of the /start quiz's DEFAULT_FOLLOW_UP.
 */
export const beginnerFollowUp = "What else do you do over and over in your job?"; // DRAFT

/** The Your tools part of the beginner plan, right after Your tool: the other tools she named, at her level. */
export const planToolsCopy = {
  title: "Your tools", // DRAFT
  tryThis: "Try this week", // DRAFT
  withChat: "With your chat tool", // DRAFT
};

// Added 2026-11-13 from Elmore's walkthrough of the quiz (docs/superpowers/plans/2026-11-13-quiz-feedback.md).
// He approved these lines in chat the same day.

export const DEVICES = ["phone", "computer", "both"] as const;
export type Device = (typeof DEVICES)[number];
/**
 * What she has for work, asked of everyone under Where does your work happen (Phase 5). It decides which
 * recipes have steps for her (DIRECTION.md, section 2, condition 5) and whether her setup steps are for a phone,
 * a computer or both. The ids stay as they were, so answers saved before keep loading. Karl's words, 2026-11-15.
 */
export const deviceQuestion = {
  title: "Do you work on a phone, a computer or both?",
  labels: { phone: "Phone only", computer: "Computer only", both: "Both" } satisfies Record<Device, string>,
  /** The labels on answers saved before Phase 5, when the question was Where would you use AI most? */
  legacyLabels: { phone: "Phone", computer: "Computer", both: "Both" } satisfies Record<Device, string>,
};

/**
 * Where does your work happen, for everyone (DIRECTION.md, Phase 5). The choices are the apps the read of her job
 * names, then these. She ticks all that fit, and they count as the apps she uses for every task. Karl's words,
 * and every line approved by Karl 2026-11-15.
 */
export const whereScreen = {
  title: "Where does your work happen?",
  hint: "Tick all that fit.",
  places: ["Text messages", "Gmail", "Outlook", "Google Sheets", "Instagram", "A work system", "Paper", "In person"],
  /** Places that name no software, left out of the tools her plan teaches. */
  notSoftware: ["Text messages", "A work system", "Paper", "In person"],
  /** When she taps Continue without saying what she uses for work. */
  needsDevice: "Tell us what you use for work, then go on.",
};

export const CONNECT = ["yes", "no", "not_sure"] as const;
export type Connect = (typeof CONNECT)[number];
/** The screen id of the connect question, as kept in her answered screens. */
export const CONNECT_ID = "connect";
/**
 * For an employee who answered Yes or Not sure to Can you use AI for your work (DIRECTION.md, Phase 5). Only Yes
 * lets a recipe connect one of her work apps. Karl's words and approved labels, 2026-11-15.
 */
export const connectQuestion = {
  title: "Would your company let you link your work email to an AI tool?",
  labels: { yes: "Yes", no: "No", not_sure: "Not sure" } satisfies Record<Connect, string>,
};

/** Shown in turn while her answers are read and her first win is written, ending where her result begins. */
export const readingLines = ["Reading your answers", "Finding what can run smoother", "Mapping your week"]; // DRAFT, Phase 8

/** Kinds of work she can tap on the job screen. Each tap adds its words to her answer, so a short answer still says enough. */
export const jobKinds = {
  hint: "Tap what fits, then add a few words if you like.",
  list: ["Office and admin", "Shop or salon", "Health care", "Teaching", "My own business", "Social media and marketing"],
};

// Added 2026-11-14 for Phase 1 of docs/DIRECTION.md, all approved by Karl the same day: how often she does her top task,
// what a Builder has already done with AI, and Can you use AI for your work. Phase 8 took out the real example
// screen and the line on the repeats screen.

export const OFTEN = ["many_a_day", "daily", "few_a_week", "weekly_or_less"] as const;
export type Often = (typeof OFTEN)[number];
/** One tap row on the most wanted screen, under her picks (Phase 8; it was on the example screen). Approved by Karl 2026-11-14. */
export const oftenQuestion = {
  title: "How often do you do this?",
  labels: {
    many_a_day: "Many times a day",
    daily: "About once a day",
    few_a_week: "A few times a week",
    weekly_or_less: "Once a week or less",
  } satisfies Record<Often, string>,
};

/** Builders only: what she has already done with AI, so her path can skip it. Approved by Karl 2026-11-14. */
export const doneWithAi = {
  title: "What have you already done with AI?",
  hint: "Pick all that fit.",
  choices: [
    "Pasted in my own text",
    "Saved instructions about myself",
    "Made a project",
    "Connected an app",
    "Pay for a plan",
  ],
  /** Clears the others, and the others clear it. */
  none: "None of these",
};

/** One tap in place of who she works for and her company's view on AI. Approved by Karl 2026-11-14. */
export const canUseQuestion = { title: "Can you use AI for your work?" };
