# Phase 7 readout

Written on 15 November 2026. Twelve made up people went through the live quiz at /begin with the real AI calls. Their free result and paid path were built by the same code the site uses. Nothing was written to the database. Every file is in `docs/audit/2026-11-15-persona-runs`. For each person, `<name>.path.md` holds her map, offer and recipe path, `<name>.design.md` holds the free design from the experiment, and `<name>.json` holds everything. `summary.json` has every check and count.

Prompt versions: job read beginner-job-v5, question beginner-questions-v6, final read beginner-intake-v7, path beginner-path-v1.

## The short version

1. **The checks did not all pass.** Two Done when lines failed, both section 2 examples:
   * The self employed Builder in Gmail did not get Inside your apps for her top email task.
   * The electrician who works from her phone did not get Build once, reuse for her quotes.
2. **One product bug.** The check that keeps promised times off the map also catches the letters "HR". An HR person's map can lose rows without anyone noticing.
3. **Paths look too alike for anyone on a phone.** Phone quick replies sit in 10 of the 12 paths. Five people get nothing but quick replies, twice. The cause is in the recipes, not the model. Five of the eight recipes have computer steps only, so "Phone only" leaves three: quick replies, say it out loud, and Help me write in Gmail.
4. **Nobody reached level 5**, and only two paths have a level 4 workflow.
5. **The experiment stayed close to the recipes.** The free designs reused checked cards and recipes 53 times and needed only 8 steps that are not checked by us.

## Who ran

| Person | Group | Track | Device | Can use AI | Connect | Screens |
|---|---|---|---|---|---|---|
| beauty, beauty advisor | restricted employee | Starter | Phone only | No, restricted | not asked | 8 |
| cashier, big box cashier | restricted employee | Starter | Phone only | No, restricted | not asked | 8 |
| dental, dental receptionist | allowed employee | Starter | Both | Yes | No | 9 |
| jess, event coordinator | allowed employee | Builder | Both | Yes | Yes | 11 |
| kayla, electrician | self employed Starter | Starter | Phone only | works for herself | | 7 |
| groomer, mobile dog groomer | self employed Starter | Starter | Phone only | works for herself | | 7 |
| boutique, boutique owner | self employed Builder | Builder | Phone only | works for herself | | 9 |
| planner, wedding planner | self employed Builder | Builder | Both | works for herself | | 9 |
| social_new, social media manager new to AI | experiment | Starter | Both | Not sure | Not sure | 9 |
| social_canva, social media manager in Canva | experiment | Builder | Both | Yes | Yes | 10 |
| hr, HR coordinator | experiment | Starter | Computer only | Not sure | Not sure | 9 |
| ecom, ecommerce manager | experiment | Builder | Both | Yes | Yes | 11 |

Everyone stayed inside the screen limits: at most 9 for a Starter and 11 for a Builder.

## The checks

Every run was checked in code (`scripts/persona-checks.ts`, tested in `tests/persona-checks.test.ts`) against the Done when lines of Phases 5 and 6:

* screens within the limit
* a level chosen in code on every row
* no line at level 3 or higher that reads like writing help, and each such line is its recipe's own
* no connected app without a clear Yes
* restricted tasks wait
* the dental and Gmail Builder examples, plus examples 2 and 3 from section 2
* a path written whenever there is something to buy
* no sign up step for a Builder
* a test, an approval point and a cost line on every workflow
* every setup step from a recipe or a card
* no click paths written by the model
* no dashes, promised times or prices
* the offer matching the path

**What passed.** 10 of 12 people passed every check. All 12 passed these:

* Levels came from code on every row.
* No level 3 line read like writing help.
* Nobody without a Yes got a connected app.
* Restricted tasks waited.
* The dental receptionist's reminder texts got Build once, reuse with no connected app.
* Jess's vendor follow ups got Inside your apps.
* Every path was written on the first try.
* Builders had no sign up step.
* Every workflow had its three parts.
* Every setup step came from a recipe or a card, or from Tally's own three steps when a task has no recipe.
* The model wrote no click paths.
* The offer matched the path.

**What failed.**

1. **planner, the Gmail Builder (Phase 5 Done when).** Her top task, "Answering inquiry messages", was given the kind "repeat texts" by the final read. So it got quick replies on her phone, level 3. Her inquiries come into Gmail. Her map does have a level 4 row, "Chasing replies" with Gmail follow ups. But her offer picks the next task with any recipe, and that was Gmail templates at level 3. Her path has no level 4 workflow at all.
2. **kayla, the electrician (section 2, example 2).** Her quotes stayed at level 2, "written with AI", held because "The setup for this needs a computer". The saved assistant recipe has computer steps only, because the help pages for ChatGPT and Claude projects give no phone steps. She works only from her phone. Say it out loud has phone steps and would fit, and her bio says she talks her quotes through. But nothing she answered on the quiz said so, so the final read called the task "repeat writing", not "spoken writing".
3. **Two copy flags that are not real problems.** Kayla's review request says "It only takes a minute here". The HR newsletter says "take a minute to welcome them". Both are lines she sends to other people, not a promise of time to her. The check flags them, and reading clears them.

