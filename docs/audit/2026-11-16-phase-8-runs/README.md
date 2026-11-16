# Phase 8 runs

Written on 16 November 2026. Four made up women went through the quiz at /begin with the real AI calls: the read of her job and the final read. Their free results were built by the site's own code. Nothing was written to the database, and the paid path did not run, since it stays as Phase 6 built it until Phase 10.

| File | Who |
| :-- | :-- |
| `office.md` | The office coordinator from experiment three, with Karl's job text word for word. Starter, Outlook, Teams and Excel, not sure what her company allows. |
| `property.md` | A job never tested before: a property manager for 40 apartments. Builder, Gmail and Google Sheets. |
| `kayla.md` | Someone who only uses a phone: Kayla, the electrician. |
| `hr.md` | Someone in Outlook and Excel: Priya, the HR coordinator. |

Each file shows what she picked, her map, the preview behind See it, and her offer word for word, with the checks at the bottom. `summary.json` holds every time and check, and `<name>.json` holds everything.

To run it again (costs API money):

```
node --env-file=.env.local --import ./scripts/register-ts.mjs scripts/phase-8-runs.ts [office,property,kayla,hr]
```

## New lines that wait for Karl's approval

All are marked DRAFT in the code.

**The quiz**

1. The four fixed choices, shown only when the read of her job fails: Answering the same questions, Ordering supplies, Keeping track of requests, Planning events.
2. The lines while her answers are read: Reading your answers, Finding what can run smoother, Mapping your week.

The two group labels, "From what you told us" and "Often part of a job like yours", are the words of DIRECTION.md.

**The map**

1. The eyebrow: Your week.
2. The heading: "7 parts of your week can run smoother", "1 part of your week can run smoother", and with none, "Here is your week, as you told us".
3. Why a row stays hers: "This holds other people’s private details, so it stays yours." and "Nothing repeats around this one, so it stays yours."

**The offer**

1. The line on what she gets (Karl's view): "You get every part of your map that can run smoother set up with you, one at a time, starting with these two." With one workflow it ends "starting with this one".
2. Under her workflows: "Your path starts with a few questions about how you do each one today."
3. How each pattern ends a workflow's name, in `lib/beginner/patterns.ts`. For example "collected and counted", "counted against your usual amounts", "run from one checklist", "collected in one place", "on a schedule that reminds you".
4. The pieces for each pattern and each checked recipe, in `lib/beginner/patterns.ts` and `lib/beginner/free-result.ts`. For example "Your lunch order form, written for you".
5. The piece for a row she writes with AI: "Your quote message for Claude, written for you".
