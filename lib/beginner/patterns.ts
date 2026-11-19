import { toolLabels, type ChatTool } from "../week";
import type { Device } from "./quiz-copy";
import type { TaskKind } from "./recipes";

// The ten patterns (docs/DIRECTION.md, section 2, Phase 8). The final read names one or more patterns for each
// responsibility on her map; the code then picks the workflow and its level, never the model. Each pattern has
// one workflow Tally can set up with her at level 3, Build once, reuse: Tally writes the pieces, she copies them
// into apps she already has. Most of them put none of her work into an AI tool, so they need no company OK.
//
// None of these workflows points at checked steps yet. Phase 9 added the building block cards for Microsoft and
// Google (`blockCards` in cards.ts), and Phase 10 writes each workflow from her follow up answers using them. Until then a step is a plain goal, so the only condition
// that can hold a workflow back here is the device: a sheet, a form or a template is set up on a computer.
//
// Every offer name and piece below is a DRAFT until Karl approves it. Each piece names the thing in her own words
// (Karl, 2026-11-16), like "Your Friday lunch order form, written for you". Imports nothing from the server.

export const PATTERNS = {
  1: "Messages she repeats",
  2: "Documents she repeats",
  3: "Stock that runs low and gets reordered",
  4: "Orders prepared from a short count",
  5: "Events that repeat, run from a checklist",
  6: "Requests from colleagues, collected in one place",
  7: "Routines and reminders on a schedule",
  8: "An inbox that needs sorting and follow up",
  9: "Notes that become tables or reports",
  10: "Answers looked up in documents she already has",
} as const;
export type PatternId = keyof typeof PATTERNS;
export const PATTERN_IDS = Object.keys(PATTERNS).map(Number) as PatternId[];

/**
 * What each pattern means, with examples, for the final read's prompt. The Phase 8 runs showed the model putting
 * repairs under stock and quotes under the inbox with the names alone (2026-11-16).
 */
export const PATTERN_GUIDE: Record<PatternId, string> = {
  1: "the same few replies, texts or emails again and again, like answering the same questions, confirming times or asking for reviews",
  2: "the same kind of document each time with different details, like quotes, invoices, offer letters, listings or a newsletter",
  3: "physical things she keeps stocked, counted against usual amounts and reordered, like fridge drinks, office supplies or parts in a truck. Only for things, never for requests, repairs or people",
  4: "one order put together from what several people want, like lunch for the office or a headcount for an event",
  5: "something that happens again and again with the same steps, like company events, move ins, onboarding a new hire or a monthly walk through",
  6: "requests that reach her one by one from colleagues, tenants or customers, like repairs, leave requests or something missing, which they could enter themselves in one place",
  7: "jobs that come round on a schedule, like watering plants, rent reminders on the 1st or maintenance checks",
  8: "a busy inbox where she keeps track of who owes her an answer and chases them",
  9: "notes she takes that end up in a sheet, log or report, like inspection notes or a repair log",
  10: "questions she answers by looking things up in documents she has, like policies, a handbook or a price list",
};

/**
 * The pattern a checked recipe's kind of task belongs to, so a recipe and a pattern workflow can be weighed by how
 * well they fit her responsibility (lib/beginner/levels.ts).
 */
export const KIND_PATTERN: Record<TaskKind, PatternId> = {
  repeat_texts: 1,
  repeat_writing: 2,
  spoken_writing: 2,
  notes_to_table: 9,
  repeat_emails: 1,
  email_replies: 1,
  email_follow_ups: 8,
  awaiting_replies: 8,
};

/** A pattern number from the model, when it is one of the ten. */
export const patternOf = (value: unknown): PatternId | null =>
  typeof value === "number" && (PATTERN_IDS as number[]).includes(value) ? (value as PatternId) : null;

/**
 * Where a workflow is set up. `suite`: a sheet, a form or a template in Microsoft or Google apps, on a computer.
 * `email`: her email app on a computer. `email_or_phone`: saved emails in her email app on a computer, or saved
 * replies on her phone. `anywhere`: a checklist or reminders, on a phone or a computer. `chat_tool`: a saved
 * assistant in her chat tool, which the vendors give computer steps for only (checked 2026-11-15).
 */
export type Where = "suite" | "email" | "email_or_phone" | "anywhere" | "chat_tool";

