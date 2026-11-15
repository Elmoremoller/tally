// Lists every setup card and workflow recipe checked more than 30 days ago, by id and with its source links,
// so Karl rechecks it against the vendor's help pages. Run it with `npm run stale`. A flag only: it changes
// nothing and always exits cleanly. Reads nothing from the network or the database.
import { STALE_AFTER_DAYS, staleChecks } from "../lib/beginner/stale";

const stale = staleChecks();
const out: string[] = [];
if (stale.length === 0) {
  out.push(`No setup card or recipe is older than ${STALE_AFTER_DAYS} days.`);
} else {
  out.push(`${stale.length} to recheck against the vendor's help pages (older than ${STALE_AFTER_DAYS} days):`, "");
  for (const item of stale) {
    out.push(`${item.kind} ${item.id}, checked ${item.checked}, ${item.daysOld} days ago`);
    out.push(...item.sources.map((source) => `  ${source}`));
  }
}
process.stdout.write(`${out.join("\n")}\n`);
