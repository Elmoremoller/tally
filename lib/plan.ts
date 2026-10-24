import { toward, type Part } from "./progress";
import { coupleTypes, fightTopics, type CoupleTypeId, type FightMove } from "./quiz";

// The plan’s words. Same rules as the rest of the site: no dashes as punctuation, no testimonials or
// statistics, never "course", "program", "product", "module" or "lesson". It always leads with the
// couple’s situation, uses their couple type and their own fight topics, and sounds like a smart, warm
// friend. Never clinical, never therapy, never big promises.

export type { Part };
export const partNames: Record<Part, string> = { prevent: "Prevent", pause: "Pause", repair: "Repair" };

/** Everything the plan needs to speak to one person about their own fights. */
export type PlanContext = {
  coupleType: CoupleTypeId;
  topics: string[];
  /** What the person reading does when a fight starts. */
  you: FightMove;
  /** What their partner does. */
  partner: FightMove;
  partnerName: string | null;
  start: string;
  makeUp: string;
};

/** "Alex" or "your partner" */
export const partnerWord = (c: PlanContext) => c.partnerName ?? "your partner";
/** Their main topic, in a sentence: the one their story was about, or else the first they picked. "chores" */
export const mainTopic = (c: PlanContext) =>
  (fightTopics.find((t) => t.id === c.topics[0])?.label ?? "the small stuff").toLowerCase();
export const topicLabels = (c: PlanContext) =>
  fightTopics.filter((t) => c.topics.includes(t.id)).map((t) => t.label);

/** "Chores", "Chores and Money", "Chores, Money and Family". A comma before the last "and" when a topic
 * has "and" in it already: "Phones and trust, and Sharing space". */
export function listOf(items: string[]) {
  if (items.length < 2) return items.join("");
  const comma = items.some((item) => item.includes(" and ")) ? "," : "";
  return `${items.slice(0, -1).join(", ")}${comma} and ${items[items.length - 1]}`;
}

const youDo: Record<FightMove, string> = {
  sort_it_out_now: "you want to talk now",
  go_quiet: "you go quiet",
  get_sharp: "you get sharp",
  say_sorry_fast: "you say sorry just to end it",
};
const theyDo: Record<FightMove, [they: string, name: string]> = {
  sort_it_out_now: ["they want to talk now", "wants to talk now"],
  go_quiet: ["they go quiet", "goes quiet"],
  get_sharp: ["they get sharp", "gets sharp"],
  say_sorry_fast: ["they say sorry just to end it", "says sorry just to end it"],
};
const bothDo: Record<FightMove, string> = {
  sort_it_out_now: "you both want to talk now",
  go_quiet: "you both go quiet",
  get_sharp: "you both get sharp",
  say_sorry_fast: "you both say sorry just to end it",
};

/** "you go quiet and Alex wants to talk now", or "you both go quiet" */
export function situation(c: PlanContext) {
  if (c.you === c.partner) return bothDo[c.you];
  const [they, named] = theyDo[c.partner];
  return `${youDo[c.you]} and ${c.partnerName ? `${c.partnerName} ${named}` : they}`;
}

// ---------- Under Today’s step ----------

/** A line under Today’s step, for their couple type. */
export const typeTips: Record<CoupleTypeId, Record<Part, string>> = {
  push_and_pull: {
    prevent: "The one who goes quiet often keeps small things to themselves. Today is a good day to say one.",
    pause: "This is the part that helps you two most: space for one of you, and a set time to come back for the other.",
    repair: "The one who wanted to talk often reaches out first. Take turns, so it isn’t always the same person.",
  },
  quick_sparks: {
    prevent: "You both say things fast. Today, say the small thing slowly, at a calm moment.",
    pause: "The first minute decides the fight. Pause early, before it gets loud.",
    repair: "You cool down fast, so the repair is easy to skip. Finishing the fight is what stops it coming back.",
  },
  slow_simmer: {
    prevent: "This is the part that helps you two most. The small thing you’d normally let go is the one to say.",
    pause: "Your fights go quiet, not loud, so pausing means saying “I need a minute” out loud, then coming back.",
    repair: "Moving on without talking is what lets things pile up. A short repair clears them before they do.",
  },
};

// ---------- Scripts for their fights, open from the start ----------

export const scriptsSection = {
  title: "Words for the fights that keep coming back",
  text: "Most fights like these never fully go away. These words won’t settle it for good, but they can help you talk about it without it blowing up.",
};

/** Every script has three parts: a soft way in, a line for when it heats up (by side), and a repair line. */
type TopicScripts = { open: string; towardNow: string; awayNow: string; after: string };

/** What most couples fight about, whatever the topic. Shown first, to everyone, before their own topics. */
export const everyoneTopics = [
  { id: "tone", label: "Tone" },
  { id: "not_heard", label: "Not feeling heard" },
];

