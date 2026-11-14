import test from "node:test";
import assert from "node:assert/strict";
import { CARD_IDS, cardById } from "../../lib/beginner/cards";
import {
  LEVELS,
  RECIPE_APPS,
  RECIPE_IDS,
  TASK_KINDS,
  isCardId,
  recipeById,
  recipeCards,
  recipes,
  taskKindMeaning,
  type Recipe,
} from "../../lib/beginner/recipes";

/** The vendors' own help pages. A recipe step is only as good as the page it was checked against. */
const VENDOR_HELP = [
  "https://help.openai.com/",
  "https://support.claude.com/",
  "https://support.google.com/",
  "https://support.apple.com/",
];

const stepsOf = (recipe: Recipe) =>
  recipe.routes.flatMap((route) => [...(route.steps.phone ?? []), ...(route.steps.computer ?? [])]);

/** Every line of copy a recipe shows her. */
const copyOf = (recipe: Recipe) => [
  recipe.title,
  recipe.approval,
  recipe.cost.note,
  recipe.test.tryOn,
  recipe.test.good,
  ...recipe.test.fixes,
  ...recipe.material,
  ...recipe.routes.map((route) => route.note ?? ""),
  ...stepsOf(recipe).filter((step): step is string => typeof step === "string"),
];

test("there are at least six recipes, each id once", () => {
  assert.ok(recipes.length >= 6, `${recipes.length} recipes`);
  assert.equal(new Set(RECIPE_IDS).size, RECIPE_IDS.length);
  for (const id of RECIPE_IDS) assert.match(id, /^[a-z0-9_]+$/, `${id} is a plain id`);
});

test("the recipes cover levels 3, 4 and 5", () => {
  for (const level of [3, 4, 5] as const)
    assert.ok(
      recipes.some((recipe) => recipe.level === level),
      `a recipe at level ${level}, ${LEVELS[level]}`,
    );
});

test("an id that is not on the list finds no recipe", () => {
  assert.equal(recipeById("gmail_auto_send"), undefined);
  assert.equal(recipeById(""), undefined);
  for (const id of RECIPE_IDS) assert.equal(recipeById(id)?.id, id);
});

test("every recipe is for a known kind of task, and every kind has a meaning and a recipe", () => {
  for (const recipe of recipes) assert.ok(TASK_KINDS.includes(recipe.kind), `${recipe.id} has a known kind`);
  for (const kind of TASK_KINDS) {
    assert.ok(taskKindMeaning[kind].trim(), `${kind} has a meaning`);
    assert.ok(
      recipes.some((recipe) => recipe.kind === kind),
      `${kind} has a recipe`,
    );
  }
});

test("every recipe has its conditions, an approval point, a cost line, a test and material", () => {
  for (const recipe of recipes) {
    const { needsAiAllowed, connectsApp, taskContent } = recipe.conditions;
    assert.equal(typeof needsAiAllowed, "boolean", `${recipe.id} says whether AI must be allowed`);
    assert.equal(typeof connectsApp, "boolean", `${recipe.id} says whether it connects an app`);
    assert.ok(["none", "in_app", "chat_tool"].includes(taskContent), `${recipe.id} says where her content goes`);
    assert.ok(recipe.approval.trim(), `${recipe.id} has an approval point`);
    assert.ok(recipe.cost.note.trim(), `${recipe.id} has a cost line`);
    assert.ok([true, false, null].includes(recipe.cost.freePlanEnough), `${recipe.id} answers the free plan question`);
    assert.ok(recipe.test.tryOn.trim() && recipe.test.good.trim(), `${recipe.id} has a test`);
    assert.equal(recipe.test.fixes.length, 3, `${recipe.id} has three lines to send when it is off`);
    assert.ok(recipe.test.fixes.every((line) => line.trim()), `${recipe.id} has no empty fix line`);
    assert.ok(recipe.material.length >= 1, `${recipe.id} names what Tally writes`);
  }
});

test("a recipe that reaches into her apps needs her to control them or be allowed, and AI to be allowed", () => {
  for (const recipe of recipes) {
    if (recipe.level >= 4) assert.ok(recipe.conditions.connectsApp, `${recipe.id} works inside her apps`);
    if (recipe.conditions.connectsApp) assert.ok(recipe.conditions.needsAiAllowed, `${recipe.id} needs AI allowed`);
    if (recipe.conditions.taskContent !== "none")
      assert.ok(recipe.conditions.needsAiAllowed, `${recipe.id} sends her work to AI, so AI must be allowed`);
  }
});

