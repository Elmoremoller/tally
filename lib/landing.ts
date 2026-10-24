import type { ComponentType, SVGProps } from "react";
import { Check, Clock, Eye, Shield, Sparkle } from "@/components/icons";
import { dollars, offer } from "./offer";
import { openQuestions, policyQuestion, resultCopy } from "./questions";
import { AI_POLICIES, policyLabels } from "./week";

// The landing page's words. Word for word from the brief where it gives them; lines marked DRAFT fill a gap
// and wait for approval. The rules: no dashes, no colons in headlines, always a plan, AI is the how and never
// the headline, and no testimonials, ratings, customer counts or results until real buyers exist.

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/** The problem: moments she'll recognise, as a row of chips. The title is a DRAFT; the moments are the brief's. */
export const problem = {
  title: "Sound familiar?",
  moments: [
    "Always the one taking notes",
    "Planning the offsite",
    "Fixing everyone’s slides",
    "Working late on stuff nobody notices",
    "Saying yes to everything",
    "No time for the real job",
    "“Can you just run our socials?”",
    "Using ChatGPT in secret",
    "Everyone says use AI",
    "Nobody says what’s allowed",
  ],
} as const;

/**
 * Why it happens: three findings, each led by its figure, then the finding word for word and its source.
 * Never rounded, never ours: the figure is the finding's own number. The lead line was approved on 2026-10-24.
 */
export const why = {
  title: "Why it happens",
  lead: "It’s not you. Here’s what the research shows.",
  stats: [
    {
      figure: "200 hours",
      text: "In one study, women spent about 200 more hours a year than men on work that never got them promoted.",
      source: "The No Club",
    },
    {
      figure: "Almost 50%",
      text: "Women get asked to take on this work almost 50% more often.",
      source: "The No Club",
    },
    {
      figure: "13% vs 6%",
      text: "In a 2025 study, women who used AI were rated 13% less competent for identical work. Men, 6%.",
      source: "HBR, The Hidden Penalty of Using AI at Work",
    },
  ],
} as const;

export const steps = [
  "Tell us about your week in your own words.",
  "See how many hours go to work nobody notices.",
  "Get your plan to win them back and turn them into credit.",
] as const;

/** What each step looks like, drawn small above it. The words are the quiz's and the plan's own. */
export const stepSample = {
  question: openQuestions.week.title,
  answer: "Lots of meetings where I end up taking notes, chasing people for updates…",
  hours: "9 hours",
  resultLead: resultCopy.lead,
  resultLine: resultCopy.line,
};

/** What's in your plan: the five parts, each with a small copy of its screen. The lines are DRAFTS. */
export const planParts = {
  title: "What’s in your plan",
  parts: [
    { id: "audit", title: "Work audit", text: "Your tasks in three piles, with a polite script for each one that isn’t really yours." },
    { id: "hours", title: "Hours back", text: "The hours you win back each week, task by task, from your own numbers." },
    { id: "setup", title: "AI setup", text: "A ready to paste work profile for the AI tool you have, with safe use rules for your company’s policy." },
    { id: "handoff", title: "Busywork handoff", text: "A ready prompt for each task AI can draft for you." },
    { id: "visibility", title: "Visibility plan", text: "One project to put your time into, and a script for talking about your AI use with your manager." },
  ],
} as const;
export type PlanPartId = (typeof planParts.parts)[number]["id"];

/** Under the plan's five parts: the price, and the way in. The note was approved on 2026-10-24. */
export const priceRow = {
  price: dollars(offer.price.cents),
  note: "Paid once, after your free result. No subscription.",
};

/** Why this and not another AI course: the brief's one paragraph, as four cards. The wording is a DRAFT. */
export const whyThis = {
  title: "Why this and not another AI course",
  items: [
    { lead: "It’s not a course.", text: "It’s a plan built from your answers, done in about ten minutes.", Icon: Check as Icon },
    { lead: "Your role, your tools.", text: "Built around the work you do and the AI you have.", Icon: Sparkle as Icon, filled: true },
    { lead: "Your company’s AI rules.", text: "Your plan follows them, so you only do what’s allowed.", Icon: Shield as Icon },
    { lead: "Time and credit.", text: "Win back hours, then turn them into work people notice.", Icon: Eye as Icon },
  ],
} as const;

export const faqs = [
  { q: "Is this a course?", a: "No, it’s a personal plan built from your answers." },
  { q: "Is it a subscription?", a: `No. ${dollars(offer.price.cents)}, paid once.` },
  {
    q: "My company restricts AI. Does this still work?",
    a: "Yes. Your plan follows your company’s rules and focuses on what you’re allowed to do, plus handing work back and getting seen.",
  },
  { q: "Do I need to share confidential information?", a: "No. No need to name your company or colleagues." },
  {
    q: "Why not just ask ChatGPT?",
    a: "You’d need to know what to ask. This gives you a finished plan for your time and your credit in about ten minutes.",
  },
  { q: "Can I get a refund?", a: offer.refund },
] as const;

/**
 * The hero phone's sample, played on a loop: a quiz answer, her hours, then her plan. A DRAFT, for a
 * marketing coordinator whose company's view on AI is unclear.
 */
export const phoneSample = {
  question: policyQuestion.title,
  choices: AI_POLICIES.map((id) => policyLabels[id]),
  picked: policyLabels.unclear,
  hours: "9 hours",
  resultLead: "You spend about",
  resultLine: "a week on work nobody notices.",
  piles: ["Hand to AI", "Hand back", "Keep visible"],
  chips: ["ChatGPT", "9 hours back"],
  cards: [
    { title: "Work audit", text: "Three piles, and a script to hand back the slides.", Icon: Check as Icon },
    { title: "Hours back", text: "9 hours a week, from your own numbers.", Icon: Clock as Icon },
    { title: "AI setup", text: "A work profile for ChatGPT, ready to paste.", Icon: Sparkle as Icon },
  ],
  quick: ["Busywork handoff", "Visibility plan"],
  ask: "Prompt for your meeting notes",
} as const;
