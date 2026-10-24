import { hoursText } from "./week";

// The quiz's words. The questions, placeholders and helper lines are the brief's, word for word; lines marked
// DRAFT fill a gap and wait for approval. Same rules as the landing page: no dashes, no colons in headlines.

/** The three open questions, in order. */
export const openQuestions = {
  job: {
    title: "What’s your job, in your own words?",
    /** Typed out in turn in the empty box. The first is the brief's; the rest were approved on 2026-10-24. */
    examples: [
      "Marketing coordinator at a 200 person software company, I handle our events and newsletters.",
      "Executive assistant to two partners at a law firm. I run their calendars, travel and the office.",
      "HR generalist at a 60 person startup. Hiring, onboarding and every team event.",
      "Project manager at a design agency. I keep client projects on track and on budget.",
      "Operations coordinator at a nonprofit. Budgets, vendors and keeping the office running.",
    ],
  },
  week: {
    title: "Walk us through a normal week. What eats your time?",
    placeholder: "Lots of meetings where I end up taking notes, chasing people for updates, fixing slides for my boss...",
  },
  /**
   * The work she wants her won back hours to go to, and credit for. Asked as the brief's "What do you wish
   * you were known for at work?" until 2026-10-24; reworded because few people have put that into words.
   * Still stored as known_for. The title, hint and examples were approved on 2026-10-24.
   */
  knownFor: {
    title: "What would you rather spend your time on at work?",
    hint: "The work you’d like to get credit for. One short line is enough.",
    examples: [
      "Strategy, not just being the one who gets things done.",
      "Planning our campaigns, not just sending them out.",
      "Leading projects instead of taking the notes in them.",
      "Growing our client accounts. It’s what I’m best at.",
      "Building a better way to hire and onboard people.",
    ],
  },
} as const;
export type OpenQuestion = keyof typeof openQuestions;

/** Under every open question. */
export const privacyNote = "No need to name your company or colleagues.";

/** The two taps, on one screen. */
export const toolsQuestion = { title: "Which AI tools can you use at work?", hint: "Pick all that fit" };
export const policyQuestion = { title: "What’s your company’s view on AI?" };

export const micCopy = { start: "Talk instead of typing", stop: "Stop listening", listening: "Listening" }; // DRAFT

/** While the AI reads her answers. DRAFT */
export const readingLine = "Reading your week";

/** The one follow up question, when her week was too thin. The question itself comes from the AI. */
export const followUpCopy = { hint: "A line or two is enough." }; // DRAFT

/** Here's what we heard: her role, her tasks with their hours, and what she wants to be known for. */
export const heardCopy = {
  title: "Here’s what we heard",
  tasks: "Where your week goes", // DRAFT
  slider: "Move the slider so the hours are yours.", // DRAFT
  knownFor: "What you’d rather spend your time on", // DRAFT
  yes: "Looks right",
  edit: "Edit",
  doneEditing: "Done editing",
  remove: "Remove",
  name: "Task",
  pile: "Pile",
  perWeek: (hours: number) => `${hoursText(hours)} a week`,
};

/** The free result: the big number, then her tasks in three piles, names only. */
export const resultCopy = {
  lead: "You spend about",
  line: "a week on work nobody notices.",
};

export const quizErrors = {
  thin: "We couldn’t find enough in your answers yet. Add a little more about your week, then try again.", // DRAFT
  limit: "We’ve read your answers as many times as we can for now. Please try again tomorrow.", // DRAFT
  generic: "Something went wrong reading your answers. Please try again.", // DRAFT
  missing: "Some answers are missing. Please go back and check them.",
};
