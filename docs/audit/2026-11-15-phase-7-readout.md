# Phase 7 readout

Written on 15 November 2026, written again the same evening after the fixes Karl asked for, and updated once more after two changes Karl chose: phone only people get say it out loud in place of a saved assistant, and her second workflow takes another recipe than her first when two tasks tie on level. The five phone only people ran again after the first change, and the dog groomer once more after the second, the only person whose offer it changed. The other runs are unchanged, since neither change can touch them. Twelve made up people went through the live quiz at /begin with the real AI calls. Their free result and paid path were built by the same code the site uses. Nothing was written to the database.

Every file is in `docs/audit/2026-11-15-persona-runs`:

* `<name>.path.md` holds her map, offer and recipe path.
* `<name>.design.md` holds the first experiment, a free design for her top two tasks.
* `<name>.design2.md`, for the six who work at a desk, holds the second experiment: every task on her map, with vendor help pages.
* `<name>.json` holds everything, and `summary.json` has every check and count.

Prompt versions in this run: job read beginner-job-v5, question beginner-questions-v6, final read **beginner-intake-v8**, path beginner-path-v1.

## The short version

1. **Every check passes now.** That covers all twelve people, the Phase 5 and 6 Done when lines, and examples 2 and 3 from section 2.
   * The Gmail Builder gets two Inside your apps workflows.
   * The phone only electrician's quotes and invoices get Build once, reuse, through say it out loud.
2. **One person gets no recipe at all: the HR coordinator.** She works in Outlook and Excel, which have no recipes, so both her workflows are "written with AI". The restricted cashier had none in the first runs; this time the final read named her customer texts, and quick replies need no AI at work, so she gets one recipe.
3. **Phone only people now get say it out loud for writing they repeat.** Karl chose it, since neither vendor gives phone steps for a saved assistant. It gave four rows a recipe they did not have: the electrician's invoices, the groomer's social posts, and the boutique owner's captions and social posts.
4. **Paths differ more than in the first run, but three phone people still look alike.**
   * Two paths share 28 percent of their recipes on average.
   * Quick replies are in 8 of the 12 paths. The beauty advisor, the cashier and the dental receptionist get nothing but quick replies, because nothing else on their maps has a recipe.
   * When two tasks tie on level, her second workflow now takes another recipe than her first. The dog groomer now gets quick replies and say it out loud, not quick replies twice.
5. **The second experiment found where new recipes would pay off.** Outlook, Excel, Shopify and Klaviyo, each with the vendor's own help page. It also chose to leave Canva design and phone calls to her.

## What changed in this PR since the first readout

1. **The time check no longer catches "HR".** `TIME_PROMISE` in `lib/beginner/free-result.ts` now matches "hr" and "hrs" in lower case only, so "You answer HR questions" stays on her map. Tested both ways.
2. **Her second workflow is her highest level task.** `secondTask` now takes the task with a recipe at the highest level, and the first on her map when two tie. Before, it took the next one on her map with any recipe.
3. **The final read knows the task kinds better** (beginner-intake-v8):
   * Anything through her inbox is an email kind, never texts. When it is unclear and she uses Gmail or Outlook, it is email.
   * Spoken writing is longer writing she talks through or does on her phone between jobs.
   * Awaiting replies is keeping track of who has not answered. Writing the chase is email follow ups.
   * A task done in person, at a till or counter, has no kind.
4. **Not sure gets the ask first line.** Someone who answered Not sure to "Can you use AI for your work?" keeps her levels, and every task AI touches says "Ask first what your company allows with AI." This is a new line, marked DRAFT. The restricted line ("Ask first if your company's rule covers any use of AI") assumes a rule she may not know about. Checked on `/begin/preview`: the dental sample, who is Not sure, shows the line on her three AI tasks and not on "Answering phones".
5. **Phone only repeat writing is said out loud.** Details under "Phone steps for a saved assistant".
6. **A tie on level goes to another recipe.** `secondTask` in `lib/beginner/free-result.ts` still takes the highest level first, so a level 4 task beats a level 3 one with another recipe. Between tasks at the same level, one with another recipe than her top task's now wins, so she learns two ways of working instead of one twice. Tested in `tests/beginner/free-result.test.ts`.

