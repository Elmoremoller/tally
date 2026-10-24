// Where someone is in their plan, worked out from the answers they gave after each step. The words live in
// lib/steps.ts; this file holds only ids and rules, and imports nothing, so it can be tested on its own.

export type Part = "prevent" | "pause" | "repair";

export const STEP_IDS = [
  "small_thing",
  "ask_one_question",
  "check_in",
  "running_on_empty",
  "notice_good",
  "one_request",
  "one_thing",
  "agree_pause",
  "racing_heart",
  "coming_back",
  "one_minute",
  "text_regret",
  "soft_start",
  "say_when_back",
  "first_move",
  "sorry_lands",
  "ten_minute",
  "after_break",
  "first_check_in",
  "made_worse",
] as const;
export type StepId = (typeof STEP_IDS)[number];

export const STEP_PARTS: Record<StepId, Part> = {
  small_thing: "prevent",
  ask_one_question: "prevent",
  check_in: "prevent",
  running_on_empty: "prevent",
  notice_good: "prevent",
  one_request: "prevent",
  one_thing: "prevent",
  agree_pause: "pause",
  racing_heart: "pause",
  coming_back: "pause",
  one_minute: "pause",
  text_regret: "pause",
  soft_start: "pause",
  say_when_back: "pause",
  first_move: "repair",
  sorry_lands: "repair",
  ten_minute: "repair",
  after_break: "repair",
  first_check_in: "repair",
  made_worse: "pause",
};

/** Steps where they agree on something together. After It helped, they're asked what they agreed. */
export const AGREE_STEPS: readonly StepId[] = ["check_in", "running_on_empty", "agree_pause", "coming_back", "first_move"];
/** Steps with no On your own version, because they're something you do alone anyway. */
const NO_ALONE: readonly StepId[] = ["text_regret", "made_worse"];
export const hasAlone = (id: StepId) => !NO_ALONE.includes(id);

/** The line they can add about what happened, and what they agreed on. */
export const LINE_MAX = 300;
export const AGREEMENT_MAX = 200;

export const OUTCOMES = ["helped", "no_engage", "worse", "not_yet"] as const;
export type Outcome = (typeof OUTCOMES)[number];
export const VERSIONS = ["main", "alone"] as const;
export type Version = (typeof VERSIONS)[number];

/** Moving toward the fight (sorting it out now, getting sharp), rather than away from it. */
export const toward = (move: string) => move === "sort_it_out_now" || move === "get_sharp";

// The four paths, as approved. Push and Pull has one for each side, so the two of them get different paths.
const PATHS: Record<"talks_now" | "needs_space" | "quick_sparks" | "slow_simmer", StepId[]> = {
  talks_now: ["soft_start", "one_request", "agree_pause", "coming_back", "racing_heart", "one_minute", "small_thing", "check_in", "first_move", "ten_minute", "text_regret", "notice_good", "sorry_lands", "first_check_in"],
  needs_space: ["say_when_back", "agree_pause", "coming_back", "small_thing", "racing_heart", "one_minute", "check_in", "first_move", "ten_minute", "text_regret", "one_request", "notice_good", "sorry_lands", "first_check_in"],
  quick_sparks: ["racing_heart", "agree_pause", "one_thing", "soft_start", "after_break", "ten_minute", "coming_back", "one_minute", "sorry_lands", "text_regret", "small_thing", "notice_good", "first_move", "first_check_in"],
  slow_simmer: ["small_thing", "check_in", "one_request", "ask_one_question", "notice_good", "running_on_empty", "agree_pause", "coming_back", "ten_minute", "first_move", "one_minute", "sorry_lands", "text_regret", "first_check_in"],
};

/** Their path, from their pattern and what they do when a fight starts. A very heated last fight starts with calming down. */
export function pathFor(coupleType: string, you: string, heat: string | null): StepId[] {
  const base =
    coupleType === "push_and_pull"
      ? toward(you)
        ? PATHS.talks_now
        : PATHS.needs_space
      : coupleType === "quick_sparks"
        ? PATHS.quick_sparks
        : PATHS.slow_simmer;
  return heat === "high" ? ["racing_heart", ...base.filter((id) => id !== "racing_heart")] : [...base];
}

/** The step on screen: a step from their path, or "made_worse" after It got worse. */
export type Current = { stepId: StepId; version: Version };

export type Progress = {
  path: StepId[];
  /** Their place in the path. While "made_worse" is on screen, the step that went badly. */
  index: number;
  /** Null once they've been through the whole path. */
  current: Current | null;
  /** When the step on screen became today's step, for when to ask about it. */
  since: Date;
  /** How many times in a row they answered Didn't get to it about this step. */
  notYet: number;
};

