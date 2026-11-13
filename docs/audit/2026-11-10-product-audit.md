# Tally: product audit and improvement strategy

Written 2026-11-10. Audited against the new goal: **women who want to start using AI and don't know where to begin**, in any occupation. Nothing in the product was changed.

Note: the brief arrived cut off at "6. Validate Your Recommendations. Don't rely". I read that as "don't rely on assumptions", so every main finding below was tested, and the limits of the testing are listed at the end.

## The verdict

The craft is good. The concept is unsettled. There are three different products in this folder, and none of them is yet the one the goal describes.

| Where | Who it speaks to | What it promises |
|---|---|---|
| Landing page and live quiz (`main`) | Office women buried in favors | Win back hours, get credit. AI is "the how, never the point" (a rule in the plan prompt) |
| `toolkit` branch (switched off) | Women in ecommerce | A toolkit of workflows for Shopify, Klaviyo and similar |
| The new goal | Women new to AI, any job | Understand AI, get started, build confidence |

A beginner who wants to learn AI lands on "You're not behind, you're just buried" and a page about burnout. AI appears once in the hero and then not again until the fourth screen. She would not recognise this as the product for her.

## How it was tested

1. Read the landing copy, quiz, both AI prompts, the checks in code, the plan page and the whole `toolkit` branch.
2. Ran six made up beginners through the **real** intake and plan writer (same models and prompts as production): a 4th grade teacher, a hospital nurse, a salon owner, a real estate agent, a dental receptionist, and a vague "office admin". Full outputs: `2026-11-10-persona-runs.json`.
3. Ran the same six through the toolkit branch's intake and selection rules.
4. Walked the live quiz on a 375px screen as the dental receptionist, to the paywall.
5. Measured word overlap between the six plans, section by section.
6. Asked a plain chat model the dental receptionist's question with no product around it, as the "why not just ask ChatGPT" baseline.

## What the tests showed

### 1. A true beginner hits a dead end (the biggest problem)

The likeliest beginner answers are "None yet" for tools and "No idea" or "Unclear" for company view. With those answers the plan is told **not to name a tool**. Four of six plans opened their AI setup with a version of "check which tool is approved first, then paste your profile into that one."

So her first step after paying $19.99 is to email IT and wait. There is no result in the first session. The plan also never says what a chat tool is, how to open one, where a prompt goes, what a good answer looks like, or what to type when the answer is off. It assumes the confidence the product is supposed to build.

### 2. The free chatbot answer beat the paid plan on "where do I start"

For the dental receptionist, the plain chat answer named three free tools, gave about 20 uses across every part of her job, four prompts, a five day starter plan and the privacy warnings. The paid plan gave two prompts and no tool.

The reason is a rule in the intake: only tasks she named, and everything from "not really my job" goes to Hand back. Her Facebook page, the task AI helps most with, got a script for giving it away and no AI help at all. A beginner cannot name what she doesn't know AI can do, so the product never does its main job: showing her the opportunities.

### 3. The frame breaks outside a corporate office

- **Salon owner:** told to "send the message in your plan first so you know what is approved for your salon", and given a script for telling her manager about her AI use. She is the owner.
- **Real estate agent (works for herself):** "Be open about using AI with your manager."
- **Dental receptionist:** answering phones and scheduling, 11 to 13 hours, filed under "Keep visible, work that builds your name".
- **Nurse:** charting, 5 hours, filed under "Hand to AI". Charting lives in a hospital record system and holds patient data. She will not get those hours back.

### 4. The hours number can't carry the weight it's given

- The hours are the model's guesses. She gave no numbers. The same answers produced 7.5, 5.5, 2.5, 1.5 in one run and 6, 5, 3, 2 in the next.
- The result says "You spend about 7 hours a week on work nobody notices", and the plan's "Hours back" then promises all 7, including insurance calls no AI can make.
- The toolkit branch already found this (it caps at 60% and its own review recommended 40%). The live product still claims 100%.

This is the most likely source of "I paid and felt misled".

### 5. Personalization: real in places, boilerplate in others

| Plan part | Word overlap between profiles | Reading |
|---|---|---|
| Prompts | 0.13 | Really different. The teacher got a rubric based grading prompt, the nurse got charting with identifiers removed |
| Project | 0.12 | Different, but always "write a one page summary and show your manager" |
| Work profile | 0.21 | Different facts, same skeleton |
| Ask what's approved | 0.21 | Template with her tasks dropped in |
| Safe use rules | 0.37 | Mostly the same five lines |

The strongest thing here is the safety sense: student names for the teacher, patient identifiers for the nurse, client financials for the agent. That is better than a generic prompt pack and worth keeping.

The weakness is volume and depth. A plan is 630 to 1,050 words with 1 to 4 prompts. The vague admin, after the one follow up the quiz allows, would still get one prompt. About half of every plan (hand back scripts, the visibility project, the manager talk) is workplace politics, not AI.

