import type { Device } from "./quiz-copy";
import type { PatternId } from "./patterns";

// The follow up questions after she pays (docs/DIRECTION.md, section 2 and Phase 10): before each workflow is
// written, three or four taps about how she does that one thing today, and a box for one real example. Each pattern
// has its own fixed questions. A choice marked `solved` means an app already does the job: the path says so and lets
// her pick another part of her week, with no AI call. Pure, so the page, the server and the tests share it.
//
// Two questions are added only when her quiz left them open: Microsoft or Google, for a workflow built from a form or
// a sheet when she named neither, and which phone she has, when she works on a phone only, so every step is one her
// phone can do (Karl's rule 3, 2026-11-16). Every title, hint and choice below is a DRAFT until Karl approves it.

export type FollowChoice = { id: string; label: string; solved?: true };
export type FollowQuestion = {
  id: string;
  title: string;
  hint?: string;
  kind: "one" | "many";
  choices: FollowChoice[];
};
export type FollowSet = { questions: FollowQuestion[]; example: { label: string; hint: string } };
/** What she tapped on one question, and her example under the id "example". */
export type FollowAnswer = { id: string; picked: string[]; text: string | null };

/** The example box, at most this long, so one real example fits and the prompt stays small. */
export const EXAMPLE_MAX = 1500;

const solved = (label: string): FollowChoice => ({ id: "solved", label, solved: true });
const c = (id: string, label: string): FollowChoice => ({ id, label });

