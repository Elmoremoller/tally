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
