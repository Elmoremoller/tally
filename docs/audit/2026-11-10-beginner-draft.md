# Tally for beginners: first win flow and landing copy

Draft for approval, 2026-11-10. Nothing here is built or live. It follows the audit in `2026-11-10-product-audit.md`.

Audience: women who want to start using AI and don't know where to begin, in any job.

## Built 2026-11-10

On git branch `beginner`, not committed and not live. Open it with `/?angle=new_to_ai` (also `own_job` and `first_try`). The quiz is at `/begin`. Code is in `lib/beginner`, `components/beginner` and `app/begin`. The first version is untouched and still opens at `/`.

Still needed before the whole flow runs: the one column in `supabase/migrations/20261110120000_beginner.sql`. Left out on purpose: the daily emails (no email service yet), the hand back scripts in At work (the quiz no longer asks for extra work), and ticks that follow her between devices (they are kept in her browser).

Words that were not in this draft and still need a look are marked DRAFT in `lib/beginner/copy.ts`: the paywall headline, the labels on the plan page, the tool steps, the line for a company that restricts AI, and the week question's example.

Test outputs for the six profiles are in `2026-11-10-beginner-runs.json`.

## Decisions (all five settled 2026-11-10)

Settled: B leads. The AI rule is dropped. The hours number is removed. Claude's free version is the default tool. B runs first as `?angle=new_to_ai` beside the current page.

The points as first put:

1. **The headline.** Decided 2026-11-10: B leads. A and C become ad angles.
2. **The copy rule "AI is how, never the headline".** For this audience AI is the reason she came. The draft drops that rule. Everything else stays: no dashes, no colons in headlines, no hype words, no price, no invented reviews or numbers.
3. **The hours number.** The draft removes "You spend about 9 hours" from the free result and the page. It is a guess, and it was the claim most likely to feel misleading.
4. **The default tool.** When she answers "None yet", the plan names Claude's free version (changed from ChatGPT on your call). One tool, always named.
5. **Test or replace.** I recommend running the new hero as `?angle=new_to_ai` beside the current page first, since nothing has been sold yet.

## Part 1. The flow

### Quiz, about 2 minutes

| # | Now | Draft |
|---|---|---|
| 1 | What's your job, in your own words? | Same. New examples from outside the office (below). |
| 2 | (none) | **Do you work for yourself or for someone else?** Taps: For myself. For an employer. Both. |
| 3 | Walk us through a normal week. What eats your time? | Same. |
| 4 | What do you end up doing that isn't really your job? | Removed here. It moves to the optional At work part of the plan. |
| 5 | (none) | **How much have you used AI so far?** Taps: Never. Once or twice. Now and then. Most weeks. |
| 6 | Which AI tools do you use for work? | **Which AI tools have you tried?** Same chips. |
| 7 | What's your company's view on AI? | Same, but only shown when she works for an employer. |

New typed examples for question 1:

* "Receptionist at a dental office. Phones, scheduling, insurance and our Facebook page."
* "I own a hair salon with three stylists. I do the bookings, the orders and the Instagram."
* "Fourth grade teacher. Lesson plans, grading and a lot of emails to parents."
* "Real estate agent, on my own. Listings, showings and follow ups with buyers."
* "Office manager at a 30 person company. Invoices, supplies and everything nobody else does."

### Free result: her first win, already drafted

Now: a big hours number and her tasks in three piles, names only.

Draft: one task from her week, done for her on the spot.

How the task is picked, by rule:

1. It is about writing or planning, so a free chat tool can do it.
2. It needs no private details (no patient, student or client names).
3. She does it often.

What she sees, using the dental receptionist from the test:

> **Your first AI win**
> You said you spend time on appointment reminders. Here is one, written for a dental office:
>
> "Hi [first name], this is a reminder of your cleaning on [day] at [time] with Dr. [name]. Reply C to confirm or call us to move it. See you then!"
>
> AI wrote that from what you told us. Your plan shows you how to make it yourself, in your own words, in about 15 minutes.
>
> **Also in your plan** (titles only): Facebook posts for the office. Answers to common insurance questions. A script for no show calls. Five more.

Then the paywall, as today.

Cost note: this adds one short AI call per quiz taker, on top of the one that reads her answers.

### Paid plan, in order

