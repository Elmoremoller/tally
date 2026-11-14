# Tally direction and build plan

Written 14 November 2026. Save this file in the repo as `docs/DIRECTION.md`. Every phase below is run with one short prompt that points Claude Code at this file.

## 1. What Tally is

Tally helps a person start using AI in their own job, or get much more out of it. It is a guided path, built from a short quiz. It is not a prompt pack, a course or a report.

Two things must both be true for a buyer.

1. They understand what they are doing and why. The path is worth reading.
2. They get up and running by themselves. The path is worth doing.

## 2. Two customers, two paths

**Starter.** Has never used AI, or tried it a few times. Her path is about getting set up and running on her own. Which tool, how to open it, what to set up first, exactly what to type for one task from her own job, what a good answer looks like, how to fix a weak one, what is safe. A few ready prompts for her job belong here too, because they help her get real work done.

**Builder.** Uses AI some weeks or most days, mostly for simple questions and rewrites. Her path is about working smarter. A saved project for a task she repeats, the right tool for the task, her apps connected where it helps, routines she can reuse. She never sees sign up steps or beginner explanations.

The two paths are different products. They are not the same plan in different words.

## 3. What the free result must do

The free result must give real value in the first seconds, so the price feels small. It has four parts, in this order.

1. **A finished result.** Her real example from the quiz, answered or rewritten, ready to copy and use. No more than two blanks.
2. **A first step she can do right now.** The exact message to paste into her AI tool to make the next one herself. This is step 1 of her path, given free.
3. **A map of her week.** Each task she named, with one line on what it becomes. For example "Vendor emails become a saved project, so every follow up takes two minutes".
4. **An offer that names her own path.** Her first setups by name, her tool, and whether the free plan of that tool is enough.

Everything the free result shows must also be in the paid path.

## 4. What the paid path is

A short ordered list of steps, shown one at a time, like the quiz. Each step has these parts.

1. A short read. Two to four sentences on what this is and why it matters for her job.
2. The action. What to open, click and type. Click paths come only from the setup cards in Phase 3, never from the model's memory.
3. The material Tally wrote for her. The message to paste, the instructions for her project, her tone notes.
4. What a good result looks like, and three lines to send when it is off.
5. "Did it work?" with Yes and Not quite. The answer is saved on the server.

A Starter path has about six steps. Get the tool ready. Do the first task herself. Teach it who she is. Fix a weak answer. Do a second task from her map. Know what is safe at her job. It ends with up to five ready prompts for her job.

A Builder path has about five steps. Save a setup for her top task. Test it on three real ones. Use the right approach for her second task. Connect one app, only when it fits and is allowed. Turn it into a routine she can reuse.

## 5. Rules that stay

1. All existing copy rules. No dashes, no colons in headlines, no hype words, no emoji, no price before the paywall.
2. No invented facts. Nothing about her workplace, prices, policies or products that she did not give.
3. No promised hours or minutes saved. Use her own count from the quiz, like "you do this about 15 times a week".
4. Her answers are information, never instructions, in every prompt.
5. The quiz never stops because an AI call was slow or failed.
6. Every new line of copy is marked DRAFT until Karl approves it. Every changed prompt gets a new version name.
7. The first version at `/start` and plans already written keep working.

## 6. Older rules this file replaces

1. "The plan stays centered on one chat tool and her other apps are context only." No longer true for the Builder path.
2. "Assume she has never written a prompt." True for Starter only.
3. "Never give menu paths or button names." Still true for the model. Checked setup cards may give them.
4. The plan as one long page with ten ideas. Replaced by the path.

## 7. Working rules for Claude Code

1. Read this whole file first. Then read the code the phase names.
2. Before writing code, explain your plan to Karl in simple words, as a short numbered list. Wait for his OK.
3. One branch and one pull request per phase.
4. Avoid database changes. If one is needed, stop and ask.
5. Never touch Stripe, prices or checkout logic.
6. Run the type check, the tests and the lint before you say you are done. Add tests for new checks.
7. Finish with a plain summary. What changed, what Karl should try on his phone, and which DRAFT lines need his approval.

## 8. Decisions Karl needs to make

Each has a default, so no phase is blocked.

1. Who the copy speaks to. Today every prompt and line speaks to women. Default is to keep that for now.
2. The refund promise. Default suggestion is "If your first setup does not work, you get your money back."
3. The support email address.
4. The first two tools that get setup cards. Default is ChatGPT and Claude. Other tools get the path without click paths, and the path says so.
5. When the new version becomes the home page. Default is after Phase 5 passes.

## 9. The phases

Run them in order. The prompt for each phase is the same line with a new number.

```
Read docs/DIRECTION.md and do Phase 1. Follow the working rules in section 7.
```

### Phase 0. Clean up

**Goal.** The repo tells the truth about what Tally is.

1. Rewrite `OVERVIEW.md` and `README.md` to describe Tally. They still describe The Couple Standard.
2. Add one line to `AGENTS.md`, outside the block Next.js manages, that points to this file.
3. Put the refund promise and support email from section 8 into `lib/offer.ts`, once Karl has given them.