/** The line shown above the next step, for the answer they just gave. */
export type Ack = "helped" | "no_engage" | "no_engage_next" | "worse" | "not_yet" | "not_yet_smaller";
export const ACKS: readonly Ack[] = ["helped", "no_engage", "no_engage_next", "worse", "not_yet", "not_yet_smaller"];

export const startProgress = (path: StepId[], startedAt: Date): Progress => ({
  path,
  index: 0,
  current: path.length ? { stepId: path[0], version: "main" } : null,
  since: startedAt,
  notYet: 0,
});

const moveTo = (p: Progress, index: number, at: Date): Progress => ({
  ...p,
  index,
  current: index < p.path.length ? { stepId: p.path[index], version: "main" } : null,
  since: at,
  notYet: 0,
});

/**
 * One answer about the step on screen, and where it leads, as approved: It helped moves on; My partner
 * didn't engage gives the On your own version (or moves on when there is none); It got worse gives
 * "When trying it made things worse", and after that the path goes on; Didn't get to it keeps the step,
 * and the second time in a row gives its smaller On your own version.
 */
export function advance(p: Progress, outcome: Outcome, at: Date): { progress: Progress; ack: Ack } {
  const current = p.current;
  if (!current) return { progress: p, ack: "helped" };
  const alone = current.version === "main" && hasAlone(current.stepId);

  if (outcome === "not_yet") {
    if (p.notYet >= 1 && alone) {
      return { progress: { ...p, current: { ...current, version: "alone" }, since: at, notYet: 0 }, ack: "not_yet_smaller" };
    }
    return { progress: { ...p, since: at, notYet: p.notYet + 1 }, ack: "not_yet" };
  }
  if (current.stepId === "made_worse") {
    // Calming down is the step itself, so another bad round stays here; anything else goes on with the path.
    if (outcome === "worse") return { progress: { ...p, since: at, notYet: 0 }, ack: "worse" };
    return { progress: moveTo(p, p.index + 1, at), ack: outcome === "helped" ? "helped" : "no_engage_next" };
  }
  if (outcome === "worse") {
    return { progress: { ...p, current: { stepId: "made_worse", version: "main" }, since: at, notYet: 0 }, ack: "worse" };
  }
  if (outcome === "no_engage") {
    if (alone) return { progress: { ...p, current: { ...current, version: "alone" }, since: at, notYet: 0 }, ack: "no_engage" };
    return { progress: moveTo(p, p.index + 1, at), ack: "no_engage_next" };
  }
  return { progress: moveTo(p, p.index + 1, at), ack: "helped" };
}

export type ReviewRow = { stepId: StepId; version: Version; outcome: Outcome; at: Date };

/**
 * Plays their answers back in order. An answer only counts when it was about the step that was on screen,
 * so an old or doubled answer can't move anyone on. Returns the answers that counted, for Your steps so far.
 */
export function replay(path: StepId[], startedAt: Date, reviews: ReviewRow[]) {
  let progress = startProgress(path, startedAt);
  const counted: ReviewRow[] = [];
  for (const review of [...reviews].sort((a, b) => a.at.getTime() - b.at.getTime())) {
    const current = progress.current;
    if (!current) break;
    if (review.stepId !== current.stepId || review.version !== current.version) continue;
    progress = advance(progress, review.outcome, review.at).progress;
    counted.push(review);
  }
  return { progress, counted };
}

/** They're asked "Did you try it?" the next time they open the plan, once the step has been up 8 hours. */
export const REVIEW_AFTER_MS = 8 * 60 * 60 * 1000;
export const reviewDue = (p: Progress, now: Date) => p.current !== null && now.getTime() - p.since.getTime() >= REVIEW_AFTER_MS;

/** What each small moment helps with, in the same order as their words in lib/steps.ts. */
export const MOMENT_THEMES: readonly (readonly string[])[] = [
  ["feeling_heard"],
  ["closeness"],
  ["feeling_heard"],
  ["feeling_heard"],
  ["closeness"],
  ["time_together"],
  ["respect"],
  ["closeness"],
  ["time_together"],
  ["feeling_heard"],
  ["trust"],
  ["closeness"],
  ["respect"],
  ["fairness"],
  ["feeling_heard"],
  ["closeness"],
  ["feeling_heard"],
  ["calm", "time_together"],
  ["respect"],
  ["calm"],
  ["closeness"],
];

/** Today's small moment: a new one each day, the ones for what they want more of first. */
export function momentIndex(startedAt: Date, now: Date, wantsMoreOf: string | null) {
  const day = Math.max(0, Math.floor((now.getTime() - startedAt.getTime()) / 86_400_000));
  const all = MOMENT_THEMES.map((_, i) => i);
  const first = wantsMoreOf ? all.filter((i) => MOMENT_THEMES[i].includes(wantsMoreOf)) : [];
  const order = [...first, ...all.filter((i) => !first.includes(i))];
  return order[day % order.length];
}