1. **Your tool.** One free tool by name, why it fits her, and three steps to open it. Never "check which tool is approved" as step one.
2. **Your first win.** One task. The prompt with her details already filled in and a copy button. An example of a good answer. Three lines to send when the answer is off ("Shorter." "Warmer, like I'm texting a regular." "Give me three versions."). A Done mark.
3. **Ideas for your job.** Eight to ten uses, each with a prompt. At least half are things she did not name. Two are from daily life (meal plan, a hard message to a landlord).
4. **Safe use for your job.** What never to paste, in her terms (patient names, student records, client addresses). Tasks carry one of two marks: Safe today, or Check first. Check first only appears when she has an employer.
5. **Your seven days.** One small step a day, with a tick for each.
6. **At work.** Only when she has an employer. The message asking which tools are approved, the talk with her manager, and scripts for handing work back. This is where the current plan's politics live, as an extra and not the core.

### The seven days

| Day | Step |
|---|---|
| 1 | Your first win |
| 2 | Do it again with a real one from today |
| 3 | Teach it who you are (paste your work profile) |
| 4 | A second task from your ideas |
| 5 | One from daily life |
| 6 | Fix a bad answer |
| 7 | Pick the three you'll keep |

Each day is one email with one link. This needs the email service, which is not set up yet. Without it the seven days still work as a checklist on the plan page.

## Part 2. Landing copy, Now → Draft

### Hero

| | Now | Draft |
|---|---|---|
| Headline | You're not behind, you're just buried. | Everyone says use AI. Nobody shows you **where to start**. |
| Ad angle | (none) | New to AI? Start with **your own job**. |
| Ad angle | (none) | You don't need to be technical. You need **one good first try**. |
| Lead | Most of what keeps you late is busywork nobody notices. Tally builds you a plan to hand it to AI. | Tell Tally what you do all day. It shows you what AI can take off your plate, and walks you through the first one. |
| Button | Take the free quiz | Same |
| Under the button | See where your hours go. About 2 minutes. | See your first AI win. About 2 minutes. |
| Page title | Close the laptop at 5 | Start using AI in your own job |
| Search line | The late nights, the weekend emails, the feeling that you're always behind. See where your hours go with a free 2 minute quiz. | Curious about AI but not sure where to begin? Tell us your job and see your first AI win with a free 2 minute quiz. |
| Ad line | Win back your hours. Get the credit you've earned. | Everyone says use AI. Nobody shows you where to start. |

The words in bold are the underlined key phrase.

### Sound familiar?

| | Now | Draft |
|---|---|---|
| Line 1 | Every ask is small, so you say yes. | Everyone talks about AI like it's obvious. |
| Line 2 | Your own work waits until everyone's gone home, with ChatGPT open in a tab nobody sees. | You tried it once, got something bland, and closed the tab. |
| Ask 1 | Your manager: Can you take notes in the 2pm? You're so good at it. | Coworker: I just had ChatGPT write it. Took two minutes. |
| Ask 2 | Coworker: Jess is out today. Could you finish her slides before 4? | Group chat: Wait, you're not using AI for that? |
| Ask 3 | HR: Would you plan the holiday party again this year? | Newsletter: 50 prompts every professional needs. |
| Ask 4 | Director: New hire starts Monday. Can you show her the ropes? | Your sister: It planned our whole week of dinners. |
| Ask 5 | All hands: Everyone should be using AI by now. Guidelines to follow. | Same |
| Ask 6 | Reminders, overdue: Start the project you were hired for. | Reminders, overdue: Figure out this AI thing. |

### Running on empty

| | Now | Draft |
|---|---|---|
| Title | Running on empty | It's not you |
| Lead | Burnout doesn't arrive all at once. It builds from a hundred small asks. | Nobody was taught this. Most advice is written for people who already use it. |
| Card 1 | Overworked. Full days, and still your own work is waiting when everyone else logs off. Hours back every week, from your own numbers. | Not sure where to start. A blank box and a blinking cursor. One tool picked for you, and one first task from your own week. |
| Card 2 | Stressed. Always one ask away from the next one, with a head that won't switch off at night. Polite scripts to hand work back, without the awkward talk. | Worried you'll get it wrong. What's safe to type in, and what isn't? Plain rules for your job on what never to paste. |
| Card 3 | Burnt out. Tired in a way a weekend doesn't fix, while no one sees how much you carry. A plan that gets your work seen, so you can close the laptop at 5. | No time to learn it. Courses take weeks you don't have. One small step a day for seven days. |

