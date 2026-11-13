# Beginner quiz: fixes from Elmore's walkthrough (2026-11-13)

Quiz: `/begin`, `components/beginner/BeginnerQuiz.tsx`, copy in `lib/beginner/copy.ts` and `lib/beginner/types.ts`,
flow in `lib/beginner/quiz.ts`, AI prompts in `lib/beginner/questions-ai.ts`. Every copy line below waits for
Elmore's yes (Now → Draft). No database change: free text answers already fit in `intake.beginner.qas`.

## 1. Where are you with AI? Let her answer in her own words

* Add a fourth row, "Something else", that opens a text box (ChoiceStep gets the same Other field PickStep has).
* Her words go into the qas and every prompt. For branching she counts as "tried": she still sees the AI tools
  screen, and picking None yet there treats her as "not_yet".

## 2. Which would save you the most time? Never show a list of one

Cause: the screen shows only her picks from the screen before that AI can help with, plus what she typed. One
pick in, one option out.

* One option: skip the screen, that one is her answer.
* Two or more: show every pick she made (not only the ones flagged AI), plus Something else.

## 3. How do you picture AI helping? Make "no idea" a real answer

* A chip under the hint: "I have no idea yet". Tapping it saves that answer and moves on, and the plan
  writer is told she wants ideas. It replaces the Skip button.

## 4. Apps becomes software

* Title "What software do you use every week?" (Elmore's words).
* Call A asks for named software (Outlook, Excel, Google Drive, Shopify), never categories like "Email".
  The rule that leaves out email and spreadsheets goes.
* A fixed everyday set is always added after her job's picks, deduplicated: Outlook, Gmail, Excel,
  Google Sheets, Word, Google Drive, Teams, Zoom. Something else stays.
* Fallback list rewritten with named software.

## 5. Reading your week: a line that follows the quiz

* Staged lines while the final read runs, each one true to what is happening and ending where the result
  begins ("Your first AI win"): "Reading your answers", "Finding the easiest place to start", "Writing your
  first win".
* The wait before her AI questions: "Writing a few questions for your job" in place of "One moment".

## 6. New questions per group (groups to confirm)

* Everyone: "Where would you use AI most?" Phone, Computer, Both. Feeds the setup steps.
* New to AI (not_yet, tried): "What has held you back so far?" Pick all: I don't know where to start, I'm
  not sure it's safe, I worry it gets things wrong, No time to learn, It felt too technical, Something else.
* Already using it (uses): "What do you use it for today?" Pick all, chips written from her job by Call A,
  plus Something else.
* To keep the length, AI written questions go from 2 to 4 down to 2 to 3, and Call B is told not to repeat
  these.

## Checks

* `npm test` extended: stepsFor with the new screens, the one option skip, the level mapping.
* Walk all three levels plus Something else at 375px and 1440px with the stubbed read (no API spend), then
  one real run on 3201.
* Persona replay (`scripts/persona-runs.ts`, costs API money) only with Elmore's yes.
