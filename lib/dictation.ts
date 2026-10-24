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
