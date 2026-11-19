import test from "node:test";
import assert from "node:assert/strict";
import {
  BLOCK_APPS,
  BLOCK_CARD_IDS,
  BLOCK_FEATURES,
  BLOCK_HELP,
  blockCardById,
  blockCards,
  blockCardsFor,
  CARD_IDS,
  CARD_SETUPS,
  CARD_TOOLS,
  cardById,
  setupCards,
} from "../../lib/beginner/cards";

const VENDOR_HELP = { chatgpt: "https://help.openai.com/", claude: "https://support.claude.com/" } as const;

test("there is one card for every tool and setup, each id once", () => {
  assert.equal(setupCards.length, CARD_TOOLS.length * CARD_SETUPS.length);
  assert.equal(new Set(CARD_IDS).size, CARD_IDS.length);
  for (const tool of CARD_TOOLS)
    for (const setup of CARD_SETUPS) {
      const card = cardById(`${tool}_${setup}`);
      assert.ok(card, `${tool}_${setup} exists`);
      assert.equal(card.tool, tool);
      assert.equal(card.setup, setup);
    }
});

test("an id that is not on the list finds no card", () => {
  assert.equal(cardById("gemini_project"), undefined);
  assert.equal(cardById(""), undefined);
});

test("every card has a title, steps, a free plan answer, a real check date and a vendor help page", () => {
  for (const card of setupCards) {
    assert.ok(card.title.trim(), `${card.id} has a title`);
    const steps = [...(card.steps.phone ?? []), ...(card.steps.computer ?? [])];
    assert.ok(steps.length >= 2, `${card.id} has steps`);
    assert.ok(steps.every((step) => step.trim()), `${card.id} has no empty step`);
    assert.equal(typeof card.freePlan.enough, "boolean");
    assert.match(card.checked, /^\d{4}-\d{2}-\d{2}$/);
    const checked = new Date(`${card.checked}T00:00:00Z`);
    assert.ok(!Number.isNaN(checked.getTime()), `${card.id} has a real date`);
    assert.ok(checked.getTime() <= Date.now(), `${card.id} was not checked in the future`);
    assert.ok(card.sources.length >= 1, `${card.id} names the page it was checked against`);
    for (const source of card.sources) assert.ok(source.startsWith(VENDOR_HELP[card.tool]), `${source} is the vendor's own help`);
  }
});

test("the get started card covers phone and computer", () => {
  for (const tool of CARD_TOOLS) {
    const card = cardById(`${tool}_get_started`);
    assert.ok(card?.steps.phone?.length, `${tool} has phone steps`);
    assert.ok(card?.steps.computer?.length, `${tool} has computer steps`);
  }
});

test("card copy follows the copy rules", () => {
  for (const card of setupCards) {
    const lines = [card.title, card.freePlan.note ?? "", ...(card.steps.phone ?? []), ...(card.steps.computer ?? [])];
    for (const line of lines) {
      assert.doesNotMatch(line, /[‒-―]|\s-\s|\w-\w/, `no dashes or hyphens in "${line}"`);
      assert.doesNotMatch(line, /\p{Extended_Pictographic}/u, `no emoji in "${line}"`);
      assert.doesNotMatch(line, /[[\]]/, `no square brackets in "${line}"`);
    }
    assert.doesNotMatch(card.title, /:/, `no colon in the title "${card.title}"`);
  }
});

// Building block cards (Phase 9)

/** Vendor labels quoted exactly, which may hold a hyphen the copy rules would otherwise catch. */
const VENDOR_LABELS = ["In-cell dropdown"];

const blockLines = (card: (typeof blockCards)[number]) => [
  card.title,
  card.note ?? "",
  card.freePlan.note ?? "",
  card.region ?? "",
  ...(card.steps.computer ?? []),
  ...(card.steps.android ?? []),
  ...(card.steps.iphone ?? []),
];

test("every building block card is on the id list once, and every id has a card", () => {
  assert.equal(blockCards.length, BLOCK_CARD_IDS.length);
  assert.equal(new Set(blockCards.map((c) => c.id)).size, blockCards.length);
  for (const id of BLOCK_CARD_IDS) assert.equal(blockCardById(id)?.id, id);
  assert.equal(blockCardById("excel_highlight_row"), undefined, "left out until Microsoft's pages show it");
  assert.equal(blockCardById(""), undefined);
});

test("building block ids never clash with the setup cards", () => {
  for (const id of BLOCK_CARD_IDS) assert.equal(cardById(id), undefined);
});

