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

/** The fourth row on Where are you with AI: her own words in a box. */
export const levelOther = { label: "Something else", placeholder: "Tell us in your own words" };

/** The chip under How do you picture AI helping. Tapping it is her answer, and the plan brings the ideas. */
export const pictureNoIdea = { hint: "Any guess is fine, and so is no idea.", chip: "I have no idea yet" };

/** Asked of everyone who hasn't made AI stick yet (not tried, or tried and it didn't stick). */
export const heldBack = {
  title: "What has held you back so far?",
  hint: "Pick all that fit.",
  choices: [
    "I don’t know where to start",
    "I’m not sure it’s safe",
    "I worry it gets things wrong",
    "No time to learn",
    "It felt too technical",
  ],
};

/** Asked of everyone who already uses AI. The choices come from the read of her job. */
export const aiUses = { title: "What do you use it for today?", hint: "Pick all that fit." };

/** What she sees on What do you use it for today when the read of her job has no list of its own. */
export const FALLBACK_AI_USES = ["Writing messages", "Social posts", "Planning", "Answering questions", "Summing things up"];

export const DEVICES = ["phone", "computer", "both"] as const;
export type Device = (typeof DEVICES)[number];
/** Asked of everyone: it decides whether her setup steps are for a phone, a computer or both. */
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
export const questionsWait = "Writing a few questions for your job";

/** Shown in turn while her answers are read and her first win is written, ending where her result begins. */
export const readingLines = ["Reading your answers", "Finding the easiest place to start", "Writing your first win"];
