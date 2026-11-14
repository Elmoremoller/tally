import test from "node:test";
import assert from "node:assert/strict";
import { CARD_IDS, CARD_SETUPS, CARD_TOOLS, cardById, setupCards } from "../../lib/beginner/cards";

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