/** What a piece's words need: her name for the thing, her chat tool, and where it is set up. */
export type PieceContext = {
  /** The thing in her own words, as it fits "Your ___ form", like "Friday lunch order". */
  thing: string;
  tool: ChatTool;
  /** Her email app by name, when the workflow is set up in her email. */
  emailApp: "Outlook" | "Gmail" | null;
  /** The workflow is set up on her phone. */
  onPhone: boolean;
};

export type PatternWorkflow = {
  id: `pattern_${PatternId}`;
  pattern: PatternId;
  level: 3;
  /** She puts her own work into an AI tool when she uses it, so a company that restricts AI holds it back. */
  usesAi: boolean;
  where: Where;
  /** How her offer ends the workflow's name, as in "Your lunch orders, collected and counted". DRAFT */
  offer: string;
  /** The pieces Tally builds for her, each with her name for the thing. DRAFT */
  pieces: (c: PieceContext) => string[];
  /** The With your path line when the model's breaks a rule: the direction, plainly, with nothing done for her. DRAFT */
  direction: string;
};

const workflow = (pattern: PatternId, w: Omit<PatternWorkflow, "id" | "pattern" | "level">): PatternWorkflow => ({
  id: `pattern_${pattern}`,
  pattern,
  level: 3,
  ...w,
});

export const PATTERN_WORKFLOWS: Record<PatternId, PatternWorkflow> = {
  1: workflow(1, {
    direction: "Your common messages saved once, ready to send.",
    usesAi: false,
    where: "email_or_phone",
    offer: "saved once, ready to send",
    pieces: ({ thing, emailApp, onPhone }) =>
      onPhone || !emailApp
        ? [`Your ${thing} replies, written for you and saved on your phone`]
        : [`Your ${thing} emails, written for you and saved in ${emailApp}`],
  }),
  2: workflow(2, {
    direction: "One template, with blanks for what changes.",
    usesAi: false,
    // A template with blanks works in a phone's notes as well as in a document.
    where: "anywhere",
    offer: "from one template",
    pieces: ({ thing }) => [`Your ${thing} template, with the blanks marked`],
  }),
  3: workflow(3, {
    direction: "One list with the usual amounts, ready whenever stock runs low.",
    usesAi: false,
    // A list with the usual amounts works in a phone's notes as well as in a sheet.
    where: "anywhere",
    offer: "counted against your usual amounts",
    pieces: ({ thing }) => [`Your ${thing} list, with the usual amounts`, `Your ${thing} order, ready to send`],
  }),
  4: workflow(4, {
    direction: "Orders collected in one place and counted for you.",
    usesAi: false,
    where: "suite",
    offer: "collected and counted",
    pieces: ({ thing }) => [
      `Your ${thing} form, written for you`,
      `Your ${thing} sheet, counted for you`,
      `Your ${thing} email, ready to send`,
    ],
  }),
  // A tracker, not a checklist (Karl, 2026-11-16): one row for each new hire, inspection or service call, each step
  // dated from its start day, with what is due showing. On a computer it is a sheet in Excel or Google Sheets: Tally
  // writes the columns and the formulas (each step's date is the start day plus its days, Next due is the earliest
  // date left in the row), and a highlight rule marks a date once it has come. Microsoft's and Google's help pages
  // give computer steps for all of it, and Google's give Android steps for the highlight; Google Sheets on an iPhone
  // can't make the rule (checked 2026-11-16), so Next due shows what is due without it. On a phone only, she gets the
  // same steps as a dated checklist in her notes, with a reminder for each due day.
  5: workflow(5, {
    direction: "One tracker, with each step dated from the start day.",
    usesAi: false,
    where: "anywhere",
    offer: "tracked from the start day",
    pieces: ({ thing, onPhone }) =>
      onPhone
        ? [`Your ${thing} checklist, each step with its day from the start`, `Your ${thing} reminders, one for each due day`]
        : [
            // "One row for each" needs a thing she can count: "vendor scheduling" gets "one row each time".
            /ing$/i.test(thing) ? `Your ${thing} tracker, one row each time` : `Your ${thing} tracker, one row for each ${thing}`,
            `Your ${thing} steps, each dated from the start day`,
            `Your ${thing} due dates, highlighted when they come round`,
          ],
  }),
  6: workflow(6, {
    direction: "Requests collected in one place.",
    usesAi: false,
    where: "suite",
    offer: "collected in one place",
    pieces: ({ thing }) => [`Your ${thing} form, written for you`, `Your ${thing} list, all in one place`],
  }),
  7: workflow(7, {
    direction: "A routine with how often each job comes round.",
    usesAi: false,
    where: "anywhere",
    offer: "on a schedule that reminds you",
    pieces: ({ thing }) => [`Your ${thing} routine, with how often each job comes round`, `Your ${thing} reminders, set to repeat`],
  }),
  8: workflow(8, {
    direction: "One list of who still owes you an answer, with follow ups ready.",
    usesAi: false,
    where: "email",
    offer: "with follow ups ready to send",
    pieces: ({ thing }) => [`Your ${thing} follow up emails, written for you`, `Your ${thing} waiting list, so nothing is forgotten`],
  }),
  9: workflow(9, {
    direction: "One sheet your notes go straight into.",
    usesAi: false,
    where: "suite",
    offer: "straight into one sheet",
    pieces: ({ thing }) => [`Your ${thing} sheet, with the columns set up`, `Your ${thing} form, so notes go straight in`],
  }),
  10: workflow(10, {
    direction: "Answers found in your own documents.",
    usesAi: true,
    where: "chat_tool",
    offer: "answered from your own documents",
    pieces: ({ thing, tool }) => [
      `Your ${thing} assistant in ${toolLabels[tool]}, set up with your own documents`,
      `Your ${thing} instructions, so it answers only from them`,
    ],
  }),
};