## Phone steps for a saved assistant

I read the vendors' own pages on 15 November:

* **ChatGPT.** "Projects in ChatGPT" (help.openai.com/en/articles/10169521) gives one set of steps ("Select New project in the sidebar") and never says which device. It says projects let you "start on one device and continue on another", and that sharing works "across the web and mobile apps". The phone app FAQ (articles/8142208) points phone users to custom instructions, not projects. A help center search for projects on mobile finds nothing more.
* **Claude.** "How can I create and manage projects?" (support.claude.com/en/articles/9519177) is written for a computer: "Hover over the left side", "Click + New Project". "What are projects?" has no phone steps, and the personalization page has none either. Claude Mobile is named only for memory.

**What it means.** Under Karl's rule that a step goes in only when the vendor's page says it, the saved assistant stays computer only.

**What Karl chose, and what changed.** Phone only people get say it out loud for writing they repeat, since its steps are checked for both phones in both chat tools. `PHONE_STAND_IN` in `lib/beginner/recipes.ts` says repeat writing takes the spoken writing recipe on a phone, and `levelFor` in `lib/beginner/levels.ts` uses it only when a computer was the one thing that held the saved assistant back. So it never gets round the other rules: a restricted person still waits, and an employee's task with other people's private details stays at Write it with AI. Someone with a computer, or both, still gets the saved assistant. Tested in `tests/beginner/levels.test.ts`.

## Who ran

| Person | Group | Track | Device | Can use AI | Connect | Screens |
|---|---|---|---|---|---|---|
| beauty, beauty advisor | restricted employee | Starter | Phone only | No, restricted | not asked | 8 |
| cashier, big box cashier | restricted employee | Starter | Phone only | No, restricted | not asked | 8 |
| dental, dental receptionist | allowed employee | Starter | Both | Yes | No | 9 |
| jess, event coordinator | allowed employee | Builder | Both | Yes | Yes | 11 |
| kayla, electrician | self employed Starter | Starter | Phone only | works for herself | | 6 |
| groomer, mobile dog groomer | self employed Starter | Starter | Phone only | works for herself | | 7 |
| boutique, boutique owner | self employed Builder | Builder | Phone only | works for herself | | 9 |
| planner, wedding planner | self employed Builder | Builder | Both | works for herself | | 9 |
| social_new, social media manager new to AI | experiment | Starter | Both | Not sure | Not sure | 9 |
| social_canva, social media manager in Canva | experiment | Builder | Both | Yes | Yes | 11 |
| hr, HR coordinator | experiment | Starter | Computer only | Not sure | Not sure | 9 |
| ecom, ecommerce manager | experiment | Builder | Both | Yes | Yes | 11 |

Everyone stayed inside the screen limits: at most 9 for a Starter and 11 for a Builder.

One note on reliability: the first try for the new to AI social media manager stopped at the final read with no result. Run again, she went through cleanly. On the live site that would show her an error and let her try again. One failure in thirteen runs is worth watching.

## The checks

Every run is held in code (`scripts/persona-checks.ts`, tested in `tests/persona-checks.test.ts`) to the Done when lines of Phases 5 and 6:

* screens within the limit
* a level chosen in code on every row
* no line at level 3 or higher that reads like writing help, and each such line is its recipe's own
* no connected app without a clear Yes
* restricted tasks wait
* Not sure tasks say to ask first
* the dental and Gmail Builder examples, plus examples 2 and 3 from section 2
* a path written whenever there is something to buy
* no sign up step for a Builder
* a test, an approval point and a cost line on every workflow
* every setup step from a recipe or a card
* no click paths written by the model
* no dashes, promised times, or prices she did not give
* the offer matching the path

