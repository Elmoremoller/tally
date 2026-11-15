# Experiment three readout

Written on 15 November 2026. This experiment changes no product code. It only adds to `scripts/persona-runs.ts` and `scripts/persona-checks.ts`, and it only produces files.

**The question.** What happens when a job is read as responsibilities rather than writing tasks, and each responsibility gets the simplest system that removes the repeated work?

## Who ran

1. **The office coordinator, new this time.** Karl's job text word for word. New to AI, so a Starter. Works in Outlook, Teams and Excel on a computer and a phone. An employee who is not sure what her company allows. Karl gave no phone type, so iPhone is assumed. She went through the live quiz at /begin with the real AI calls, then got her free result and her recipe path from the site's own code. Nothing was written to the database.
2. **Kayla, the electrician from the earlier runs.** Self employed Starter, phone only. Her saved quiz answers were reused, so only experiment three ran for her.
3. **Priya, the HR coordinator from the earlier runs.** Starter on a computer, not sure what her company allows. Her saved quiz answers were reused too.

## Where the files are

Everything is in `docs/audit/2026-11-15-persona-runs`.

| File | What it holds |
| :-- | :-- |
| `office.path.md` | Her map, offer and recipe path, from the product as it is today |
| `office.design.md` | Experiment one for her, her top two tasks designed freely |
| `office.design3.md`, `kayla.design3.md`, `hr.design3.md` | Experiment three: her responsibilities, their patterns, and a workflow for each, with the checks at the bottom |
| `office.screens.md`, `kayla.screens.md`, `hr.screens.md` | Her free map and her paid path for her top two workflows, one screen at a time |
| `office.json`, `kayla.json`, `hr.json` | Everything, including every vendor link lookup |
| `summary.json` | Every check and count for every person |

To run it again:

```
node --env-file=.env.local --import ./scripts/register-ts.mjs scripts/persona-runs.ts office
node --env-file=.env.local --import ./scripts/register-ts.mjs scripts/persona-runs.ts --three office,kayla,hr
```

The first line puts her through the whole quiz. The second runs only experiment three, on the saved answers.

## How experiment three works

1. **One call reads her job as responsibilities, four to ten of them.** For each one it writes:
   * the work done with her hands, and the tracking, deciding, ordering or repeating around it
   * one or more of the ten patterns
   * a level
   * the workflow, as setup steps
   * what Tally would write for her
   * the point where she checks
   * the line on her map and the name in her offer

   It also picks her top two workflows.
2. **Every step is one of three kinds.**
   * A step with a card or recipe id shows that card's or recipe's checked steps in full.
   * Any other step in an app names the feature it relies on, is marked "not checked by us", and gets a web search for the vendor's own help page.
   * A step outside any app is just its goal.

   A link counts only if it came back from the search and sits on the vendor's own site. A click path from the model shows only beside such a link. Otherwise the step says none found.
3. **A second call writes her top two as the paid path shows them.** That means:
   * the finished result behind See it
   * the message to ask, when she is not sure what is allowed
   * a short read for each workflow
   * the material written out in full
   * a test on three, the approval point, and one line for when it stops working
   * what is safe at her job

   Setup steps and costs are never written by this call. They come from the design.
4. **Costs come only from a recipe or card.** For any other feature the line says whether her plan includes it is not checked by us, and gives the vendor page.
5. **Checks run on every person** and print at the bottom of each design file.

## The short version

1. **The office coordinator gains the most.** The product today gives her two tasks at Write it with AI, one at Build once, reuse, and restocking the fridges at Stays yours. Experiment three finds seven responsibilities and gives every one a Build once, reuse system:
   * one Excel lunch sheet that counts every order and diet
   * a restock sheet with the usual amounts
   * a supplies sheet with a request list
   * an event checklist she copies for each event
   * saved supplier emails in Outlook
   * saved replies on her phone and one place for requests
   * a repeating checklist with reminders for plants, cleaning and maintenance

   Most of these need no AI at all once they are built.
2. **The work done with hands turned out to be the easiest to fix.** Restocking, supplies, events and the plants all became a tracker, a checklist or a standard order. None of them is a writing task.
3. **Priya gains too.** The product gives all three of her tasks Write it with AI, because Outlook and Excel have no recipes. Experiment three gives six of her seven responsibilities Build once, reuse:
   * a saved assistant for benefits answers
   * a standard onboarding checklist
   * saved interview messages
   * reminders on a schedule
   * a newsletter layout
   * saved replies

   Employee records stay hers, because they hold private details.
4. **Kayla gains little.** The product already gives her six tasks at Build once, reuse. Experiment three mostly finds the same things, with invoices, payment reminders and review requests as saved texts. It also breaks a rule (below).
5. **Most of the new steps are Microsoft features we have not checked.** For the office coordinator, 14 of 17 unchecked steps found a Microsoft help page. Excel and Outlook are where recipes would pay off next, as the second experiment also found.

## Results per person

