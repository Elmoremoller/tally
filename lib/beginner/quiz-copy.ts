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

/** What someone in her job might use AI for, when the read of her job has no list of its own. */
export const FALLBACK_AI_USES = ["Writing messages", "Social posts", "Planning", "Answering questions", "Summing things up"];

export const DEVICES = ["phone", "computer", "both"] as const;
export type Device = (typeof DEVICES)[number];
/** Asked of Starters: it decides whether her setup steps are for a phone, a computer or both. */
export const deviceQuestion = {
  title: "Where would you use AI most?",
  labels: { phone: "Phone", computer: "Computer", both: "Both" } satisfies Record<Device, string>,
};

/**
 * Software everyone might use, always offered after the software the read of her job names, each once. The
 * read's own picks come first, since they fit her job best.
 */
export const EVERYDAY_SOFTWARE = ["Outlook", "Gmail", "Excel", "Google Sheets", "Word", "Google Drive", "Teams", "Zoom"];

/** The wait while the AI writes her questions. */
export const questionsWait = "Writing a question for your job"; // Approved by Karl 2026-11-14

/** Shown in turn while her answers are read and her first win is written, ending where her result begins. */
export const readingLines = ["Reading your answers", "Finding the easiest place to start", "Writing your first win"];

// Added 2026-11-13 after Elmore's note that a short first answer leaves the next screens thin: people like
// taking more than giving, so every screen should offer plenty to tap whatever she typed.

/**
 * Work almost every job has, always offered on the repeats screen after what the read of her job names, so
 * the screen is never thin. Each is something AI can help with.
 */
export const EVERYDAY_TASKS = [
  "Answering messages",
  "Writing emails",
  "Planning my week",
  "Making lists",
  "Social posts",
  "Meeting notes",
  "Looking things up",
  "Keeping records",
];

/** Kinds of work she can tap on the job screen. Each tap adds its words to her answer, so a short answer still says enough. */
export const jobKinds = {
  hint: "Tap what fits, then add a few words if you like.",
  list: ["Office and admin", "Shop or salon", "Health care", "Teaching", "My own business", "Social media and marketing"],
};

// Added 2026-11-14 for Phase 1 of docs/DIRECTION.md, all approved by Karl the same day: the real example screen, how often she does her top task,
// what a Builder has already done with AI, Can you use AI for your work, and the line on the repeats screen.

/** After her top task: one she really did. She can type or talk, and skip it. */
export const exampleScreen = {
  title: "Paste the last one you wrote, or what the last person asked you.", // from DIRECTION.md
  /** Her top task, as she picked or typed it, then the note on names. */
  hint: (task: string) => `${task}. Leave out names.`, // Approved by Karl 2026-11-14
  hintPlain: "Leave out names.", // from DIRECTION.md
  skip: "Skip", // Approved by Karl 2026-11-14
};

export const OFTEN = ["many_a_day", "daily", "few_a_week", "weekly_or_less"] as const;
export type Often = (typeof OFTEN)[number];
/** One tap on the example screen, under the box. Approved by Karl 2026-11-14. */
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

/**
 * Under the repeats screen's choices once she has picked one: how many of her picks AI can help with. Null, and
 * no line, when it can help with none of them. Approved by Karl 2026-11-14.
 */
export function repeatsLine(helps: number, picked: number): string | null {
  if (!helps || !picked) return null;
  if (picked === 1) return "AI can help with this one";
  if (helps === picked) return picked === 2 ? "AI can help with both of these" : `AI can help with all ${picked} of these`;
  return `AI can help with ${helps} of these ${picked}`;
}