### 6. The toolkit branch does not travel

It is a better **format**: start with three, mark as done, steps checked on a date, AI already inside her tools. But its library and its 13 task tags are ecommerce only. Run on the six beginners it gave the teacher "Explain why sales moved last week" for grading, and the dental receptionist "A polite way to hand back the Instagram". Every new occupation would need its own hand written library, and tool menus go stale (the branch already had to patch Gemini's Gems). It is a sound product for one niche, not the engine for "any occupation".

## Landing page

- **Wrong promise for the goal.** Title "Close the laptop at 5", headline "you're just buried", share image "Win back your hours. Get the credit you've earned". Three promises, none about learning AI.
- **She can't see what she's buying.** The phone hero is text and dots only. "A plan" stays abstract until the fourth screen, about 3,600px down on a phone.
- **"Sound familiar?" is one life.** Notes in the 2pm, the holiday party, the all hands. A teacher, nurse or salon owner sees someone else.
- **No proof and no person.** No founder, no sample result, no guarantee. The reviews band is correctly hidden until real ones exist.
- **Placeholders show to buyers.** The paywall and FAQ print "[REFUND POLICY, Karl to confirm]". The support email is "[support email]". The legal pages carry [REVIEW] marks.
- **"Why not just ask ChatGPT?"** is answered in one line, and test 2 shows the honest answer today is weak.
- **Housekeeping:** the production build in `.next` is weeks old. `npm start` serves the old "Worth Her Time" page with stats and the price on it. Rebuild before anything goes live.
- Worth a screen reader check: the tool chips showed up to the accessibility tree as "checkbox on" and the company view options as unnamed buttons.

## The quiz

- Three typed answers on a phone, from an ad, before any value. The mic helps.
- "What eats your time?" asks a beginner to do the analysis the product should do for her.
- Nothing asks whether she has ever used AI, what she's nervous about, whether she works for herself, or anything about life outside work (the goal names daily life and personal needs).
- "What's your company's view on AI?" has no answer for the self employed.
- The sliders ask her to confirm guessed hours, which makes the guess feel like her own number.

## What to keep

- Her own words in, with the quote check that drops anything she didn't say.
- The privacy and safety sense per occupation.
- The mobile craft, the mic, the one page flow, the code that holds the model to rules.
- From the toolkit branch: start with three, mark as done, dated step checks, fill your details once.

## The strategy

**Change the unit of value from "a plan to read" to "a first result in 15 minutes, then a short path".**

1. **Pick the audience and say it.** Women new to AI, sold by occupation. The plan writer already adapts across jobs (test 5), so this can launch with ad angles for four or five occupations and no library.
2. **Make the free result a real output, not an hours number.** After the quiz, draft one small thing for her actual job on the spot (her reminder text, her parent email). One fast model call. She sees what AI does for her before she pays, which is the strongest answer to "why not ChatGPT". It also removes the weakest claim on the site.
3. **Never make her wait for permission.** Always name one tool. Split her tasks into "safe to start today" (no private data: templates, explanations, drafts from scratch) and "check first". Company rules become a side note, not a gate.
4. **A guided first win.** One task, her details already filled in, a button that opens the tool with the prompt in place, a picture of a good result, and three "if it's off, say this" lines. (The prefilled link needs checking per tool before it is promised.)
5. **Show her what she didn't know to ask.** A section of AI uses for her job beyond what she named, clearly marked as ideas. Drop the "only tasks she named" rule for this section only.
6. **A seven day path with progress.** One small win a day, by email, with "done" marks. This needs the email service that launch needs anyway.
7. **Shrink the politics.** Hand back scripts, the visibility project and the manager talk become an optional "At work" part, shown only to employees who named extra work.
8. **Honest time.** Either drop hours or state a modest range with the reason.
9. **New quiz questions, fewer typed ones.** Job (chips plus free text), used AI before (never, tried it, use it weekly), employed or work for yourself, what she wants first. One typed question about her week.

**Park the toolkit branch** as a later ecommerce edition. Take its page mechanics, not its library.

## Before building any of it

Nothing has been sold yet: no deploy, no email service, no refund policy, no real buyer. The largest risk is building a third version before learning from a first.

- Use the existing `?angle=` switch to run a beginner headline against the current one and compare quiz starts, finishes and paywall taps in the events table.
- Hand five real women in the target group their result and watch the first session.
- Fill the blanks: refund policy, support email, legal review, email service.

## Limits of this audit

- Six invented profiles, one run each. Real answers will be messier and shorter.
- The baseline was a Claude model, not a free ChatGPT account.
- No purchase, email or plan page was tested end to end this time. The plan content was read as data.
- One test quiz session was written to the live database (dental receptionist, no purchase).
- Conversion and demand are untested by anyone. Those are judgments, not findings.