| | Office coordinator | Kayla, electrician | Priya, HR coordinator |
| :-- | :-- | :-- | :-- |
| Responsibilities | 7 | 6 | 7 |
| Left as hers | 0 | 0 | 1 (employee records) |
| Levels | Build once, reuse 7 | Build once, reuse 5, Inside your apps 1 | Build once, reuse 6, Stays yours 1 |
| Top two | Ordering lunch and drinks, Writing supplier emails | Quoting jobs, Following up quotes | Answering benefits questions, Onboarding new hires |
| Steps | 24 | 12 | 18 |
| Checked from a card or recipe | 0 | 9 | 2 |
| Not checked by us | 17, 14 with a vendor page | 3, none with a vendor page | 12, 8 with a vendor page |
| Outside any app | 7 | 0 | 4 |
| Click paths shown beside a link | 10 | 0 | 0 |
| Screens on her paid path | 16 | 15 | 16 |
| Failed checks | 1 | 2 | 2 |

**Patterns used, by how many responsibilities matched each.**

| Pattern | Office | Kayla | Priya |
| :-- | :-: | :-: | :-: |
| 1. Messages she repeats | 4 | 5 | 5 |
| 2. Documents she repeats | | 2 | 2 |
| 3. Stock that runs low and gets reordered | 2 | | |
| 4. Orders prepared from a short count | 2 | | |
| 5. Events that repeat, run from a checklist | 1 | | 2 |
| 6. Requests from colleagues, collected in one place | 3 | | 4 |
| 7. Routines and reminders on a schedule | 1 | 2 | 4 |
| 8. An inbox that needs sorting and follow up | 1 | 2 | 1 |
| 9. Notes that become tables or reports | | 1 | 1 |
| 10. Answers looked up in documents she already has | | | 1 |

Patterns 3 and 4, stock and orders from a count, only came up for the office coordinator. They are the patterns the product has nothing for today.

## What failed

1. **A chat tool step with no feature named, for all three.** When a step happens in Claude, like "ask Claude to design the sheet layout", the model left the feature empty. So there is no vendor page and no link. It is honest, but it is a gap.
2. **Kayla, a Starter, got Inside your apps.** Her quote follow ups connect Gmail to Claude through the gmail_claude_follow_ups recipe. She controls her Gmail, so it is allowed. But DIRECTION.md section 2 says a Starter path normally stops at level 3, and the prompt said so too. The model ignored it, and the check caught it.
3. **Priya's newsletter line reads like writing help.** "A saved newsletter layout and a prompt that turns your notes into a draft" is level 3 on her map but mentions a prompt.

## What else stood out

1. **The "Ask first" tag is on every row for someone not sure what is allowed, even rows with no AI in them.** The office coordinator's restock sheet, supplies sheet and plant reminders need no AI tool, but they still carry the tag. That follows the product's own rule in `lib/beginner/levels.ts`. Her held line is now only on the rows where she would put work into Claude.
2. **AI's part is often only that Tally writes the setup.** For the office coordinator, Tally writes the sheet layout, the columns, the standard order and the email texts. She then builds the sheet in Excel and never needs an AI tool for it. Even so, three of her workflows still ask her to have Claude draft the layout, the emails or the event checklist. That step adds nothing when Tally has already written them, and it is why those rows wait for her company's OK.
3. **Costs are noisy for basic app features.** "Whether your plan includes Excel conditional formatting is not checked by us" is true, but it reads oddly next to a feature every Excel has.
4. **Vendor links are not stable between runs.** In the first run Priya's Outlook Quick Parts link was rejected, while the office coordinator's was accepted. In this run Priya's Quick Parts link points at Word's Quick Parts page on microsoft.com. It passes the check, which only looks at the site, but it is not Outlook's page.
5. **Her top two leans toward writing.** The office coordinator's second workflow is supplier emails. That is fair, since she picked it in the quiz as one of the two that would save her the most time. But her restock and supplies sheets remove more repeated work.

## What changed between the first run and this one

The first run of experiment three showed three problems, all caused by my prompt or my checks, not by the product. The fixes:

1. **The design is now told her chat tool, and that her path already opens with getting it ready.** Before, Kayla and Priya had Claude on their opening screens and ChatGPT cards inside their workflows. The office coordinator had the Claude setup again inside a workflow.
2. **No more dashes or hyphen words.** The first run wrote drop down and gluten free with hyphens, and started lines in an order email with a dash. The prompt now forbids hyphen words. The check now also catches a line that starts with a dash.
3. **Two checks were too loose or too strict.**
   * The pattern check now expects a pattern even on a responsibility that stays hers. The first run left Kayla's "Doing the electrical work and setting the price" with none.
   * The connect check flagged a "[link]" blank in a reminder as connecting an app. It now counts "link" only as a verb.

Everything is tested in `tests/persona-checks.test.ts`, and the type check, the tests and the lint pass.

## Limits

1. One run per person. A second run gives a different design, as the change from the first run showed. Kayla went from 7 responsibilities to 6 and Priya from 6 to 7. The office coordinator stayed at 7, but with different steps.
2. The level in experiment three is chosen by the model, under the rules in its prompt, and only checked afterwards. In the product the code chooses it.
3. No vendor step is checked by us. Every one needs checking against its link before it could become a recipe.
4. None of the copy in these files is approved. It is all DRAFT.
