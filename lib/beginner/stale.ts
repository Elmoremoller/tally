import { blockCards, setupCards } from "./cards";
import { recipes } from "./recipes";

// Flags every setup card, building block card and workflow recipe whose `checked` date is more than STALE_AFTER_DAYS old, so Karl
// rechecks its steps against the vendor's help pages (BACKLOG.md). A flag only: nothing here changes a step.
// The daily run prints the list with `npm run stale`. Imports nothing from the server.

export const STALE_AFTER_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

export type StaleCheck = {
  kind: "card" | "block" | "recipe";
  id: string;
  checked: string;
  /** Whole days between `checked` and today, in UTC. */
  daysOld: number;
  sources: readonly string[];
};

type Checked = { id: string; checked: string; sources: readonly string[] };

/** Whole days from a YYYY-MM-DD date to the UTC day of `today`. */
export const daysSince = (checked: string, today: Date): number => {
  const then = Date.parse(`${checked}T00:00:00Z`);
  const now = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.floor((now - then) / DAY_MS);
};

/** Every setup card, block card and recipe checked more than STALE_AFTER_DAYS days before `today`, oldest first. */
export const staleChecks = (
  today: Date = new Date(),
  items: { cards: readonly Checked[]; blocks: readonly Checked[]; recipes: readonly Checked[] } = {
    cards: setupCards,
    blocks: blockCards,
    recipes,
  },
): StaleCheck[] => {
  const flag = (kind: StaleCheck["kind"], list: readonly Checked[]) =>
    list.map((item) => ({
      kind,
      id: item.id,
      checked: item.checked,
      daysOld: daysSince(item.checked, today),
      sources: item.sources,
    }));
  return [...flag("card", items.cards), ...flag("block", items.blocks), ...flag("recipe", items.recipes)]
    .filter((item) => item.daysOld > STALE_AFTER_DAYS)
    .sort((a, b) => b.daysOld - a.daysOld);
};
