import type { ComponentType, SVGProps } from "react";
import { Check, Clock, Sparkle } from "@/components/icons";
import { offer } from "./offer";
import { openQuestions, policyQuestion, resultCopy } from "./questions";
import { AI_POLICIES, policyLabels } from "./week";

// The landing page's words. Word for word from the brief where it gives them; lines marked DRAFT fill a gap
// and wait for approval. The rules: no dashes, no colons in headlines, always a plan, AI is the how and never
// the headline, and no testimonials, ratings, customer counts or results until real buyers exist (real reviews go
// in lib/testimonials.ts).

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * The problem: the brief's ten moments told as one day of hers. Asks land one after another until 7:48 in the
 * evening, when the project she was hired for is still overdue; the two lines beside them say the rest. Each
 * ask's comment names the moments it carries. The title, the asks and the lines were approved on 2026-10-24.
 * `phone: false` hides an ask on phones only (under 735px), where every ask wraps and six made the section
 * nearly two screens tall; tablets and desktop show all six.
 */
export const problem = {
  title: "Sound familiar?",
  // Saying yes to everything / Working late on stuff nobody notices, No time for the real job, Using ChatGPT in secret
  lines: ["Every ask is small, so you say yes.", "Your own work waits until everyone’s gone home, with ChatGPT open in a tab nobody sees."],
  clock: { day: "Thursday", time: "7:48" },
  asks: [
    // Always the one taking notes
    { app: "chat", from: "Your manager", time: "9:02 AM", text: "Can you take notes in the 2pm? You’re so good at it." },
    // Fixing everyone's slides
    { app: "chat", from: "Coworker", time: "10:41 AM", text: "Jess is out today. Could you finish her slides before 4?", phone: false },
    // Planning the party
    { app: "mail", from: "HR", time: "12:15 PM", text: "Would you plan the holiday party again this year?" },
    // Showing the new hire the ropes
    { app: "chat", from: "Director", time: "2:30 PM", text: "New hire starts Monday. Can you show her the ropes?", phone: false },
    // Everyone says use AI / Nobody says what's allowed
    { app: "calendar", from: "All hands", time: "4:00 PM", text: "Everyone should be using AI by now. Guidelines to follow." },
    // No time for the real job
    { app: "reminder", from: "Reminders", time: "Overdue", text: "Start the project you were hired for." },
  ],
} as const;

/**
 * Running on empty: what the asks do to her, as three feelings, each with what Tally does about it. No figures
 * and no studies (the user's call on 2026-10-24: she cares about herself and the outcome, not the data). Every
 * outcome is a real part of the plan, hours, scripts or visibility, and none promises a result for her health.
 * DRAFT until the user has seen it on the page.
 */
export const why = {
  title: "Running on empty",
  lead: "Burnout doesn’t arrive all at once. It builds from a hundred small asks.",
  cards: [
    {
      feeling: "Overworked",
      text: "Full days, and still your own work is waiting when everyone else logs off.",
      outcome: "Hours back every week, from your own numbers.",
    },
    {
      feeling: "Stressed",
      text: "Always one ask away from the next one, with a head that won’t switch off at night.",
      outcome: "Polite scripts to hand work back, without the awkward talk.",
    },
    {
      feeling: "Burnt out",
      text: "Tired in a way a weekend doesn’t fix, while no one sees how much you carry.",
      outcome: "A plan that gets your work seen, so you can close the laptop at 5.",
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

export const faqs = [
  { q: "Is this a course?", a: "No, it’s a personal plan built from your answers." },
  // The landing page never shows the price; the paywall does, after the free result.
  { q: "Is it a subscription?", a: "No. Paid once." },
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