test("every building block card has steps, a free plan answer, a real check date and the vendor's own help page", () => {
  for (const card of blockCards) {
    assert.ok(BLOCK_APPS.includes(card.app), `${card.id} names a known app`);
    assert.ok(BLOCK_FEATURES.includes(card.feature), `${card.id} names a known feature`);
    assert.ok(card.title.trim(), `${card.id} has a title`);
    assert.ok((card.steps.computer?.length ?? 0) >= 2, `${card.id} has computer steps`);
    for (const device of ["android", "iphone"] as const) {
      const steps = card.steps[device];
      if (steps) assert.ok(steps.length >= 2, `${card.id} has ${device} steps, or none`);
    }
    assert.ok(blockLines(card).every((line, i) => i < 4 || line.trim()), `${card.id} has no empty step`);
    assert.equal(typeof card.freePlan.enough, "boolean");
    assert.match(card.checked, /^\d{4}-\d{2}-\d{2}$/);
    const checked = new Date(`${card.checked}T00:00:00Z`);
    assert.ok(!Number.isNaN(checked.getTime()), `${card.id} has a real date`);
    assert.ok(checked.getTime() <= Date.now(), `${card.id} was not checked in the future`);
    assert.ok(card.sources.length >= 1, `${card.id} names the page it was checked against`);
    const help: readonly string[] = card.app.startsWith("google") || card.app === "gmail" ? BLOCK_HELP.google : BLOCK_HELP.microsoft;
    for (const source of card.sources) assert.ok(help.some((h) => source.startsWith(h)), `${source} is the vendor's own help for ${card.id}`);
  }
});

test("Microsoft comes before Google for every feature both have", () => {
  for (const feature of BLOCK_FEATURES) {
    const apps = blockCardsFor(feature).map((c) => c.app);
    const firstGoogle = apps.findIndex((a) => a.startsWith("google") || a === "gmail");
    if (firstGoogle > 0) assert.ok(apps.slice(firstGoogle).every((a) => a.startsWith("google") || a === "gmail"), feature);
  }
});

test("the tracker shows what is due on an iPhone, where Google Sheets can't make a highlight rule", () => {
  const nextDue = blockCardById("sheets_next_due");
  assert.ok(nextDue?.steps.iphone?.some((s) => s.includes("TODAY()") && s.includes('"Due"')), "the Due column formula has iPhone steps");
  for (const id of ["sheets_dropdown", "sheets_highlight_row", "sheets_due_highlight"] as const) {
    assert.equal(blockCardById(id)?.steps.iphone, undefined, `${id} has no iPhone steps`);
    assert.match(blockCardById(id)?.note ?? "", /iPhone/, `${id} says what happens on an iPhone`);
  }
  // Excel on an iPhone can't add a highlight or a drop down list either (Microsoft, Excel for iPhone features).
  for (const id of ["excel_dropdown", "excel_due_highlight"] as const) assert.match(blockCardById(id)?.note ?? "", /iPhone/);
});

test("the tracker covers each of its parts in Excel and in Google Sheets", () => {
  for (const feature of ["days_after", "next_due", "due_highlight"] as const) {
    const apps = blockCardsFor(feature).map((c) => c.app);
    assert.ok(apps.includes("excel"), `${feature} in Excel`);
    assert.ok(apps.includes("google_sheets"), `${feature} in Google Sheets`);
  }
});

test("building block copy follows the copy rules", () => {
  for (const card of blockCards) {
    for (const raw of blockLines(card)) {
      const line = VENDOR_LABELS.reduce((l, label) => l.replaceAll(label, ""), raw);
      assert.doesNotMatch(line, /[‒-―]|\s-\s|[A-Za-z]-[A-Za-z]/, `no dashes or hyphens in "${raw}"`);
      assert.doesNotMatch(line, /\p{Extended_Pictographic}/u, `no emoji in "${raw}"`);
      assert.doesNotMatch(line, /[[\]]/, `no square brackets in "${raw}"`);
      assert.doesNotMatch(line, /\bnot checked\b/i, `nothing marked not checked in "${raw}"`);
    }
    assert.doesNotMatch(card.title, /:/, `no colon in the title "${card.title}"`);
  }
});

/** The formulas in a card's steps, from the equals sign on. */
const formulasIn = (card: (typeof blockCards)[number]) =>
  [...(card.steps.computer ?? []), ...(card.steps.android ?? []), ...(card.steps.iphone ?? [])].flatMap((step) => step.match(/=[A-Z$][^ ]*/g) ?? []);

test("every Excel card with a comma in a formula says what to do with a semicolon region", () => {
  for (const card of blockCards.filter((c) => c.app === "excel")) {
    if (formulasIn(card).some((f) => f.includes(","))) assert.match(card.region ?? "", /semicolon/, `${card.id} has the region note`);
  }
  assert.ok(blockCards.some((c) => c.region), "at least one card has a region note");
});

test("the Excel drop down list takes its choices from cells, so no separator is needed", () => {
  const steps = blockCardById("excel_dropdown")?.steps.computer?.join(" ") ?? "";
  assert.doesNotMatch(steps, /comma/i);
  assert.match(steps, /one in each cell/);
});

test("both form apps have a card for clearing last week's answers", () => {
  const apps = blockCardsFor("form_clear").map((c) => c.app);
  assert.deepEqual(apps, ["microsoft_forms", "google_forms"]);
});

test("counting Forms answers in Excel never adds a formula to the form's own workbook", () => {
  assert.match(blockCardById("ms_forms_to_excel")?.note ?? "", /Download a copy/);
  assert.match(blockCardById("excel_count_each")?.note ?? "", /downloaded copy/);
});
