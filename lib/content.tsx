import type { ComponentType, SVGProps } from "react";
import { Check, Heart, Pair, PauseCircle, Shield, Sparkle } from "@/components/icons";
import { hotline } from "./safety";

// Page copy, exactly as approved. Keep it free of dashes, testimonials and statistics. The only quotes on the
// site are real founding couple quotes, in lib/quotes.ts.

export const topics = [
  "Chores",
  "Money",
  "Phones and trust",
  "Time with friends",
  "Family",
  "Sharing space",
  "Texts that land wrong",
] as const;

export const steps = [
  "Answer a few quick questions about you two.",
  "See your personal plan, made for your fights.",
  "Try one small step a day, on your own or together.",
] as const;

type MethodStep = { title: string; text: string; Icon: ComponentType<SVGProps<SVGSVGElement>> };

export const method: readonly MethodStep[] = [
  { title: "Prevent", text: "Clear the small stuff before it turns into a fight.", Icon: Shield },
  { title: "Pause", text: "Stop a fight from getting bigger, in the moment.", Icon: PauseCircle },
  { title: "Repair", text: "Start making up in 10 minutes, not 3 days.", Icon: Heart },
];

// What's inside your plan, right under the hero. Given by the user on 2026-10-22. Each line starts with the
// part's name, set in bold, and reads on as one sentence.
export const inside = {
  title: "What’s inside your plan",
  items: [
    { lead: "Just had a fight?", text: "One tap gets you the words to calm it down and a guided 10 minute repair.", Icon: Heart },
    { lead: "Your couple pattern", text: "explains why your fights go the way they do, and what to do about it.", Icon: Pair },
    { lead: "One step a day", text: "takes two minutes, with a sentence you can use that same day.", Icon: Check },
    { lead: "The message check", text: "lets you check a text before you send it.", Icon: Sparkle, filled: true },
  ],
} as const;

// Loud fights or quiet ones. Approved 2026-10-22.
export const fightStyles = {
  title: "Loud fights or quiet ones",
  note: "One of you gets loud and the other goes quiet? Your plan covers that too.",
  cards: [
    {
      id: "loud",
      title: "When it gets loud",
      text: "You both talk faster, and nobody feels heard.",
      gets: [
        "A line to slow it down in the first minute",
        "A way to take a break without walking out",
        "Words to actually finish the fight after",
      ],
    },
    {
      id: "quiet",
      title: "When it goes quiet",
      text: "One of you shuts down, and the other feels shut out.",
      gets: [
        "A way to say you need a minute, and come back",
        "A gentle way to bring up small things early",
        "Words to make up, instead of just moving on",
      ],
    },
  ],
} as const;

export const gets = [
  { id: "plan", title: "Personal plan", text: "Prevent, Pause, Repair, built around your answers." },
  { id: "check", title: "Message check", text: "Check a text before you send it, so it says what you really mean." },
  { id: "scripts", title: "Scripts and cards", text: "The exact words to use, a weekly check in and a 10 minute repair." },
  { id: "invite", title: "Partner invite", text: "Invite your partner for free, so you both use the same plan." },
] as const;

/** Under the hero, where a new product can't show press or quotes yet. Each line is backed by lib/legal.ts. */
export const trust = [
  "Your partner joins free",
  "We don’t keep the messages you check",
  "Your partner never sees what you write on your own",
] as const;

export const faqs = [
  { q: "Is this therapy?", a: "No. It’s practical help for everyday arguments." },
  {
    q: "Why pay when advice is free?",
    a: "Free advice is general. Your plan is built around your answers, with the exact words to use.",
  },
  { q: "Can my partner join?", a: "Yes, for free. Invite them any time to use the same plan. It works on your own too." },
  {
    q: "What if it’s more than arguing?",
    a: (
      <>
        If you ever feel scared or unsafe, please reach out to the National Domestic Violence Hotline: call{" "}
        <a href={hotline.call}>1.800.799.7233</a>, text START to <a href={hotline.text}>88788</a>, or chat at{" "}
        <a href={hotline.chat} target="_blank" rel="noopener noreferrer">
          thehotline.org
        </a>
        . This plan isn’t made for that.
      </>
    ),
  },
] as const;
