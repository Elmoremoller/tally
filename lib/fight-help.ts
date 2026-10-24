import type { StepId } from "./progress";

// The help for right after a fight, exactly as approved: calming down, making up, the 10 minute repair and
// looking back on your own. Same rules as the rest of the site: no dashes as punctuation, no testimonials or
// statistics, never "course", "program", "product", "module" or "lesson", and no big promises.

/** The two first names from the quiz, from the side of the person reading. Either can be missing. */
export type HelpNames = { me: string | null; partner: string | null };
/** The person holding the phone, or their partner. */
export type Who = "me" | "partner";

/** How long the break is, and each part of the 10 minute repair. */
export const PAUSE_MS = 20 * 60_000;
export const PART_MS = 2 * 60_000;
export const PARTS = 5;

/** "Alex", or "your partner" when we don't know their name, like the rest of the plan. */
export const partnerOf = (n: HelpNames) => n.partner ?? "your partner";
const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** "9:40": 20 minutes from now, rounded up to the next 5 minutes, the way people say a time. */
export function backAt(now: Date) {
  const at = new Date(now.getTime() + PAUSE_MS);
  at.setMinutes(Math.ceil(at.getMinutes() / 5) * 5, 0, 0);
  return `${at.getHours() % 12 || 12}:${String(at.getMinutes()).padStart(2, "0")}`;
}

/** "18:42", "2:00", "0:07" */
export function clockTime(ms: number) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

/**
 * How each person is named on a part of the repair. With both names, the screen speaks about them both
 * ("Sam talks, Alex listens."). Without them, the one holding the phone is "you".
 */
function person(who: Who, n: HelpNames) {
  if (n.me && n.partner) return { name: who === "me" ? n.me : n.partner, you: false };
  return who === "me" ? { name: "you", you: true } : { name: partnerOf(n), you: false };
}