export const PATTERN_WORKFLOW_IDS = PATTERN_IDS.map((p) => PATTERN_WORKFLOWS[p].id);

/** A pattern workflow by its id, like "pattern_4". */
export const patternWorkflowById = (id: string): PatternWorkflow | undefined =>
  PATTERN_IDS.map((p) => PATTERN_WORKFLOWS[p]).find((w) => w.id === id);

/**
 * What the preview behind See it holds for her top row, by its first pattern: one piece Tally will build for her
 * (DIRECTION.md, section 3). The final read's prompt lists these.
 */
export const PREVIEW_GUIDE: Record<PatternId, string> = {
  1: "one of her saved replies or emails, ready to send",
  2: "her template, with blanks in square brackets for what changes",
  3: "her list of the items she named, each with [usual amount], and the order she sends",
  4: "the questions for her order form, each with its choices",
  5: "the first steps of her tracker, in order, each with the day it is due counted from the start day, like \"Welcome email, day 0\" or \"Check in, day 7\"",
  6: "the questions for her request form, each with its choices",
  7: "her routine, each job with how often it comes round",
  8: "her follow up email, ready to send",
  9: "the columns of her sheet, in order, with one example row of blanks",
  10: "the instructions for her assistant, saying it answers only from her documents",
};

/** Her email app, from where her work happens: Outlook before Gmail (DIRECTION.md, section 8). */
export function emailAppOf(places: readonly string[]): "Outlook" | "Gmail" | null {
  if (places.some((p) => /\boutlook\b/i.test(p))) return "Outlook";
  if (places.some((p) => /\bgmail\b/i.test(p))) return "Gmail";
  return null;
}

/**
 * Whether this workflow can be set up for her, and on which device: "phone" or "computer" when it can, "computer
 * needed" when only a computer could set it up and she has only a phone, and null when it has nothing to be set up
 * in, like inbox sorting for someone without an email app. A null device, on answers saved before everyone was
 * asked, counts as both.
 */
export function placeFor(w: PatternWorkflow, s: { device: Device | null; places: readonly string[] }): "phone" | "computer" | "needs_computer" | null {
  const computer = s.device !== "phone";
  const phone = s.device !== "computer";
  const email = emailAppOf(s.places) !== null;
  switch (w.where) {
    case "suite":
    case "chat_tool":
      return computer ? "computer" : "needs_computer";
    case "email":
      if (!email) return null;
      return computer ? "computer" : "needs_computer";
    case "email_or_phone":
      if (email && computer) return "computer";
      return phone ? "phone" : null;
    case "anywhere":
      return computer ? "computer" : "phone";
  }
}