**Found by reading, not by a check.**

1. **The time check catches "HR".** `TIME_PROMISE` in `lib/beginner/free-result.ts` is `/\b(minutes?|mins?|hours?|hrs?|seconds?|secs?)\b/i`. With the `i` it matches "HR". `lib/beginner/intake.ts` throws away any map row whose Today or With your path line contains it: on the first try it asks again, on the last try it drops the row. A line like "You answer HR questions by email" disappears. It did not happen in this run, but it will. The fix is one line: match "hrs" in lower case only. I have not changed it, because it was not in the plan.
2. **The cashier got a recipe that does not fit her.** "Handling returns" happens in person at the till. The final read called it "repeat texts", so she got quick replies on her phone, with lines like "Your return is done". Her own example on the quiz was a shift swap text.
3. **Level 5 never shows up.** No task was given the kind "awaiting replies", so the weekly list of who has not replied was never offered. Jess and the planner both chase people who have not answered.

**Not run again.** "Did it work?" reaching the events table was proven live in Phase 6 (a tagged row written, read back and deleted). I did not write test rows again. Old saved answers loading is covered by the existing tests, which all pass.

## Recipes per person

| Person | Tasks with a recipe | Which |
|---|---|---|
| beauty | 2 of 4 | Follow up texts and Answering messages, both quick replies. Client book updates waits for her company's OK. |
| cashier | 1 of 5 | Handling returns, quick replies. The other four stay hers. |
| dental | 3 of 6 | Reminder texts, recall reminders and moving appointments, all quick replies. |
| jess | 3 of 5 | Vendor follow ups (Gmail follow ups, level 4), client texts (quick replies), emails (Gmail templates). |
| kayla | 3 of 5 | Chasing payment and reviews, texting homeowners and answering messages, all quick replies. Quotes and invoices are level 2. |
| groomer | 4 of 6 | Answering messages, reminders, follow ups and price questions, all quick replies. Social posts are level 2, held for needing a computer. |
| boutique | 2 of 4 | Answering messages and texting regulars, both quick replies. Captions are level 2, held for needing a computer. |
| planner | 5 of 5 | Inquiries (quick replies), client emails (Gmail templates), proposals (saved assistant), timelines (notes to sheet), chasing replies (Gmail follow ups, level 4). |
| social_new | 4 of 5 | Captions (saved assistant), comments and messages (quick replies), emails (Gmail templates). |
| social_canva | 3 of 5 | Captions (saved assistant), comments (quick replies), emails (Gmail templates). Designing in Canva stays hers. |
| hr | 1 of 5 | Monthly newsletter (saved assistant). Everything else is level 2, because she works in Outlook and Excel. |
| ecom | 4 of 5 | Product descriptions and listing updates (saved assistant), customer replies (Help me write in Gmail, level 4), promo emails (Gmail templates). |

**Nobody has no recipe at all.** The cashier and the HR coordinator have one each.

**Nobody has most tasks on the saved assistant.** The most is the ecommerce manager, with 2 of 5.

**But quick replies take 20 of the 35 rows that got a recipe.** For dental, groomer, kayla, beauty and cashier, every recipe on the map is quick replies.

## How different the paths are

Plainly, the paths differ in their words but not in their shape.

* All 12 people got a path. Nobody was ask only, because even the two restricted employees had one recipe that needs no AI at work.
* Of the 66 ways to pair two paths, 11 pairs set up exactly the same recipes. Ten of those pairs are among five people whose path is quick replies and nothing else: beauty, cashier, dental, groomer and boutique.
* On average, two paths share 43 percent of their recipes and 27 percent of the words Tally wrote for them. So the replies and notes are her own, while the workflow underneath is often the same.
* The paths that stand apart belong to people on a computer with Gmail: jess, planner, ecom and hr.

**Two paths side by side.** These are the most alike pair: the same recipe twice, the same steps.

| | dental, receptionist with an employer | groomer, her own grooming van |
|---|---|---|
| Step 1 | Get Claude ready on your phone and computer | Get Claude ready on your phone |
| Step 2 | Teach it who you are: "I am a receptionist at a dental office. I handle phones, scheduling, insurance questions and patient messages…" | Teach it who you are: "I run my own mobile dog grooming van. I handle bookings, appointment reminders, client messages and social posts from my phone…" |
| Step 3 | Your reminder texts, saved once on your phone | Answering messages, saved once on your phone |
| Her replies | "Hi [first name], this is a reminder of your appointment on [day] at [time]. Reply here if you need to change it." | "Hi [first name], thanks for reaching out! Yes, [day and time] is open. Want me to book it for [dog’s name]?" |
| Step 4 | Your recall reminders, added to the same keyboard setup | Your reminder texts, added to the same keyboard setup |
| Step 5 | What is safe at your job, and the message to ask her manager | What is safe at your job, with no message, since she has no employer |