**All twelve pass every check.** Here is what the earlier failures look like now:

* **planner, the Gmail Builder.** Her top task, "Answering messages", now gets Help me write in Gmail at level 4. Her second workflow is "Chasing vendors", Gmail follow ups at level 4.
* **kayla, the electrician.** "Writing quotes" now gets say it out loud at level 3. She said on the quiz that she talks her quotes through on a voice memo at night.
* **jess, the event coordinator.** Vendor follow ups stay at level 4, and her second workflow is now Help me write, also level 4.

**Checks I tightened, because they flagged things that were fine.** "Menu choices" for a restaurant, "your go to workout outfit", "opening hours", "labor hours", a 50 percent deposit that came from Kayla's own example, and "the deposit amount or percent" with no figure in it. A price now counts only when she did not give it, and click words only count in the shape of a click path. Each change has a test.

**Not run again.** "Did it work?" reaching the events table was proven live in Phase 6 (a tagged row written, read back and deleted). I did not write test rows again. Old saved answers loading is covered by the existing tests, which all pass.

## Recipes per person

| Person | Tasks with a recipe | Which |
|---|---|---|
| beauty | 2 of 5 | Follow up texts and answering client messages, both quick replies. Tracking commission waits for her company's OK; makeovers and restocking stay hers. |
| cashier | 1 of 4 | Answering messages (quick replies, which need no AI at work, with the line to ask first). Returns, price questions and the till stay hers. |
| dental | 3 of 6 | Reminders, recall messages and rescheduling when a dentist is out, all quick replies. |
| jess | 4 of 5 | Follow ups (Gmail follow ups, level 4), answering messages (Help me write, level 4), run of show (saved assistant), lists (notes to sheet). Calling vendors stays hers. |
| kayla | 6 of 6 | Quotes and invoices (say it out loud), texting homeowners, following up quotes, answering messages, and chasing payment and reviews (quick replies). |
| groomer | 3 of 6 | Owner messages and reminder texts (quick replies), social posts (say it out loud). Bathing, cutting and booking stay hers this run. Her offer is owner messages and social posts. |
| boutique | 3 of 5 | Customer messages (quick replies), Instagram captions and social posts (say it out loud). Tagging and restocking stay hers. |
| planner | 5 of 6 | Answering messages (Help me write, level 4), vendor booking emails and other emails (Gmail templates), lists (notes to sheet), chasing vendors (Gmail follow ups, level 4). Timeline planning is level 2. |
| social_new | 4 of 5 | Captions (saved assistant), comments and messages (quick replies), emails (Gmail templates). Weekly planning is level 2. Every task AI touches says to ask first. |
| social_canva | 4 of 6 | Captions (saved assistant), comments and messages (quick replies), emails (Gmail templates). Designing in Canva stays hers; the calendar is level 2. |
| **hr** | **0 of 3. No recipe at all.** | Benefits questions, onboarding and emails are all level 2, because she works in Outlook and Excel. Every task says to ask first. |
| ecom | 4 of 5 | Product descriptions and listing updates (saved assistant), promo emails (Gmail templates), customer replies (Help me write, level 4). Weekly sales numbers are level 2. |

**No recipe at all: hr.** It is the missing Microsoft recipes ("Later" in DIRECTION.md). The cashier had no recipe in the first runs; this run's final read found her customer texts, and register work now stays hers instead of waiting, so the odd "ask about handling returns" message did not come back. That is the model reading her differently, not a code change, so it may come back on another run.

**Most tasks on the saved assistant: nobody.** The most is the ecommerce manager, with 2 of 5.

**Quick replies take 17 of the 39 rows that got a recipe**, down from 18 of 36. Say it out loud takes 5 and the saved assistant 5. For beauty, the cashier and dental every recipe on the map is still quick replies.