export const helpCopy = {
  // Right after paying
  ready: "Your plan is ready",
  question: "Did you just have a fight?",
  answers: { heated: "Yes, and it’s still heated", calmer: "Yes, but it’s calmer now", no: "No" },

  // At the top of the plan
  box: {
    title: "Just had a fight?",
    text: "Calm down, start making up, or look back on it on your own.",
    start: "Start here",
    waiting: "Your repair is waiting",
    resume: "Pick up where you left off",
    startOver: "Start over",
  },
  how: { title: "How are things right now?", heated: "Still heated", calmer: "Calmer now", alone: "Look back on it on my own first" },
  backToPlan: "Back to my plan",
  back: "Back",
  done: "Done",

  // Calm down first
  calm: {
    title: "First, let’s get things calm",
    notice: "A racing heart means nobody can really listen, you included. That’s the moment to stop, not to push through.",
    say: (time: string) => `I’m getting flooded. I need 20 minutes. I’ll come find you at ${time}.`,
    after:
      "Then step away for at least 20 minutes and do something with your hands, like the dishes or a walk. Try not to replay the fight in your head.",
    start: "Start the 20 minutes",
    unsafe: "If you ever feel unsafe, call 911, or the National Domestic Violence Hotline at 1.800.799.7233.",
    kept: "We’ve kept your place.",
  },

  // The 20 minutes
  pause: {
    title: "Take your 20 minutes",
    left: (time: string) => `${time} left`,
    tips: [
      "Do something with your hands, like the dishes or a walk.",
      "Try not to replay the fight. When you catch yourself, come back to what you’re doing.",
      "Breathe out slower than you breathe in. In for four, out for six.",
    ],
    close: "You can close this page. The timer keeps going.",
    check: "How do you feel now?",
    ready: "Calmer, I’m ready",
    heated: "Still heated",
  },
  later: {
    title: "That’s okay",
    text: "Take another 20 minutes, or pick it up later. It can wait until you’re both calm.",
    say: "Can we pick this up later, when we’re both calmer?",
    more: "20 more minutes",
    later: "Pick it up later",
    doneTitle: "Later is fine",
    doneText: "When you’re both ready, go first with “Can we try again?”",
  },

  // Start making up
  makeUp: {
    title: "Let’s start making up",
    notice: "Making up doesn’t need a winner. It needs someone to go first.",
    say: "Can we finish this properly? Ten minutes.",
    yes: (n: HelpNames) => `${capital(partnerOf(n))} said yes`,
    notReady: (n: HelpNames) => `${capital(partnerOf(n))} isn’t ready`,
    alone: "Look back on it on my own first",
  },
  notReady: {
    title: "That’s okay",
    text: "You went first, and that counts. Give it a little time, then ask when would work:",
    say: "When would be a good time to talk about it?",
    half: (n: HelpNames) =>
      `Or do your half: tell ${partnerOf(n)}, in two minutes, how it felt for you and one thing you’d need next time. Then let it rest.`,
    alone: "Look back on it on my own",
  },

  // The 10 minute repair
  repair: {
    title: "The 10 minute repair",
    text: "Five parts of two minutes. You take turns talking and listening, then agree on one small thing together. You’re not deciding who was right.",
    rules: [
      "Talk about how it felt for you, not what they did.",
      "When it’s your turn to listen, just listen. Then say back what you heard.",
      "If it heats up again, stop and take 20 minutes. We’ll keep your place.",
    ],
    who: "Who talks first?",
    whoHint: "It doesn’t matter. You both get a turn.",
    first: (who: Who, n: HelpNames) =>
      n.me && n.partner ? `${who === "me" ? n.me : n.partner} first` : who === "me" ? "Me first" : "My partner first",
    part: (index: number) => `Part ${index + 1} of ${PARTS}`,
    felt: "How did it feel?",
    need: "What would you need next time?",
    agree: "Agree on one small thing",
    together: "Together.",
    agreeText: "Pick one small thing you’ll both try next time. Small and specific is easier to keep.",
    /** "Sam talks, Alex listens." / "You talk, your partner listens." */
    talks: (speaker: Who, n: HelpNames) => {
      const a = person(speaker, n);
      const b = person(speaker === "me" ? "partner" : "me", n);
      return `${capital(a.name)} ${a.you ? "talk" : "talks"}, ${b.name} ${b.you ? "listen" : "listens"}.`;
    },
    feltPrompt: (listener: Who, n: HelpNames) => {
      const b = person(listener, n);
      return `Start with “I felt…”, and keep it about you. Then ${b.name} ${b.you ? "say back what you heard" : "says back what they heard"}: “So you felt…”`;
    },
    needPrompt: (listener: Who, n: HelpNames) => {
      const b = person(listener, n);
      return `Start with “Next time, I’d need…”, and keep it to one or two things. Then ${b.name} ${b.you ? "say" : "says"} it back.`;
    },
    next: "Next",
    pause: "Pause",
    resume: "Resume",
    timesUp: "Time’s up. Finish your sentence, then tap Next.",
    heating: "It’s heating up again",
    stop: "Stop for now",
    stoppedTitle: "Stopped for now",
    stoppedText: "Pick it up when you’re both ready. We’ve kept your place.",
    doneTitle: "That’s the repair done",
    doneText: "End with something kind: a hug, a thank you, or “I’m glad we talked.”",
  },

  // Look back on it on your own
  review: {
    title: "Look back on it on your own",
    text: "Five short questions, about 7 minutes. It can help you see the fight more clearly before you talk.",
    privacy: "We don’t save what you write here, and it’s never shared.",
    notTherapy: "This isn’t therapy. It’s a calm way to think it through.",
    start: "Start",
    questions: [
      { title: "What happened?", hint: () => "Just what happened, the way a camera would see it." },
      { title: "What did you feel?", hint: () => "Hurt, ignored, worried, tired? Tap any that fit, or write your own." },
      {
        title: "What did you assume?",
        hint: (n: HelpNames) =>
          `About what ${partnerOf(n)} meant, or what they think of you. Like “They don’t care” or “It’s always on me”.`,
      },
      {
        title: "How would a calm friend see it?",
        hint: () => "Someone who cares about you both and wants it to work. What would they say?",
      },
      { title: "What’s one thing you’d do differently?", hint: () => "Something small you could try next time." },
    ],
    feelings: ["Hurt", "Ignored", "Angry", "Worried", "Tired", "Embarrassed", "Lonely", "Overwhelmed"],
    next: "Next",
    back: "Back",
    doneTitle: "Here’s what you noticed",
    labels: ["What happened", "What you felt", "What you assumed", "A calm friend’s view", "Your one thing for next time"],
    keep: "We don’t save this. Copy it if you want to keep it.",
    makeUp: "Start making up",
  },

  // On the plan's own steps
  steps: { repair: "Start the 10 minute repair", pause: "Start the 20 minutes" },
};

/** The steps in the plan that open the guided version: the 10 minute repair, or the 20 minutes. */
export const STEP_HELP: Partial<Record<StepId, "repair" | "pause">> = {
  ten_minute: "repair",
  after_break: "repair",
  racing_heart: "pause",
  made_worse: "pause",
};

/** Where the help opens, with which screen first. */
export type HelpStart = "repair" | "pause" | "resume";
export const helpHref = (base: string, go?: HelpStart) => (go ? `${base}${base.includes("?") ? "&" : "?"}go=${go}` : base);
export const helpStart = (value: unknown): HelpStart | null =>
  value === "repair" || value === "pause" || value === "resume" ? value : null;

/** What saving the repair's agreement says back: nothing when it's saved. */
export type AgreeResult = { error: string } | { safety: true } | null;
