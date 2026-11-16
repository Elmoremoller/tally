// Prints every card in lib/beginner/cards.ts as plain steps, sorted app by app, so Karl can walk through each one
// himself (docs/DIRECTION.md, Phase 9). What could not be confirmed comes first. Run it with
//   node --import ./scripts/register-ts.mjs scripts/print-cards.ts > docs/audit/2026-11-16-phase-9-cards.md
// Reads nothing from the network or the database.
import { BLOCK_APP_NAMES, BLOCK_APPS, blockCards, CARD_TOOLS, setupCards, type BlockCard } from "../lib/beginner/cards";
import { toolLabels } from "../lib/week";

const out: string[] = [];
const push = (...lines: string[]) => out.push(...lines);

const steps = (title: string, list: string[] | undefined) => {
  if (!list?.length) return;
  push(`**${title}**`, "", ...list.map((line, i) => `${i + 1}. ${line}`), "");
};

const links = (sources: string[]) => sources.map((s) => `* <${s}>`);

push(
  "# Phase 9 cards, to walk through",
  "",
  "Every card in `lib/beginner/cards.ts`, as plain steps, sorted app by app. The building block cards were checked on 16 November 2026 against the vendor's own help pages. Tick each device once you have done it yourself. Every title, step and note is a DRAFT until you approve it.",
  "",
  "Printed from the code by `scripts/print-cards.ts`, so this file and the cards always match.",
  "",
  "## Could not confirm",
  "",
  "These are left out, or left without phone steps, because the vendor's pages don't give the steps.",
  "",
  "1. **Excel, highlight a whole row.** Left out. Microsoft's pages show a highlight rule written as a formula, but none shows one that colors a whole row. Google's page does, so Google Sheets has this card.",
  "2. **Excel on a phone.** No phone steps on any Excel card. Microsoft says Excel on an iPhone can show highlights and pick from drop down lists, but can't make either. For Android, Microsoft's pages don't say.",
  "3. **Microsoft Forms and Outlook on a phone.** No phone steps. Microsoft's pages for these features give computer steps only.",
  "4. **Google Forms on a phone.** No phone steps. Google gives the first steps in a phone's browser, but not how to add questions there.",
  "5. **Gmail templates on a phone.** No phone steps. Google says templates work only on a computer.",
  "",
  "## Worth a close look when you walk through",
  "",
  "These are confirmed, but less directly than the rest.",
  "",
  "1. **Excel formulas in a browser.** The pages for COUNTIF, FILTER, MIN, COUNT, IF and TODAY don't name Excel in a browser in their lists of versions. Microsoft's page on Excel in a browser says most functions work there as they do in the app, and that TODAY takes the date from Microsoft's server.",
  "2. **Adding days in Google Sheets.** Google's pages never show a date plus a number of days. The card uses DATE(YEAR(B2),MONTH(B2),DAY(B2)+7) instead, which the DATE page documents, including carrying extra days into the next month.",
  "3. **Opening Forms answers in Excel.** Microsoft describes answers that keep arriving for work and school accounts. With a personal account, choose Download a copy, which does not update.",
  "4. **Outlook saved emails.** Microsoft says these need a qualifying Microsoft 365 subscription, so the card says the free plan is not enough.",
  "",
  "## A sheet to try the tracker on",
  "",
  "The tracker cards use these columns. Put a start day in B2, then follow the cards for days after, next due and the highlight.",
  "",
  "| A | B | C | D | E | F | G | H |",
  "|---|---|---|---|---|---|---|---|",
  "| Name | Start day | Welcome email | Check in | Paperwork | Review | Next due | Due |",
  "| Sam | 11/10/2026 | =B2+0 | =B2+7 | =B2+14 | =B2+30 | next due formula | due formula |",
  "",
  "In Google Sheets, write the step dates as =DATE(YEAR(B2),MONTH(B2),DAY(B2)+7) and so on. Type done over a date to mark that step done.",
  "",
);

const blockCard = (card: BlockCard) => {
  push(`### ${card.title}`, "", `Id \`${card.id}\`. Checked ${card.checked}.`, "");
  const devices = (["computer", "android", "iphone"] as const).filter((d) => card.steps[d]?.length);
  push(...devices.map((d) => `* [ ] Walked through on ${d === "computer" ? "a computer" : d === "android" ? "an Android phone" : "an iPhone"}`), "");
  steps("On a computer", card.steps.computer);
  steps("On an Android phone", card.steps.android);
  steps("On an iPhone", card.steps.iphone);
  if (card.note) push(`Note. ${card.note}`, "");
  push(`Free plan. ${card.freePlan.enough ? "Enough." : "Not enough."}${card.freePlan.note ? ` ${card.freePlan.note}` : ""}`, "");
  push("Checked against", "", ...links(card.sources), "");
};

for (const app of BLOCK_APPS) {
  const cards = blockCards.filter((c) => c.app === app);
  push(`## ${BLOCK_APP_NAMES[app]}`, "");
  cards.forEach(blockCard);
}

push(
  "## ChatGPT and Claude",
  "",
  "These six cards came in Phase 3 and were checked on 14 November 2026. They are here so the file holds every card.",
  "",
);
for (const tool of CARD_TOOLS)
  for (const card of setupCards.filter((c) => c.tool === tool)) {
    push(`### ${card.title}`, "", `Id \`${card.id}\`, ${toolLabels[tool]}. Checked ${card.checked}.`, "");
    steps("On a phone", card.steps.phone);
    steps("On a computer", card.steps.computer);
    push(`Free plan. ${card.freePlan.enough ? "Enough." : "Not enough."}${card.freePlan.note ? ` ${card.freePlan.note}` : ""}`, "");
    push("Checked against", "", ...links(card.sources), "");
  }

console.log(out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd());