**Inside your apps (level 4) now reaches three paths:** jess, planner and ecom. **Nobody reached level 5.** The weekly list of who has not replied was offered to nobody, because no task was given the kind "awaiting replies". Jess's and the planner's chasing went to Gmail follow ups instead. That is a level 4 that drafts the chase, and a reasonable reading of "chasing".

## How different the paths are

Plainly: more different than in the first run, but three people who work from a phone still get the same workflow.

* All 12 people got a path this time. Of the 66 ways to pair two paths, 8 pairs set up the same recipes, against 11 of 66 in the first run.
* On average two paths share 28 percent of their recipes and 27 percent of the words Tally wrote for them.
* The pairs with the same recipes:
  * the beauty advisor, the cashier and the dental receptionist, who all get quick replies only (three pairs)
  * the electrician, the dog groomer and the boutique owner, who all get say it out loud and quick replies (three pairs)
  * the two social media managers, who both get a saved assistant and quick replies
  * Jess and the planner, who both get Help me write and Gmail follow ups

**Two paths side by side.** These are the most alike pair now: the same two recipes, in a different order.

| | jess, event coordinator at a restaurant group | planner, her own wedding planning business |
|---|---|---|
| Skipped | Getting a tool ready, since she uses ChatGPT | Getting a tool ready and teaching it who she is, since she has saved instructions about herself |
| Teach it who you are | "I’m an event coordinator for a restaurant group in Chicago. I plan private events and run them on the night…" | skipped |
| Workflow 1 | Your follow up emails, drafted from your inbox for your OK (Gmail follow ups, level 4) | Answering messages, drafted in your inbox (Help me write, level 4) |
| What Tally wrote | "Look in my Gmail for threads where I asked a vendor or client for something and they have not answered…" | "Thank them for reaching out about their [month] wedding and suggest a call on [day and time] to talk about their date and budget." |
| Workflow 2 | Answering messages, drafted in your inbox (Help me write, level 4) | Your vendor follow ups, drafted from your inbox for your OK (Gmail follow ups, level 4) |
| What Tally wrote | "Thank [first name] for the update on [event name]. Confirm I have the headcount of [number] and ask for the dietary list by [day]." | "Look in my Gmail for emails I sent to vendors, like venues, caterers, florists and photographers…" |
| End | What is safe at her job, and the message to ask her manager | What is safe in her work, with no message, since she has no employer |

Same shape, but written for each of them. That fits two people whose work really is the same inbox. The pairs that worry me are the phone ones: the beauty advisor, the cashier and the dental receptionist get the same keyboard setup, because texts are the only task on their maps with a recipe.

## The first experiment, a free design for her top two tasks

Same rules as the first run: tool facts only from the checked cards and recipes, by id, and every other step in an app is its goal only and not checked by us. Prompt `DESIGN_SYSTEM` in `scripts/persona-runs.ts`.

Across twelve people: 104 steps, 60 checked by id, 9 not checked by us, 35 outside any app. The unchecked apps were the phone's keyboard settings (3), and one step each in a paper client book, Google Calendar, Instagram, ChatGPT, Shopify and Gorgias. The phone keyboard steps are covered by the quick replies recipe; the model named the app instead of the recipe. As in the first run, the free design stays close to the recipes. It is more careful than the product with restricted and Not sure, and it still ignores the device now and then.

## The second experiment, every task on her map, for the six who work at a desk

For jess, planner, both social media managers, hr and ecom, a model designed a workflow for every task on her map, and was told to think hardest about tasks the product left at Stays yours or Write it with AI. It could use what it knows about her apps.

Each step not from a card or recipe names the app feature it relies on. A second call with the API's web search tool then looked for the vendor's own help page. A link counts only when it came back from the search and sits on the vendor's own site (`checkLookup` and `vendorOk` in `scripts/persona-checks.ts`, tested). A click path from the model shows only beside such a link. The prompts are `DESIGN2_SYSTEM` and `LOOKUP_SYSTEM` in the script. No product code changed for it.

