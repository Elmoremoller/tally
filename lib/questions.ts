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
   * The extra work she got pulled into, the main input for her hand back pile. Replaced "What would you rather
   * spend your time on at work?" on 2026-10-24; stored as extra_work. Words from the user's brief.
   */
  extraWork: {
    title: "What do you end up doing that isn’t really your job?",
    hint: "The favors, the extras, the things you got pulled into.",
    placeholder: "Taking notes in every meeting, running our socials, planning the team lunch.",
  },
} as const;
export type OpenQuestion = keyof typeof openQuestions;

/** Under every open question. */
export const privacyNote = "No need to name your company or colleagues.";

/** The two taps, on one screen. */
export const toolsQuestion = {
  title: "Which AI tools do you use for work?",
  hint: "Pick all that fit",
  /** In the field that opens under the chips when she picks Other. `label` is for screen readers only. DRAFT */
  other: { label: "Other AI tools you use", placeholder: "Like the AI in Canva, Notion or Grammarly" },
};
export const policyQuestion = { title: "What’s your company’s view on AI?" };

/**
 * Talking instead of typing. `start` also shows in the landing page's How it works. `speak` sits in the empty box
 * while listening; `problems` say why it stopped when she didn't stop it. Approved on 2026-10-24.
 */
export const micCopy = {
  start: "Talk instead of typing",
  stop: "Done",
  listening: "Listening",
  speak: "Start talking. Your words show up here as you go.",
  problems: {
    blocked: "Your browser didn’t let us use the microphone. Type instead, or tap the mic on your keyboard.",
    silent: "We didn’t hear anything. Tap Talk instead of typing to try again.",
    no_mic: "We couldn’t find a microphone. Type instead, or tap the mic on your keyboard.",
    failed: "Talking isn’t working in this browser. Type instead, or tap the mic on your keyboard.",
  },
} as const;

/** While the AI reads her answers. DRAFT */
export const readingLine = "Reading your week";

/** The one follow up question, when her week was too thin. The question itself comes from the AI. */
export const followUpCopy = { hint: "A line or two is enough." }; // DRAFT

/** Here's what we heard: her role, her tasks with their hours, and the extra work she got pulled into. */
export const heardCopy = {
  title: "Here’s what we heard",
  tasks: "Where your week goes", // DRAFT
  slider: "Move the slider so the hours are yours.", // DRAFT
  extra: "What you’ve been pulled into", // DRAFT
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