test("every recipe has a route with steps, and every route names known apps", () => {
  for (const recipe of recipes) {
    assert.ok(recipe.routes.length >= 1, `${recipe.id} has a route`);
    for (const route of recipe.routes) {
      assert.ok(route.apps.length >= 1, `${recipe.id} has a route with apps`);
      for (const app of route.apps) assert.ok(RECIPE_APPS.includes(app), `${app} is a known app`);
      const steps = [...(route.steps.phone ?? []), ...(route.steps.computer ?? [])];
      assert.ok(steps.length >= 2, `${recipe.id} has steps on its ${route.apps.join(" and ")} route`);
      for (const step of steps) if (typeof step === "string") assert.ok(step.trim(), `${recipe.id} has no empty step`);
    }
  }
});

test("every card a recipe points to exists, and fits the route's chat tool", () => {
  for (const recipe of recipes)
    for (const route of recipe.routes)
      for (const step of [...(route.steps.phone ?? []), ...(route.steps.computer ?? [])]) {
        if (typeof step === "string") continue;
        const card = cardById(step.card);
        assert.ok(card, `${recipe.id} points to ${step.card}, which exists`);
        assert.ok(route.apps.includes(card.tool), `${step.card} is on a ${card.tool} route`);
      }
  assert.ok(recipes.some((recipe) => recipeCards(recipe).length > 0), "the cards are used as building blocks");
  assert.ok(CARD_IDS.every(isCardId));
  assert.equal(isCardId("gemini_project"), false);
});

test("every recipe has a real check date and only vendor help pages as sources", () => {
  for (const recipe of recipes) {
    assert.match(recipe.checked, /^\d{4}-\d{2}-\d{2}$/);
    const checked = new Date(`${recipe.checked}T00:00:00Z`);
    assert.ok(!Number.isNaN(checked.getTime()), `${recipe.id} has a real date`);
    assert.ok(checked.getTime() <= Date.now(), `${recipe.id} was not checked in the future`);
    assert.ok(recipe.sources.length >= 1, `${recipe.id} names the pages it was checked against`);
    assert.equal(new Set(recipe.sources).size, recipe.sources.length, `${recipe.id} lists each page once`);
    for (const source of recipe.sources)
      assert.ok(
        VENDOR_HELP.some((help) => source.startsWith(help)),
        `${source} is a vendor's own help page`,
      );
  }
});

test("a route for a chat tool is checked against that vendor's pages", () => {
  const help = { chatgpt: "https://help.openai.com/", claude: "https://support.claude.com/" } as const;
  for (const recipe of recipes)
    for (const route of recipe.routes)
      for (const tool of ["chatgpt", "claude"] as const)
        if (route.apps.includes(tool))
          assert.ok(
            recipe.sources.some((source) => source.startsWith(help[tool])),
            `${recipe.id} has a ${tool} route and a ${tool} source`,
          );
});

test("nothing in a recipe sends for her without her OK", () => {
  for (const recipe of recipes) {
    assert.match(recipe.approval, /\b(you|your)\b/i, `${recipe.id} says what she checks`);
    for (const line of copyOf(recipe))
      assert.doesNotMatch(line, /send(s)? (it )?(automatically|by itself|on its own)|auto ?reply/i, `"${line}" never sends alone`);
  }
});

test("recipe copy follows the copy rules", () => {
  for (const recipe of recipes) {
    for (const line of copyOf(recipe)) {
      assert.doesNotMatch(line, /[‒-―]|\s-\s|\w-\w/, `no dashes or hyphens in "${line}"`);
      assert.doesNotMatch(line, /\p{Extended_Pictographic}/u, `no emoji in "${line}"`);
      assert.doesNotMatch(line, /\b(minutes?|hours?) (saved|back)\b|save (you )?\d/i, `no promised time in "${line}"`);
      assert.doesNotMatch(line, /\$\d/, `no price in "${line}"`);
    }
    assert.doesNotMatch(recipe.title, /[:[\]]/, `no colon or brackets in the title "${recipe.title}"`);
  }
});