export const scripts: Record<string, TopicScripts> = {
  tone: {
    open: "Can I tell you how that came across to me? It might not be how you meant it.",
    towardNow: "I can hear my tone getting sharp. Let me try that again, slower.",
    awayNow: "I want to hear you. Can we slow down and start that again?",
    after: "I’m sorry for how I said that. What I meant was ___.",
  },
  not_heard: {
    open: "Can I have five minutes to say this? Then tell me what you heard, and I’ll do the same for you.",
    towardNow: "I’m not trying to win. I just need to know you heard me. Can you tell me what you heard?",
    awayNow: "I want to get this right. Give me a minute, then say it again and I’ll just listen.",
    after: "I don’t think I really listened earlier. Can you tell me again? This time I’ll just listen.",
  },
  chores: {
    open: "Can we look at who does what this week? I’m feeling stretched, and I’d like it to feel fair for both of us.",
    awayNow: "I’m not ignoring you or the dishes. I need 20 minutes, then I want to sort out who does what.",
    towardNow: "I can see you need a minute. Can we talk about chores tonight at 8, after dinner?",
    after:
      "I was short with you about the chores. It’s not really about the dishes, I just felt like I was doing it alone. Can we split it differently this week?",
  },
  money: {
    open: "Can we find 20 minutes this week to look at money together? I’m not blaming anyone. I just want us on the same page.",
    awayNow: "Money stresses me out and I’m shutting down. Give me 20 minutes and I’ll come back to it with you.",
    towardNow: "I don’t want to fight about money. Can we look at it together on Sunday, when we’re both calm?",
    after:
      "I made it sound like you’re bad with money, and that’s not fair. I get scared about it. Can we make a plan together?",
  },
  phones_and_trust: {
    open: "Something’s been on my mind, and I’d rather ask than guess. Can we talk about it tonight?",
    awayNow: "I’m not hiding anything. I just need a minute before I can talk about this without getting defensive.",
    towardNow: "I’m feeling unsure and I want to talk about it, not accuse you. Can we sit down later tonight?",
    after:
      "I got suspicious and it came out as blame. What I actually need is to feel close to you. Can we talk about what would help?",
  },
  time_with_friends: {
    open: "I love that you have your friends. Can we plan the week so we get some time together too?",
    awayNow: "I need a moment. I want to get this right, not just say yes or no.",
    towardNow: "I don’t want you to see your friends less. I just miss you. Can we plan our week together?",
    after:
      "I made you feel guilty for having a life, and that’s not what I want. Can we find a balance that works for both of us?",
  },
  family: {
    open: "Can we talk about the next visit before it happens? I’d like us to decide together what works.",
    awayNow: "This is a lot for me. Give me 20 minutes and I’ll come back, so we can work out what we tell them.",
    towardNow: "I know it’s your family and it’s hard. Can we decide together what we say, before we see them?",
    after:
      "I said things about your family that hurt, and I’m sorry. I felt left out of the decision. Can we make the next one together?",
  },
  sharing_space: {
    open: "Can I ask for one small change at home? It would help me feel more relaxed there.",
    awayNow: "I need some room for a bit. It’s not about you, and I’ll be back in 20 minutes.",
    towardNow: "I want our home to feel good for both of us. Can we pick one thing to change this week?",
    after:
      "I made a big deal about the mess. What I really need is one corner that stays calm. Can we try that?",
  },
  texts_that_land_wrong: {
    open: "Can we agree that anything big gets a call, not a text? I think we both read each other wrong over text.",
    awayNow: "That text came across wrong and I need a minute. Can we talk when you’re home, instead of over text?",
    towardNow: "I think my text came out wrong. Can I call you instead?",
    after: "My text sounded colder than I meant, and I’m sorry. Next time something matters, I’ll call.",
  },
};

export type ScriptCard = { label: string; lead: string; words: string };

/** The three scripts for one topic: to bring it up, if it heats up (for their side), and to make up after. */
export function scriptsFor(c: PlanContext, topicId: string): ScriptCard[] {
  const set = scripts[topicId];
  if (!set) return [];
  return [
    { label: "To bring it up", lead: "At a calm moment, start soft:", words: set.open },
    {
      label: "If it heats up",
      lead: `When ${situation(c)}, try this:`,
      words: toward(c.you) ? set.towardNow : set.awayNow,
    },
    { label: "To make up after", lead: `Once you’ve both cooled down, try this:`, words: set.after },
  ];
}

/** "You two are Push and Pull" style facts, for the AI message check. */
export function describeForAssistant(c: PlanContext) {
  const type = coupleTypes[c.coupleType];
  return [
    `Couple type: ${type.name}. ${type.description}`,
    `When a fight starts, ${situation(c)}.`,
    `They fight most about: ${listOf(topicLabels(c)) || "everyday things"}.`,
    c.partnerName ? `The partner’s first name is ${c.partnerName}.` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
