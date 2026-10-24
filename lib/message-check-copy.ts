// The message check's words, exactly as approved, and the shape of an answer. Kept apart from
// lib/message-check.ts, so the page can use them without loading the AI code. Same rules as the rest of the
// site: no dashes as punctuation, no testimonials or statistics, and no big promises.

export type Verdict = "send" | "rework" | "in_person" | "wait";

/** What the check says back. Every part but the verdict is empty when it doesn't apply. */
export type Review = {
  verdict: Verdict;
  read: string;
  /** Words from their message that could sound like blame, each quoted exactly, and why. */
  flags: { words: string; why: string }[];
  /** What they're asking for underneath, in their own voice. */
  request: string;
  /** A version to send: one that keeps their point, a text asking to talk, or one to send for now. */
  version: string;
  safety: boolean;
};

export const checkCopy = {
  title: "Check a message before you send it",
  text: (partner: string) =>
    `Paste a text you’re about to send ${partner}. You’ll get an honest read of how it might come across, and a clearer version that keeps your point.`,
  verdicts: {
    send: "Good to send",
    rework: "Worth another look",
    in_person: "Better said in person",
    wait: "Maybe wait a bit",
  } satisfies Record<Verdict, string>,
  read: "How it might read",
  flags: "Words that could sound like blame",
  request: "What you’re asking for",
  version: {
    rework: "A version that keeps your point",
    in_person: "To ask for a talk instead",
    wait: "To send for now",
  } satisfies Record<Exclude<Verdict, "send">, string>,
  copy: "Copy this version",
  note: (partner: string) => `This is how it might read, not how ${partner} will react.`,
};