/** Each pattern's own questions. DRAFT */
export const FOLLOW_UPS: Record<PatternId, FollowSet> = {
  1: {
    questions: [
      {
        id: "channel",
        title: "Where do these messages go out?",
        kind: "one",
        choices: [c("email", "Email"), c("texts", "Text messages"), c("chat", "A chat app, like Teams or WhatsApp"), solved("An app already sends them for me")],
      },
      {
        id: "how_many",
        title: "How many different messages do you send again and again?",
        kind: "one",
        choices: [c("few", "2 or 3"), c("five", "About 5"), c("more", "More than 5")],
      },
      {
        id: "changes",
        title: "What changes from one to the next?",
        hint: "Tick all that fit.",
        kind: "many",
        choices: [c("name", "A name"), c("time", "A date or time"), c("amount", "A price or amount"), c("place", "An address or place"), c("most", "Almost everything")],
      },
    ],
    example: { label: "Paste one message you sent", hint: "Take out names and private details. Optional." },
  },
  2: {
    questions: [
      {
        id: "doc",
        title: "What is the document?",
        kind: "one",
        choices: [c("quote", "A quote or invoice"), c("letter", "A letter or email"), c("listing", "A listing or post"), c("report", "A report or newsletter"), solved("An app already makes it for me")],
      },
      {
        id: "where",
        title: "Where do you write it today?",
        kind: "one",
        choices: [c("word", "Word"), c("docs", "Google Docs"), c("email", "In an email"), c("notes", "Notes on my phone"), c("paper", "On paper")],
      },
      {
        id: "changes",
        title: "What changes each time?",
        hint: "Tick all that fit.",
        kind: "many",
        choices: [c("names", "Names"), c("dates", "Dates"), c("amounts", "Prices or amounts"), c("paragraphs", "Whole paragraphs")],
      },
    ],
    example: { label: "Paste the last one you wrote", hint: "Take out names and private details. Optional." },
  },
  3: {
    questions: [
      {
        id: "low",
        title: "How do you know something is running low today?",
        kind: "one",
        choices: [c("look", "I look and count"), c("told", "People tell me"), c("list", "I keep a list"), solved("An app already tracks it for me")],
      },
      {
        id: "items",
        title: "How many items do you keep stocked?",
        kind: "one",
        choices: [c("few", "Under 10"), c("some", "10 to 30"), c("many", "More than 30")],
      },
      {
        id: "reorder",
        title: "How do you reorder?",
        kind: "one",
        choices: [c("email", "By email to a supplier"), c("site", "On a website or app"), c("phone", "By phone"), c("shop", "I go to a shop")],
      },
      {
        id: "often",
        title: "How often do you check?",
        kind: "one",
        choices: [c("daily", "Every day"), c("weekly", "Every week"), c("asked", "When someone says")],
      },
    ],
    example: { label: "Paste your usual list", hint: "The items you keep, with amounts if you know them. Optional." },
  },
  // Karl's rule 4 (2026-11-16): the results page counts each question on its own, so an order form asks whether
  // the order depends on two things, and then offers combined choices like "Pasta, vegetarian".
  4: {
    questions: [
      {
        id: "reach",
        title: "How do orders reach you today?",
        hint: "Tick all that fit.",
        kind: "many",
        choices: [c("email", "Email"), c("paper", "Paper"), c("person", "In person"), c("chat", "Teams or another chat"), solved("A form already collects them")],
      },
      {
        id: "combined",
        title: "Does each order depend on two things, like dish and diet?",
        hint: "Your form counts each question on its own. With two things, one question offers both together, like Pasta, vegetarian.",
        kind: "one",
        choices: [c("yes", "Yes, like dish and diet"), c("no", "No, one choice is enough"), c("unsure", "Not sure")],
      },
      {
        id: "place",
        title: "How do you place the order?",
        kind: "one",
        choices: [c("email", "By email"), c("site", "On a website or app"), c("phone", "By phone")],
      },
      {
        id: "often",
        title: "How often do you order?",
        kind: "one",
        choices: [c("weekly", "Every week"), c("daily", "Every day"), c("sometimes", "Now and then")],
      },
    ],
    example: { label: "Paste the menu or last order", hint: "Dishes and choices help Tally write your form. Optional." },
  },
  5: {
    questions: [
      {
        id: "start",
        title: "What starts it each time?",
        kind: "one",
        choices: [c("start_day", "A start day, like a new hire's first day"), c("date", "A date in the calendar"), c("request", "Someone asks for it"), solved("An app already runs it for me")],
      },
      {
        id: "steps",
        title: "About how many steps are there?",
        kind: "one",
        choices: [c("few", "Under 5"), c("some", "5 to 10"), c("many", "More than 10")],
      },
      {
        id: "together",
        title: "How many run at the same time?",
        kind: "one",
        choices: [c("one", "Usually one"), c("few", "2 to 5"), c("many", "More than 5")],
      },
      {
        id: "kept",
        title: "Where do you keep the steps today?",
        kind: "one",
        choices: [c("head", "In my head"), c("paper", "A checklist on paper"), c("sheet", "A sheet"), c("emails", "In old emails")],
      },
    ],
    example: { label: "Paste your steps", hint: "In any order, as you remember them. Optional." },
  },
  6: {
    questions: [
      {
        id: "reach",
        title: "How do requests reach you today?",
        hint: "Tick all that fit.",
        kind: "many",
        choices: [c("email", "Email"), c("texts", "Text messages"), c("chat", "Teams or another chat"), c("person", "In person"), solved("An app already collects them")],
      },
      {
        id: "need",
        title: "What do you need to know for each one?",
        hint: "Tick all that fit.",
        kind: "many",
        choices: [c("who", "Who it is from"), c("where", "Where it is"), c("what", "What it is about"), c("urgent", "How urgent it is"), c("when", "When it is needed")],
      },
      {
        id: "after",
        title: "What happens after one comes in?",
        kind: "one",
        choices: [c("self", "I sort it out myself"), c("pass", "I pass it to someone"), c("book", "I book someone to come")],
      },
      {
        id: "volume",
        title: "About how many a week?",
        kind: "one",
        choices: [c("few", "Under 5"), c("some", "5 to 20"), c("many", "More than 20")],
      },
    ],
    example: { label: "Paste one request you got", hint: "Take out names and private details. Optional." },
  },
  7: {
    questions: [
      {
        id: "often",
        title: "How often do these jobs come round?",
        hint: "Tick all that fit.",
        kind: "many",
        choices: [c("daily", "Every day"), c("weekly", "Every week"), c("monthly", "Every month"), c("seasonal", "Every few months")],
      },
      {
        id: "remember",
        title: "How do you remember them today?",
        kind: "one",
        choices: [c("head", "In my head"), c("paper", "A list on paper"), c("phone", "Reminders on my phone"), solved("An app already reminds me")],
      },
      {
        id: "calendar",
        title: "Which calendar do you use most?",
        kind: "one",
        choices: [c("outlook", "Outlook"), c("google", "Google Calendar"), c("phone", "My phone's own calendar"), c("none", "None")],
      },
    ],
    example: { label: "List the jobs", hint: "One per line, with how often if you know. Optional." },
  },
  8: {
    questions: [
      {
        id: "who",
        title: "Who owes you answers most often?",
        kind: "one",
        choices: [c("customers", "Customers or clients"), c("colleagues", "Colleagues"), c("suppliers", "Suppliers"), c("tenants", "Tenants or members")],
      },
      {
        id: "track",
        title: "How do you keep track today?",
        kind: "one",
        choices: [c("head", "In my head"), c("flags", "Flags or stars in my email"), c("list", "A list"), solved("An app already does it for me")],
      },
      {
        id: "wait",
        title: "How long do you wait before you follow up?",
        kind: "one",
        choices: [c("days", "A day or two"), c("week", "About a week"), c("longer", "Longer")],
      },
    ],
    example: { label: "Paste a follow up you sent", hint: "Take out names and private details. Optional." },
  },
  9: {
    questions: [
      {
        id: "notes",
        title: "Where do you take the notes?",
        kind: "one",
        choices: [c("paper", "On paper"), c("phone", "Notes on my phone"), c("photos", "Photos"), solved("An app already keeps them for me")],
      },
      {
        id: "end",
        title: "Where should they end up?",
        kind: "one",
        choices: [c("sheet", "In a sheet"), c("report", "In a report"), c("email", "In an email to someone")],
      },
      {
        id: "fields",
        title: "What goes in each note?",
        hint: "Tick all that fit.",
        kind: "many",
        choices: [c("date", "The date"), c("place", "The place or unit"), c("found", "What you found"), c("todo", "What needs doing"), c("who", "Who did it")],
      },
      {
        id: "often",
        title: "How often do you take them?",
        kind: "one",
        choices: [c("daily", "Every day"), c("weekly", "Every week"), c("monthly", "Every month")],
      },
    ],
    example: { label: "Paste one set of notes", hint: "As you wrote them. Take out names. Optional." },
  },
  10: {
    questions: [
      {
        id: "docs",
        title: "What kind of documents hold the answers?",
        hint: "Tick all that fit.",
        kind: "many",
        choices: [c("handbook", "A handbook or policies"), c("prices", "A price list"), c("products", "Product details"), c("contracts", "Contracts"), c("emails", "Old emails")],
      },
      {
        id: "asks",
        title: "Who asks the questions?",
        kind: "one",
        choices: [c("colleagues", "Colleagues"), c("customers", "Customers"), c("me", "Mostly I look things up myself")],
      },
      {
        id: "private",
        title: "Do those documents hold private details about people?",
        kind: "one",
        choices: [c("no", "No"), c("yes", "Yes"), c("unsure", "Not sure")],
      },
    ],
    example: { label: "Paste a question you get", hint: "Take out names. Optional." },
  },
};