The writing is clearly hers in each. The workflow is the same keyboard trick twice.

**The cause.** Five of the eight recipes have computer steps only:

* saved assistant
* notes to sheet
* Gmail templates
* Gmail follow ups
* the weekly list

For anyone who answers "Phone only", that leaves quick replies, say it out loud, and Help me write in Gmail. Five of the twelve answered Phone only, and that is common for the self employed audience in section 2.

## The experiment, a free design beside the recipe path

For every person, a model also designed workflows for her top two tasks, with no fixed list of task kinds. The tasks were the same ones her path sets up. The rules held it to the checked cards and recipes for tool facts and click paths, by id. Any other step in an app gives its goal only and is marked "not checked by us". The prompt is `DESIGN_SYSTEM` in `scripts/persona-runs.ts`, and no product code changed for it.

| Person | Recipe path | Free design | Steps not checked by us |
|---|---|---|---|
| beauty | Quick replies twice, written by Tally | No AI at all: she writes her own replies and keeps them on her phone | 0 |
| cashier | Quick replies for returns | No workflow: ask a lead for a return checklist at the till | 0 |
| dental | Quick replies twice | Quick replies for reminders, plus a saved Claude project for recalls | 0 |
| jess | Gmail follow ups (level 4), quick replies | Adds the weekly list of who has not replied (level 5) to the follow ups | 0 |
| kayla | Quotes written with AI, quick replies | A saved quote builder she talks to on her phone, using cards with computer steps only | 0 |
| groomer | Quick replies twice | Quick replies, written in ChatGPT, checked against her calendar | 4 (ChatGPT 2, Google Calendar 2) |
| boutique | Quick replies twice | Quick replies, plus a saved ChatGPT project for texts to regulars | 2 (ChatGPT 2) |
| planner | Quick replies, Gmail templates | Same, plus a saved assistant and say it out loud for one off emails | 1 (Google Calendar) |
| social_new | Saved assistant, quick replies | Same, but asks her company first, since she said Not sure | 0 |
| social_canva | Saved assistant, quick replies | Same, with the saved assistant also drafting comment replies | 0 |
| hr | Policy answers written with AI, saved assistant | No AI until her company says yes: an answer sheet in Excel she writes herself | 1 (Excel) |
| ecom | Saved assistant, Help me write in Gmail | Same, plus a saved assistant for Gorgias replies | 0 |

Across all twelve designs there were 103 steps: 53 checked by id, 8 not checked by us, and 42 outside any app (like picking her ten most common questions).

**The apps that show up most in the unchecked steps:**

* ChatGPT, 4 times: writing the replies before saving them, a step no card covers.
* Google Calendar, 3 times: checking a slot before replying.
* Excel, once.

Canva, Shopify, Klaviyo, Instagram and Outlook never showed up. That is because each person's top two tasks were messages or writing, not design or store work.

**What the comparison says.**

1. **The free design is more careful with Not sure and restricted.** It kept AI out entirely for the beauty advisor, the cashier and the HR coordinator, and had the social media manager ask first. The product counts Not sure as allowed for tasks without private details. That rule is set in Phase 5, but it is worth a second look.
2. **The free design ignores the device.** It gave the electrician and the boutique owner a saved project on their phones. The project cards have computer steps only, so those steps are "checked" for a device she does not use. The recipe path was right to hold them back. The real gap is phone steps for a saved assistant.
3. **Where the recipe path is thin, the free design goes further in the same direction.** It adds the weekly list for Jess, say it out loud for the planner, and a quote builder for the electrician. Each of these is a recipe that exists, but the final read's task kinds or the offer's pick of a second task kept it out of the path.
4. **It did not invent much.** Only 8 steps needed an unchecked app. A path built this way would mostly need recipes for ChatGPT drafting and calendar checks, not for new apps.

## What I suggest next (not done, for your call)

1. Fix the "HR" match in the time check. One line, with a test.
2. Look for phone steps for a saved assistant in ChatGPT and Claude. Phone only people need more than quick replies.
3. Let the offer prefer a higher level for her second task, so a Builder with a level 4 row gets it in her path.
4. Teach the final read when a task is "spoken writing" or "awaiting replies", and when an in person task has no kind.

Then Karl puts five real people through it and watches the first session (Phase 7, step 4).

## The other Phase 7 files

* `docs/audit/2026-11-15-drafts-to-approve.md`: every DRAFT line across the quiz, the free result, the path, the cards, the recipes and the landing page, numbered, 582 in all.
* `docs/audit/2026-11-15-landing-promises.md`: 18 promises on the beginner landing page the path cannot keep today, and 7 it keeps for some people only. No copy was changed.
