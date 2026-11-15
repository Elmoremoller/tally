# Promises on the beginner landing page the path cannot keep today

Made on 15 November 2026 for Phase 7. Karl asked for a list only, so no copy on the page has changed.

The page checked is the beginner landing page, shown on the ad links `/?angle=new_to_ai`, `own_job` and `first_try`. The home page is the first version and was not checked.

Each promise was held against what the paid path really does today:

* There are eight recipes. Five are at level 3: quick replies on the phone, a saved assistant, say it out loud, notes to a sheet, Gmail templates. Two are at level 4, both in Gmail: Help me write, and follow ups with Claude or ChatGPT connected. One is at level 5: a weekly list of who has not replied.
* The only apps with checked steps are Gmail, Google Sheets, the three phone keyboards, ChatGPT and Claude. Microsoft, Canva, Instagram, Shopify, calendars and work systems have no recipe.
* A Starter stops at level 3.
* Her offer and path set up at most two workflows, for her top task and one more.
* There is no follow up after the path ("Later" in DIRECTION.md).
* Nothing is ever sent without her approval.

Each row says where the line lives in `lib/beginner/copy.ts` (or the file named), and whether it can be kept as is, kept for some people only, or not kept at all.

## Cannot keep today

| # | Where | The promise | Why the path cannot keep it |
|---|---|---|---|
| 1 | `beginnerPaths.after` | As you get better, your path moves on with you. | The path is written once, with two workflows. Nothing moves on, and the day three email is still under Later. |
| 2 | `beginnerPaths.paths[0].steps[4]` | The next skill to learn, and where to find it. | No step teaches a next skill or points anywhere. |
| 3 | `beginnerSteps[2]` | Get your plan. The tools to use, the skills to learn, and how to do each one. | She gets her first two workflows set up, not a list of tools and skills. "Plan" is also the old product's word. |
| 4 | `beginnerPage.changes.days[0].after` | Set up once, then it takes minutes. | Promises time, which section 5 rule 3 rules out, and nothing has been measured. |
| 5 | `beginnerPage.changes.days[4].after` | Done before you leave. | Nothing measured, and the path touches two tasks at most. |
| 6 | `beginnerPage.changes.close` | The busywork takes minutes. Your evening is yours. | Promises time and an outcome the path cannot measure. |
| 7 | `beginnerPaths.paths[1].steps[0]` | We find where your hours go. Email, reports, content. | The quiz no longer asks hours. The map uses her own counts, like "many times a day". |
| 8 | `beginnerFaqs[2]` | Do I need to pay for an AI tool? No. Your plan starts with a free one. | True for the level 3 recipes. Not true for every level 4 or 5 recipe. Help me write in Gmail needs a paid Google plan outside the US. Scheduled tasks in Claude need a paid plan. For the Gmail follow ups the vendors' pages do not say. The path says the cost before she starts, but this answer says never. |
| 9 | `beginnerFaqs[4]` | My company restricts AI. Your plan marks what’s safe to do today and what to check first, and gives you the message to ask. | The path no longer uses Safe today and Check first marks. When every task waits for her company's OK, there is no plan at all: she gets the message to ask, free, and no offer. |
| 10 | `beginnerPage.jobs` (Email) | Your inbox sorted by what needs you. | No recipe sorts an inbox. |
| 11 | `beginnerPage.jobs` (Scheduling) | A time found without the back and forth. Your week planned from your calendar. | No calendar recipe. |
| 12 | `beginnerPage.jobs` (Scheduling) | Reminders written and lined up to send. | Saved replies are a few letters away, but nothing is lined up or sent by itself. |
| 13 | `beginnerPage.jobs` (Reports) | A weekly summary straight from your spreadsheet. Raw numbers turned into charts and plain words. What changed since last week, pointed out. | No reports recipe. Notes to sheet goes the other way, into a sheet. |
| 14 | `beginnerPage.jobs` (Content) | A month of posts planned in one sitting. One idea turned into every format you post. Images and layouts started for you. | No planning, repurposing or image recipe, and no Canva or Instagram steps. |
| 15 | `beginnerPage.jobs` (Admin) | Forms filled from what you already have. Long documents searched and summed up. | No recipe for either. |
| 16 | `beginnerPage.jobs` (Meetings) | Notes taken for you. A recap and next steps sent afterward. Prep pulled from your past notes. | No meeting recipe, and "sent afterward" breaks the approval rule. |
| 17 | `beginnerSample` (How it works, step 2 picture) | Weekly headcounts, summary sent every Monday. Run of show built from your sheet. Banquet orders filled in from the client’s email. | No recipe for any of these, and "sent every Monday" has no approval point. |
| 18 | `beginnerSample` (How it works, step 3 picture) | Workflow 1 of 4. Save the reply as a reusable skill. Test it on five real emails. Turn it on for your inbox. | A path has at most two workflows. The test is on three real ones. There are no skills, and nothing is turned on to run alone. |

## Kept for some people only

| # | Where | The promise | Who it holds for |
|---|---|---|---|
| 19 | `beginnerPaths.paths[1].steps[3]` | How to connect it to the apps you already use. | Gmail, Google Sheets, a phone keyboard, ChatGPT and Claude only. Not Outlook, Canva, Instagram, Shopify or a work system. Employees only with a clear Yes to connecting. |
| 20 | `beginnerPage.jobs` (Email) | A nudge for anything left unanswered. | Builders in Gmail, through the weekly list at level 5. Not Starters, and not Outlook. |
| 21 | `beginnerPage.jobs` (Email) | Reply drafts that sound like you. | Inside Gmail for Builders at level 4. For everyone else, a saved assistant she asks each time. |
| 22 | `beginnerPage.changes.days[1].after` | A first draft waiting for you to check. | Only the Gmail level 4 recipes put a draft where she works. Everywhere else she asks for it. |
| 23 | `beginnerPage.jobs` (Admin) | Quotes and invoices from a few details. | Quotes yes, through the saved assistant or say it out loud. Invoices have no recipe. |
| 24 | `beginnerSample` (How it works, step 3 picture) | Connect Claude to Gmail, create a project for your vendors. | Real recipes for an allowed Builder in Gmail. But the follow ups recipe works in Gmail, not in a project, so the picture mixes two recipes. |
| 25 | `beginnerPage.jobs` tags | Skill, Tool, Workflow, Automation. | The product now speaks in five levels. "Automation" matches level 5, which only Builders in Gmail can reach. |

## Kept as is

* The hero: "Tell Tally what you do all day. It shows you what AI can take off your plate, and walks you through the first one."
* "See your first AI win." The free result shows her finished example behind See it.
* "Tell us your job, the apps you use and where you are with AI."
* "See where AI fits in your week, with the first task done for you, free."
* "Not a list of prompts. A path built around your job and your level."
* The Starter list, except the last line: open your first AI tool with where to click (the cards), one task to try today, what to type and why, what a good answer looks like and how to fix a bad one (the test).
* The Builder lines "How to set it up, step by step" and "Getting it running on your real work".
* "The one that fits your work, picked for you" and "Step by step, until it runs".
* The FAQ answers on courses, being technical, paying once, confidential information, ChatGPT and refunds.

## Not checked by reading

* "Takes about 2 minutes" and "About 2 minutes" were not timed. The quiz is 9 screens for a Starter and up to 11 for a Builder, with two AI waits.
* The reviews band shows placeholder reviews on local and preview links only. It is hidden on the live site until real reviews exist.