**Totals across the six:** 81 steps, 50 checked by id, 22 not checked by us, 9 outside any app. Of the 22 unchecked steps, 17 have the vendor's own help page and 5 have none found. No goal held a click path.

**The apps in the unchecked steps:**

| App | Steps not checked by us | With the vendor's help page |
|---|---|---|
| ChatGPT | 8 | 5 |
| Google Sheets | 5 | 4 |
| Gmail | 2 | 2 |
| Outlook | 2 | 2 |
| Shopify | 2 | 2 |
| Excel | 1 | 1 |
| Klaviyo | 1 | 1 |
| Microsoft Word | 1 | 0 (no feature named) |

**Tasks the product left at Stays yours or Write it with AI, and what the design made of them:**

| Person | Task, product level | The free design |
|---|---|---|
| jess | Calling vendors, Stays yours | Left as hers: the calls rely on her relationships and quick decisions. |
| planner | Timeline planning, Write it with AI | A saved project drafts a day of timeline from the key facts, then into Google Sheets. |
| social_new | Weekly content planning, Write it with AI | A saved project proposes the week from last week's posts, then into her Google Sheet. |
| social_canva | Designing posts in Canva, Stays yours | Left as hers: "the look of your posts is your taste and your brand". No Canva feature appeared at all. |
| social_canva | Content calendar, Write it with AI | A saved project suggests a week of posts as a table from last week's numbers, pasted into Sheets. |
| hr | Benefits questions, Write it with AI | A saved assistant with her approved answers drafts each reply. The one Word step names no feature and has no link. |
| hr | Onboarding new hires, Write it with AI | A master checklist with **Copilot in Excel** (Microsoft's page found), a saved assistant for welcome emails, and **Outlook Quick Parts** for reused blocks. |
| hr | Writing emails, Write it with AI | **Outlook Quick Parts** for repeated emails, and a saved assistant for the rest. |
| ecom | Weekly sales numbers, Write it with AI | **Shopify's report export** (Shopify's page found), then notes to sheet, then **Google Sheets import**. |

**What it says.**

1. **The gain is in Microsoft and store apps, not more AI.** The HR coordinator, who gets no recipe today, gets two real workflows from Outlook Quick Parts and Copilot in Excel. The ecommerce manager gets Shopify's export and Klaviyo's editor around the recipes she already has. Those are the first recipes worth checking: Outlook Quick Parts is the Outlook version of Gmail templates.
2. **Many unchecked steps cover ground our recipes already cover.** ChatGPT projects and Gmail's Help me write show up as unchecked because the model named the feature instead of the recipe. Five of the eight ChatGPT steps are like that. So the real count of new ground is smaller than 22.
3. **It knows when to stop.** Calling vendors and designing in Canva were left to her, with a reason. Even with Canva open to it, the model found nothing in Canva that would make her design better. A Canva recipe would not be the next one to build.
4. **Links need a person to look.** Every link is on the vendor's own site, but one is for a sibling app: the Outlook Quick Parts link goes to Microsoft's Word page. A recipe made from these would still need Karl's walk through, as in Phase 4.

## What I suggest next (not done, for Karl's call)

1. A first Microsoft recipe: saved replies with Outlook Quick Parts, checked against Microsoft's page. It would give the HR coordinator a level 3.
2. Tell the final read that work done at a register is not something AI helps with (ai false, not only no kind), so a restricted cashier's message does not ask about returns.
3. Watch the final read for runs with no result: one in thirteen here.

Then Karl puts five real people through it and watches the first session (Phase 7, step 4).

## The other Phase 7 files

* `docs/audit/2026-11-15-drafts-to-approve.md`: every DRAFT line across the quiz, the free result, the path, the cards, the recipes and the landing page, numbered, 583 in all, with the new Not sure line as number 31.
* `docs/audit/2026-11-15-landing-promises.md`: 18 promises on the beginner landing page the path cannot keep today, and 7 it keeps for some people only. No copy was changed.
