// What she says, put together from the browser's speech recognition for the quiz's answer boxes. Nothing here
// imports the rest of the site, so a Node script can try it on the result lists different browsers send.

/** One entry in the browser's list of results: its best guess so far, and whether that guess is settled. */
export type SpeechResult = { isFinal: boolean; 0: { transcript: string } };

/** Why talking stopped without her stopping it: the microphone was blocked, she said nothing, there's no microphone, or it failed. */
export type MicProblem = "blocked" | "silent" | "no_mic" | "failed";

/**
 * The words of one listening session, rebuilt from the browser's whole list every time it changes. Words still
 * being worked out are included, so they show while she speaks and are replaced once settled. Android's Chrome
 * starts each new result with everything said before it; then the longer result replaces the shorter one
 * instead of repeating it.
 */
export function heardText(results: ArrayLike<SpeechResult>): string {
  const phrases: string[] = [];
  for (let i = 0; i < results.length; i++) {
    const phrase = results[i][0].transcript.trim();
    if (!phrase) continue;
    const last = phrases.at(-1);
    const repeats = last && phrase.toLowerCase().startsWith(last.toLowerCase()) && /^(\s|$)/.test(phrase.slice(last.length));
    if (repeats) phrases[phrases.length - 1] = phrase;
    else phrases.push(phrase);
  }
  return phrases.join(" ");
}

/** What she said, after whatever was in the box when she started talking, with one space between, within the limit. */
export function withSpoken(before: string, spoken: string, max: number): string {
  if (!spoken) return before;
  const start = before.trimEnd();
  return (start ? `${start} ${spoken}` : spoken).slice(0, max);
}

/**
 * The English the browser should listen for: her browser's own kind of English when it names one, like en-GB,
 * so her accent is heard the way she speaks. Any other setting gets US English, since the answers are in English.
 */
export function speechLanguage(browserLanguage: string | undefined): string {
  return browserLanguage && /^en-[A-Za-z]{2}$/.test(browserLanguage) ? browserLanguage : "en-US";
}

/**
 * One go at talking, from tapping Talk instead of typing to Done. Browsers stop listening on their own after
 * a pause, and phones after almost every sentence, so one talk is made of several listening sessions.
 */
export type Talk = {
  /** Everything she said in the sessions that have ended. */
  kept: string;
  /** How many sessions have ended. */
  sessions: number;
  /** How many sessions in a row ended without a word. */
  emptyRuns: number;
  /** Whether any session lasted long enough to have been listening at all. */
  listened: boolean;
};
export const newTalk = (): Talk => ({ kept: "", sessions: 0, emptyRuns: 0, listened: false });

/** How one listening session ended: its words, the browser's error code if any, how long it ran, and whether she tapped Done. */
export type SessionEnd = { heard: string; error: string | null; ms: number; stopped: boolean };

/** This many sessions in a row without a word and listening stops: she has finished, or it isn't hearing her. */
const EMPTY_RUNS = 2;
/** A session shorter than this never really listened. */
const QUICK_MS = 1000;

/**
 * What to do when the browser stops listening. Her words so far are always kept. Unless she tapped Done or
 * something is really wrong, listening starts again, so a pause to think doesn't end her answer. It gives up
 * after two sessions in a row without a word: quietly if she has said something, and otherwise saying that
 * nothing was heard, or that talking doesn't work here when the browser kept stopping at once.
 */
export function afterSession(talk: Talk, end: SessionEnd): { talk: Talk; restart: boolean; problem: MicProblem | null } {
  const next: Talk = {
    kept: [talk.kept, end.heard].filter(Boolean).join(" "),
    sessions: talk.sessions + 1,
    emptyRuns: end.heard ? 0 : talk.emptyRuns + 1,
    listened: talk.listened || end.ms >= QUICK_MS,
  };
  const stop = (problem: MicProblem | null) => ({ talk: next, restart: false, problem });
  if (end.stopped) return stop(null);
  const why = end.error ? problemFor(end.error) : null;
  // Some browsers only let the microphone start from a tap. On a later session that isn't a block worth
  // reporting: she keeps what she said and can tap again.
  if (why === "blocked") return stop(talk.sessions === 0 ? "blocked" : null);
  if (why === "no_mic" || why === "failed") return stop(why);
  if (next.emptyRuns < EMPTY_RUNS) return { talk: next, restart: true, problem: null };
  return stop(next.kept ? null : next.listened ? "silent" : "failed");
}

/** The browser's error code in her terms. Null when the listening was cut off on purpose, as on leaving the screen. */
export function problemFor(code: string): MicProblem | null {
  switch (code) {
    case "aborted":
      return null;
    case "not-allowed":
    case "service-not-allowed":
      return "blocked";
    case "no-speech":
      return "silent";
    case "audio-capture":
      return "no_mic";
    default:
      return "failed";
  }
}