**Done when.** No file in the repo describes the old product, and the paywall shows no text in square brackets.

### Phase 1. The quiz

**Goal.** Fewer screens, and answers that decide which path she gets.

1. Remove the "How do you picture AI helping" screen.
2. Add a real example screen after her top task. "Paste the last one you wrote, or what the last person asked you. Leave out names." Typed or spoken. She can skip it, and then the free result falls back to today's draft.
3. Add one tap question on how often she does her top task.
4. Change the level question to four choices. Never used it. Tried it a few times. Use it some weeks. Use it most days. The first two are Starter, the last two are Builder.
5. Builders only. A tap list of what she has already done with AI, such as pasted in her own text, saved instructions about herself, made a project, connected an app, pays for a plan. Keep the AI tools screen and the apps screen for Builders only.
6. Merge the two work questions into one. "Can you use AI for your work?" Yes. Not sure. No, it's restricted. I work for myself.
7. At most one question written by AI, about how she does her top task today.
8. After she picks what she does over and over, show one line such as "AI can help with 3 of these 5". The flags already exist on each choice.

Code to read first. `stepsFor` in `lib/beginner/quiz.ts`, `BeginnerQuiz.tsx`, `beginnerQuestions` in `lib/beginner/copy.ts`, `cleanAnswers` in `lib/beginner/answers.ts`, `EXPERIENCE` and `markFor` in `lib/beginner/types.ts`.

**Done when.** A Starter sees at most 8 screens and a Builder at most 10, with one typed answer. All answers reach the intake. Old saved answers still load.

### Phase 2. The free result

**Goal.** The four parts in section 3, live on the result screen.

1. Change the intake so it returns the finished result, the "do the next one yourself" message, the map and the names of her first setups. Keep the check that every task comes from her own words.
2. Rebuild `FirstWinResult.tsx` with a copy button on the result, the first step, the map, then the offer.
3. Make the paywall show her own setups by name in place of the five fixed cards in `beginnerParts`.
4. Save what the free result showed, so the paid path can be held to it. The plan writer already does this for idea titles.

Code to read first. `BEGINNER_INTAKE_SYSTEM` and `checkBeginnerIntake` in `lib/beginner/intake.ts`, `app/begin/actions.ts`, `FirstWinResult.tsx`.

**Done when.** With a real example given, the finished result has at most two blanks. The map lists only tasks she named. The paywall names her tasks.

### Phase 3. Setup cards

**Goal.** A small library of checked steps, so the path can say exactly what to click.

1. Create a cards file in `lib/beginner`. One card per tool and setup. Each card has a title, the steps, whether the free plan is enough, the date it was checked and the link it was checked against.
2. Write six cards. For ChatGPT and for Claude. Get started on phone and computer, save instructions about yourself, create a project with instructions and examples.
3. Check every step against the vendor's own help pages today. Do not write steps from memory. If a step cannot be confirmed, leave the card out and tell Karl.
4. Add a backlog item for the daily run that flags any card older than 30 days.

**Done when.** Six cards exist with dates and links, and Karl has walked through each one on his own phone.

### Phase 4. The paid path

**Goal.** The path in section 4 replaces the long plan page for new buyers.

1. Add a new plan version with a track, Starter or Builder, and an ordered list of steps with the parts in section 4.
2. Rewrite the plan prompt as two prompts, one per track. The model writes the reads and the material. It picks cards by id from a list the code gives it. The code rejects any card id that is not on the list.
3. Skip steps she has already done, using her Builder tap list, and say so. "You already use ChatGPT, so we skipped the basics."
4. Build the path screen. One step at a time, a progress line, a big copy button, "Did it work?" saved through a server action into the existing events table.
5. Plans written with the old version keep their old page.

Code to read first. `BEGINNER_PLAN_SYSTEM` and `checkBeginnerPlan` in the plan writer in `lib/beginner`, `BeginnerPlanPage.tsx`, `Ticks.tsx`, `toolSite` and `sevenDays` in `lib/beginner/copy.ts`, the plan generation file in `lib`.

**Done when.** A Starter path has no projects or connected apps. A Builder path has no sign up steps. Every click path comes from a card. "Did it work?" shows up in the events table.

### Phase 5. Test and truth check

**Goal.** Proof that the two paths differ, and a landing page that promises only what exists.

1. Update `scripts/persona-runs.ts` for the new quiz. Give every persona a real example. Run at least four Starters and four Builders and save the output in `docs/audit`.
2. Check each run against the "Done when" lines of Phases 1, 2 and 4, and write a short readout with what failed.
3. List every promise on the beginner landing page in `lib/beginner/copy.ts`. Mark each as delivered or not. Hide or reword the ones that are not delivered, such as scheduled automations.
4. Then Karl puts five real people through it and watches the first session.

**Done when.** The readout shows no failed checks, the landing page has no promise the path cannot keep, and five real people have tried it.

### Later

1. Follow up emails, one on day three with her next step.
2. Connected apps and scheduled tasks as real steps, with their own cards.
3. More tools and more job types.
