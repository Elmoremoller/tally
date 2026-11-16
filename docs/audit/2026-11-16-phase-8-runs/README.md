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
3. The tag on her top two rows: "In your path". Every other row says "What could change" in place of "With your path" (Karl, 16 November).
4. Why a row stays hers: "This holds other people’s private details, so it stays yours." and "Nothing repeats around this one, so it stays yours."
5. Each pattern's own direction line, used when the model's line breaks a rule, in `lib/beginner/patterns.ts`. For example "A routine with how often each job comes round."

**The offer**

1. The line on what she gets: "Tally builds these two workflows with you, one step at a time." With one workflow: "Tally builds this workflow with you, one step at a time."
2. Under her workflows: "Your path starts with a few questions about how you do each one today."
3. How each pattern ends a workflow's name, in `lib/beginner/patterns.ts`. For example "collected and counted", "counted against your usual amounts", "tracked from the start day", "collected in one place", "on a schedule that reminds you", "with follow ups ready to send".
4. The pieces for each pattern and each checked recipe, in `lib/beginner/patterns.ts` and `lib/beginner/free-result.ts`. For example "Your lunch order form, written for you". Events, onboarding and inspections get a tracker on a computer ("Your new hire tracker, one row for each new hire", "Your new hire steps, each dated from the start day", "Your new hire due dates, highlighted when they come round") and a dated checklist on a phone only ("Your new hire checklist, each step with its day from the start", "Your new hire reminders, one for each due day").
5. The piece for a row she writes with AI: "Your quote message for Claude, written for you".

## The tracker, checked against the vendors' pages on 16 November 2026

* Excel on Windows: a formula rule highlights a date once it has come ([Microsoft](https://support.microsoft.com/en-us/excel/use-conditional-formatting-to-highlight-information-in-excel)), and a date plus a number of days gives a later date ([Microsoft](https://support.microsoft.com/en-us/excel/add-or-subtract-dates)).
* Google Sheets on a computer and on Android: custom formula rules ([Google](https://support.google.com/docs/answer/78413?hl=en&co=GENIE.Platform%3DDesktop)). On an iPhone the app shows rules but cannot make them ([Google](https://support.google.com/docs/answer/78413?hl=en&co=GENIE.Platform%3DiOS)), so Next due, the earliest date left in a row ([MIN](https://support.google.com/docs/answer/3094017?hl=en)), shows what is due without a highlight.
* Not yet checked: Excel for the web and Excel on a phone. Phase 9 checks these.