### How it works

| | Now | Draft |
|---|---|---|
| 1 | Tell us about your week in your own words. | Tell us about your job and your week in your own words. |
| 2 | See how many hours go to work nobody notices. | See your first AI win, drafted for you. |
| 3 | Get your plan to win them back and turn them into credit. | Get your plan, with your tool, your prompts and your seven days. |

### What's in your plan

| Now | Draft |
|---|---|
| Work audit. Your tasks in three piles, with a polite script for each one that isn't really yours. | Your tool. One free AI tool, picked for you, and how to open it. |
| Hours back. The hours you win back each week, task by task, from your own numbers. | Your first win. One task from your week, with the prompt filled in and an example of a good answer. |
| AI setup. A ready to paste work profile for the AI tool you have, with safe use rules for your company's policy. | Ideas for your job. Eight or more things AI can do for you, each with a prompt ready to paste. |
| Busywork handoff. A ready prompt for each task AI can draft for you. | Safe use. Plain rules for your job on what never to type in. |
| Visibility plan. One project to put your time into, and a script for talking about your AI use with your manager. | Your seven days. One small step a day, so it sticks. |

### Questions

| Question | Now | Draft |
|---|---|---|
| Is this a course? | No, it's a personal plan built from your answers. | Same |
| Do I need to be technical? | (none) | No. If you can send a text, you can do this. |
| Do I need to pay for an AI tool? | (none) | No. Your plan starts with a free one. |
| Is it a subscription? | No. Paid once. | Same |
| My company restricts AI. Does this still work? | Yes. Your plan follows your company's rules and focuses on what you're allowed to do, plus handing work back and getting seen. | Yes. Your plan marks what's safe to do today and what to check first, and gives you the message to ask. |
| Do I need to share confidential information? | No. No need to name your company or colleagues. | Same |
| Why not just ask ChatGPT? | You'd need to know what to ask. This gives you a finished plan for your time and your credit in about ten minutes. | You can, once you know what to ask. Your plan gives you the first questions, written for your job, and shows you what a good answer looks like. |
| Can I get a refund? | [REFUND POLICY, Karl to confirm] | Still needs your answer before anything goes live. |

## What I have not checked

* "About 15 minutes" for the first win is a target, not a measurement. It appears once, on the free result. Time it with real women before it goes live.
* The key phrases "where to start" and "one good first try" have not been measured on a small phone.
* The lead headline is close to the existing `vague_policy` angle ("Everyone says use AI. Here's what you can actually do."). That angle should be retired when this one goes in.
* The name Tally hints at counting hours, which this version no longer does. Worth a thought, not a blocker.
* The hero phone animation and the small step drawings show hours and piles today. They need new screens to match; that is design work after the words are approved.

## Sound familiar, updated 2026-11-11

The first cases were about people talking about AI. Research showed the 2026 experience is that AI use is expected and judged without training, so the lines and five of the six asks were replaced (approved 2026-11-11). Sources: Pew, Americans and AI 2026; Lean In, AI gender gap, March 2026; CNBC and SurveyMonkey, Women at Work 2026; GoTo worker survey 2026; Highwire survey of managers; ZipRecruiter 2026 AI Worker Report; PwC Hopes and Fears 2026; SHRM Navigating AI in the Workplace 2026. No figures are used on the page.

Also changed that day on the beginner page: What's in your plan removed, How it works moved up to right after Sound familiar with fuller pictures, pictures added to the It's not you cards, and the first version's placeholder reviews shown until real ones exist.

## Sound familiar, changed again 2026-11-11

The day of asks was replaced the same evening by a before and after: the same free tool asked twice for a Facebook post, once the way most people ask and once the way the plan has her ask. Both answers are real output. The asks that came off the page, kept here in case they are wanted again:

* Your manager: Quick one before your review. What are you using AI for?
* Coworker: Did you write this yourself, or is it AI?
* HR: New on your self review. Describe how you used AI this year.
* Customer: ChatGPT says you're open till 6. Is that right?
* All hands: AI training is self paced. Link to follow.
* Reminders, overdue: Figure out this AI thing.

Their lines were "Somewhere in the last year, using AI went from optional to expected." and "Nobody showed you how."
