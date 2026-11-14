// Prints every workflow recipe in lib/beginner/recipes.ts as plain steps, with each setup card it points to
// written out in full, so Karl can walk through each one on his own phone and computer. Run it with
//   node --import ./scripts/register-ts.mjs scripts/print-recipes.ts [recipe id]
// With an id, only that recipe prints. Reads nothing from the network or the database.
import { cardById } from "../lib/beginner/cards";
import { LEVELS, recipes, type RecipeStep } from "../lib/beginner/recipes";

const only = process.argv[2];
const chosen = only ? recipes.filter((recipe) => recipe.id === only) : recipes;
if (only && chosen.length === 0) throw new Error(`No recipe with the id ${only}`);

const stepLines = (steps: RecipeStep[]) =>
  steps.flatMap((step) => {
    if (typeof step === "string") return [step];
    const card = cardById(step.card);
    if (!card) throw new Error(`Unknown card ${step.card}`);
    const cardSteps = card.steps.computer ?? card.steps.phone ?? [];
    return [`Follow the card "${card.title}":`, ...cardSteps.map((line) => `  ${line}`)];
  });

const out: string[] = [];
for (const recipe of chosen) {
  out.push(`# ${recipe.title}`, "");
  out.push(`Id ${recipe.id}. Level ${recipe.level}, ${LEVELS[recipe.level]}. Checked ${recipe.checked}.`, "");
  const c = recipe.conditions;
  out.push(
    `Needs AI allowed at work: ${c.needsAiAllowed ? "yes" : "no"}. Connects one of her apps: ${c.connectsApp ? "yes" : "no"}. Her task content goes to: ${c.taskContent}.`,
    "",
  );
  for (const route of recipe.routes) {
    out.push(`## With ${route.apps.join(" and ")}`);
    if (route.note) out.push(route.note);
    for (const device of ["phone", "computer"] as const) {
      const steps = route.steps[device];
      if (!steps) continue;
      out.push("", `On a ${device}:`);
      let n = 0;
      for (const line of stepLines(steps)) out.push(line.startsWith("  ") ? `   ${line}` : `${++n}. ${line}`);
    }
    out.push("");
  }
  out.push("Tally writes for her:", ...recipe.material.map((line) => `* ${line}`), "");
  out.push(`Test on: ${recipe.test.tryOn}`, `Good looks like: ${recipe.test.good}`, "When it is off, send:");
  out.push(...recipe.test.fixes.map((line) => `* ${line}`), "");
  out.push(`Approval point: ${recipe.approval}`, "");
  const free = recipe.cost.freePlanEnough === null ? "not stated" : recipe.cost.freePlanEnough ? "yes" : "no";
  out.push(`Free plan enough: ${free}. ${recipe.cost.note}`, "");
  out.push("Checked against:", ...recipe.sources.map((source) => `* ${source}`), "", "");
}
process.stdout.write(out.join("\n"));