/** Asked when her quiz named no Microsoft or Google app and the workflow is built from a form or a sheet. DRAFT */
export const SUITE_QUESTION: FollowQuestion = {
  id: "suite",
  title: "Which do you have at work?",
  kind: "one",
  choices: [c("microsoft", "Microsoft, like Outlook and Excel"), c("google", "Google, like Gmail and Sheets"), c("neither", "Neither")],
};

/** Asked when she works on a phone only, so she sees only the steps her phone can do. DRAFT */
export const PHONE_QUESTION: FollowQuestion = {
  id: "phone",
  title: "Which phone do you have?",
  kind: "one",
  choices: [c("iphone", "iPhone"), c("samsung", "Samsung"), c("android", "Another Android phone")],
};

/** Patterns whose workflow is built from a form or a sheet, so Microsoft or Google matters. */
const SUITE_PATTERNS: ReadonlySet<PatternId> = new Set([3, 4, 5, 6, 9]);

/** Her quiz named a Microsoft or a Google app. */
export const namesSuite = (places: readonly string[]) =>
  places.some((p) => /\b(outlook|excel|teams|microsoft|word|onedrive|sharepoint|gmail|google|sheets)\b/i.test(p));

/** Every question she sees for one workflow, in order: the pattern's own, then the ones her quiz left open. */
export function followUpsFor(pattern: PatternId, her: { device: Device | null; places: readonly string[] }): FollowSet {
  const set = FOLLOW_UPS[pattern];
  const extra: FollowQuestion[] = [];
  if (SUITE_PATTERNS.has(pattern) && !namesSuite(her.places)) extra.push(SUITE_QUESTION);
  if (her.device === "phone") extra.push(PHONE_QUESTION);
  return { questions: [...set.questions, ...extra], example: set.example };
}

/** The choice she tapped on one question, or null. */
export const pickedOn = (answers: readonly FollowAnswer[], id: string): string[] => answers.find((a) => a.id === id)?.picked ?? [];

/** She tapped a choice that says an app already does the job. */
export function isSolved(pattern: PatternId, answers: readonly FollowAnswer[]): boolean {
  return FOLLOW_UPS[pattern].questions.some((q) => q.choices.some((ch) => ch.solved && pickedOn(answers, q.id).includes(ch.id)));
}

/**
 * Her answers, kept only where they match a question she was shown: known choice ids, one pick on a one question,
 * and her example cut to EXAMPLE_MAX. Null when a question she must answer is missing.
 */
export function cleanFollowUps(set: FollowSet, raw: unknown): FollowAnswer[] | null {
  const given = Array.isArray(raw) ? (raw as Record<string, unknown>[]) : [];
  const out: FollowAnswer[] = [];
  for (const q of set.questions) {
    const a = given.find((g) => g?.id === q.id);
    const ids = new Set(q.choices.map((ch) => ch.id));
    const picked = (Array.isArray(a?.picked) ? a.picked : []).filter((p): p is string => typeof p === "string" && ids.has(p));
    const unique = [...new Set(picked)];
    if (!unique.length || (q.kind === "one" && unique.length !== 1)) return null;
    out.push({ id: q.id, picked: unique, text: null });
  }
  const example = given.find((g) => g?.id === "example");
  const text = typeof example?.text === "string" ? example.text.replace(/\s+\n/g, "\n").trim().slice(0, EXAMPLE_MAX) : "";
  if (text) out.push({ id: "example", picked: [], text });
  return out;
}

/** Her answers as lines for the prompt, each question with the labels she tapped. */
export function answerLines(set: FollowSet, answers: readonly FollowAnswer[]): string[] {
  return set.questions.map((q) => {
    const labels = pickedOn(answers, q.id)
      .map((id) => q.choices.find((ch) => ch.id === id)?.label)
      .filter(Boolean);
    return `${q.title} ${labels.length ? labels.join(", ") : "Not answered"}`;
  });
}
