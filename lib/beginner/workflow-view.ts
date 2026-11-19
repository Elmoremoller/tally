import { blockCardById, cardById, EXCEL_REGION, type BlockCard } from "./cards";
import { stepLines } from "./path";
import { recipeById } from "./recipes";
import type { Material } from "./path";
import { routeFor } from "./path";
import { cardDevice, costLines, nameOf, noteShown, rowOf, type Design, type PathV4, type Slot } from "./workflow";

// One designed workflow as she reads it, in the parts of DIRECTION.md section 4: the short read, what it costs when a
// card says so, what Tally wrote, the steps set up once, what she does each time, the test and her approval point.
// The page (PathFlow.tsx) and the proof script (scripts/phase-10-runs.ts) both read this, so the printout is the page.

export type ViewStep = {
  say: string;
  /** The label of the piece this step copies, when it uses one. */
  piece: string | null;
  /** The exact steps from the card or recipe, for her device. Empty for a plain goal. */
  lines: string[];
  /** Something to know first, from the card, only when it matters for her workflow. */
  note: string | null;
  /** What changes outside US English settings, on a card with a formula. */
  region: string | null;
};

export type WorkflowView = {
  title: string;
  read: string;
  /** What it costs, before she starts, when a card or recipe needs more than a free account. */
  cost: string[];
  material: Material[];
  once: ViewStep[];
  eachTime: ViewStep[];
  tryOn: string;
  good: string;
  approval: string;
};

const blockLines = (card: BlockCard, device: "computer" | "android" | "iphone") => card.steps[device] ?? [];

/** Her workflow as she reads it. */
export function workflowView(path: PathV4, slot: Slot & { design: Design }): WorkflowView {
  const { design } = slot;
  const row = rowOf(path, slot.task);
  const device = cardDevice(path.device, design.phone);
  // Karl's rule 6 (2026-11-16): the cards hold for US English settings, so a step that types an Excel formula with
  // commas keeps the Outside the US note, also when it is a plain goal using a piece Tally wrote.
  const excelComma = (pieceAt: number | null) =>
    design.suite === "microsoft" && pieceAt !== null && (design.material[pieceAt - 1]?.items ?? []).some((i) => /=[A-Z]+\([^)]*,/.test(i));
  const step = (s: Design["steps"][number]): ViewStep => {
    const piece = s.piece ? (design.material[s.piece - 1]?.label ?? null) : null;
    const block = blockCardById(s.use);
    if (block)
      return {
        say: s.say,
        piece,
        lines: [...blockLines(block, device)],
        note: noteShown(block, design),
        region: block.region ?? (block.app === "excel" && excelComma(s.piece) ? EXCEL_REGION : null),
      };
    const setup = cardById(s.use);
    if (setup)
      return { say: s.say, piece, lines: [...(device === "computer" ? (setup.steps.computer ?? []) : (setup.steps.phone ?? []))], note: null, region: null };
    const recipe = recipeById(s.use);
    if (recipe) {
      const { route } = routeFor(recipe, { apps: path.apps, tool: path.tool, device: path.device, phone: design.phone });
      const on = device === "computer" ? "computer" : "phone";
      return { say: s.say, piece, lines: route ? stepLines(route.steps[on] ?? route.steps.computer ?? [], on) : [], note: route?.note ?? null, region: null };
    }
    return { say: s.say, piece, lines: [], note: null, region: excelComma(s.piece) ? EXCEL_REGION : null };
  };
  return {
    title: row ? nameOf(row) : slot.task,
    read: design.read,
    cost: costLines(design),
    material: design.material,
    once: design.steps.filter((s) => s.when === "once").map(step),
    eachTime: design.steps.filter((s) => s.when === "each_time").map(step),
    tryOn: design.tryOn,
    good: design.good,
    approval: design.approval,
  };
}
