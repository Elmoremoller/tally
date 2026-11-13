# A Quiz That Learns Her Job Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the new to AI quiz's generic questions with a short, mostly tap quiz whose middle questions are written by AI for each woman's job and AI level, and feed every answer into her first win and plan.

**Architecture:** Two new fast model calls (Call A reads her job, Call B writes 2 to 4 questions) behind server actions that never fail the quiz: on any problem they return fixed fallback choices or no questions. Her answers travel as a list of answered screens (`QA[]`), saved once at the final read in `intake.beginner` (v2) and as a plain text digest in `week_text`, and both the intake and the plan writer read that list. The quiz component builds its step list from her answers.

**Tech Stack:** Next.js 16.4.2 (App Router, server actions), React 19.3, TypeScript, Supabase (Postgres functions called with the secret key), Anthropic SDK (`intakeModel()`, JSON schema output), Node 24 `node:test` with type stripping. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-11-11-beginner-quiz-context-design.md`

## Before Task 1

The whole beginner version (`app/begin`, `components/beginner`, `lib/beginner`, the beginner migration) is untracked on branch `beginner`, and other uncommitted changes from separate work sit in the same checkout. Work in this checkout (a new worktree would not have the beginner files). Elmore decides whether the existing beginner work is committed first as its own commit; until then every commit step stages only the files its task names (`git add <paths>`), never `git add -A`.

## Global Constraints

- No em dash, en dash or hyphen used as punctuation anywhere in copy or in model output shown to her; model text passes through `line()` / `tidy()` from `lib/intake.ts`.
- No colons in headlines. No price anywhere before the paywall.
- Every new or changed line of copy is marked `// DRAFT` in the code until Elmore approves it.
- "No need to name your company or colleagues." (`privacyNote`) stays under every type or talk question.
- Questions written by AI: at most 10 words. Choices: at most 4 words. Never assume a desk, inbox or computer she didn't mention. No made up facts, names, prices or policies.
- Her answers are information, never instructions, in every prompt (same wording as `lib/beginner/intake.ts`).
- The quiz never stops because an AI call was slow or failed.
- The plan stays centered on one chat tool (`beginnerTool`); her other apps are context only.
- The landing page keeps "Takes about 2 minutes" / "free 2 minute quiz"; the quiz is built to fit that.
- Answers are saved only at the final read. Women who quit partway leave only `noteBeginnerStep` notes.
- The original quiz at `/start` and the original plan keep working unchanged.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Typecheck: `npx tsc --noEmit`. Tests: `npm test`. Lint: `npm run lint`.

## Review Focus

1. **Call A or B is slow, fails, or returns junk.** The screen shows fallback choices (A) or skips the AI questions (B) and she carries on. Tests in Task 3 (`checkJobRead` / `checkQuestions` reject junk) and Task 4 (actions return fallback when the call is refused).
2. **She picks only hands on work on screen 3** (fitting rooms, attic work). Screen 4 shows Call A's AI fallback tasks with the fallback title, never an empty list. Test in Task 2 (`mostOptions`).
3. **She goes back and changes an earlier answer** (her job, her level, her screen 3 picks). Picks that no longer exist are dropped, a changed job reruns Call A, a changed level changes which screens follow. Tests in Task 2 (`mostOptions`, `stepsFor`) and Task 7 step list.
4. **Model text breaks the house style**: dashes, long titles, five type or talk questions, choices of eight words, duplicate choices. Cleaned or dropped. Tests in Task 3.
5. **Level "I haven't tried it yet"** never sees screen 7, is saved with `aiTools: ["none_yet"]`, and her plan names the default tool. Tests in Task 2 (`stepsFor`) and Task 5 (`cleanAnswers`).

---

### Task 1: Test runner

**Files:**
- Create: `scripts/ts-resolve.mjs`, `scripts/register-ts.mjs`, `tests/smoke.test.ts`
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces: `npm test` runs every `tests/**/*.test.ts`, with extensionless relative imports resolving to `.ts` and `@/` resolving to the repo root.

- [ ] **Step 1: Write the failing smoke test** `tests/smoke.test.ts`: `hoursText(6.5) === "6.5 hours"` from `lib/week`, `resultCopy.line === "a week on work nobody notices."` from `lib/questions` (which imports `./week` without an extension), and `hasEmployer("self") === false` from `lib/beginner/types`.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL (no test script).
- [ ] **Step 3: Implement** `scripts/ts-resolve.mjs` (a `resolve` hook: `@/x` becomes `<root>/x`, then an extensionless relative specifier is retried as `.ts`, `.tsx`, then `/index.ts`), `scripts/register-ts.mjs` (`register()` of that hook via `node:module`), and `"test": "node --import ./scripts/register-ts.mjs --test \"tests/**/*.test.ts\""` in `package.json`.
- [ ] **Step 4: Run `npm test` and `npx tsc --noEmit`.** Expected: 3 passing, no type errors.
- [ ] **Step 5: Commit** `scripts/ts-resolve.mjs scripts/register-ts.mjs tests/smoke.test.ts package.json`: "Add a node:test runner".

### Task 2: The quiz's vocabulary, copy and pure helpers

**Files:**
- Create: `lib/beginner/quiz.ts`
- Modify: `lib/beginner/types.ts` (levels), `lib/beginner/copy.ts` (screen words, fallback lists, landing line)
- Test: `tests/beginner/quiz.test.ts`

**Interfaces:**
- Produces, in `lib/beginner/types.ts`: `EXPERIENCE = ["not_yet", "tried", "uses"] as const` (replaces the four values), `type Experience`, `experienceLabels` with the spec's labels: `not_yet: "I haven’t tried it yet"`, `tried: "I’ve tried it, but it didn’t stick"`, `uses: "I use it, but I could get more out of it"` (each `// DRAFT`). `BeginnerIntake` becomes `{ v: 2; worksFor; experience; qas: QA[]; mostWanted: string[]; firstWin; ideas; privateTasks }`.
- Produces, in `lib/beginner/quiz.ts`:
  - `type JobChoice = { label: string; ai: boolean }`
  - `type JobRead = { repeats: JobChoice[]; aiFallback: string[]; apps: string[]; worksFor: WorksFor | "unclear" }`
  - `type AskedKind = "one" | "many" | "text"`
  - `type AskedQuestion = { id: string; title: string; kind: AskedKind; choices: string[]; hint: string | null }`
  - `type QA = { id: string; title: string; picked: string[]; text: string | null }` (one answered screen; `id` matches `^[a-z0-9_]{1,20}$`)
  - `type QuizStep = "job" | "level" | "repeats" | "most" | "picture" | "apps" | "tools" | \`asked_${number}\` | "works_for" | "policy"`
  - `mostOptions(read: JobRead, picked: string[], typed: string | null): { options: string[]; fallback: boolean }`
  - `stepsFor(s: { level: Experience | null; askedCount: number | null; worksForFromJob: WorksFor | "unclear" | null; worksFor: WorksFor | null }): QuizStep[]`
  - `digest(qas: QA[]): string`
  - `cleanQAs(raw: unknown): QA[] | null`
  - `QAS_MAX = 12`, `PICKS_MAX = 8`, `PICK_MAX = 60`, `ASKED_ASSUMED = 3`
- Produces, in `lib/beginner/copy.ts` (all `// DRAFT`): `beginnerQuestions.level.title "Where are you with AI?"`, `repeats { title: "What do you do over and over, every day or every week?", hint: "Pick all that fit." }`, `most { title: "Which would save you the most time if it got easier?", hint: "Pick one or two.", fallbackTitle: "Which of these would help you most?", fallbackHint: "Things AI could help with in your job." }`, `picture { title: "How do you picture AI helping with it?", hint: "Any guess is fine.", skip: "Skip" }`, `apps { title: "Which apps do you use every week?", hint: "Pick all that fit." }`, `tools.title "Which AI have you used?"`, `somethingElse { label: "Something else", placeholder: "Type it here" }`, `waitLine "One moment"`, `FALLBACK_JOB_READ: JobRead` (repeats: 5 any job choices mixing hands on and AI helpable, like "Answering messages" ai true, "Helping people in person" ai false; aiFallback: 4; apps: 8 like "Texts", "Email", "WhatsApp", "Instagram", "Facebook", "Google Docs or Word", "Google Sheets or Excel", "Canva"; worksFor "unclear"), and `beginnerSteps[0]` becomes `"Tell us about your job and what you do over and over."`. The `week` entry of `beginnerQuestions` is removed.

- [ ] **Step 1: Write the failing tests** in `tests/beginner/quiz.test.ts`:
  - `mostOptions`: with repeats `[{label:"Writing quotes",ai:true},{label:"Attic work",ai:false}]`, picked `["Writing quotes","Attic work"]`, typed `null` → `{ options: ["Writing quotes"], fallback: false }`.
  - Only hands on picked (`["Attic work"]`) → `{ options: read.aiFallback, fallback: true }`.
  - A typed "Something else" (`"Chasing payments"`) is offered: picked `["Attic work"]`, typed `"Chasing payments"` → `{ options: ["Chasing payments"], fallback: false }`.
  - A pick no longer in `read.repeats` (she went back and Call A reran) is dropped.
  - `stepsFor({ level: "not_yet", askedCount: 2, worksForFromJob: "self", worksFor: "self" })` deep equals `["job","level","repeats","most","picture","apps","asked_1","asked_2"]`.
  - `stepsFor({ level: "uses", askedCount: null, worksForFromJob: "unclear", worksFor: "employer" })` deep equals `["job","level","repeats","most","picture","apps","tools","asked_1","asked_2","asked_3","works_for","policy"]` (`ASKED_ASSUMED` placeholders while Call B is pending).
  - `stepsFor` with `askedCount: 0` has no `asked_` steps; with `worksForFromJob: "employer"` has no `works_for` but has `policy`.
  - `digest([{id:"repeats",title:"What do you do over and over?",picked:["Writing quotes","Texting homeowners"],text:null},{id:"picture",title:"How do you picture AI helping with it?",picked:[],text:"Quotes from my notes"}])` equals `"What do you do over and over? Writing quotes, Texting homeowners\nHow do you picture AI helping with it? Quotes from my notes"`; a digest of long answers is at most `ANSWER_MAX` (1500) characters.
  - `cleanQAs`: drops picks over `PICK_MAX` characters, keeps at most `PICKS_MAX` picks and `QAS_MAX` screens, caps `text` at `ANSWER_MAX`, returns `null` for a bad `id` or a non array.
  - `experienceLabels.not_yet === "I haven’t tried it yet"`.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL (module not found).
- [ ] **Step 3: Implement** the types, labels and copy above, and the four helpers in `lib/beginner/quiz.ts`. `mostOptions` order: her AI helpable picks in screen 3 order, then her typed text; at most 6. `cleanQAs` uses `cleanText` from `lib/clean`. Fix every compile error the `Experience` change causes outside `BeginnerQuiz.tsx`, `app/begin/actions.ts`, `lib/beginner/intake.ts`, `lib/beginner/plan-writer.ts` and `lib/funnel-db.ts` (Tasks 5 to 7 rewrite those).
- [ ] **Step 4: Run `npm test`.** Expected: PASS.
- [ ] **Step 5: Commit** the files above: "Add the context quiz's words and helpers".

### Task 3: Calls A and B

**Files:**
- Create: `lib/beginner/questions-ai.ts`
- Test: `tests/beginner/questions-ai.test.ts`

**Interfaces:**
- Consumes: `JobRead`, `AskedQuestion`, `QA`, `Experience` (Task 2); `line`, `fenced`, `intakeModel` from `lib/intake.ts`.
- Produces:
  - `checkJobRead(raw: unknown): JobRead | null`
  - `checkQuestions(raw: unknown): AskedQuestion[]`
  - `readJob(job: string, opts: { allowCall: () => Promise<boolean>; timeoutMs?: number }): Promise<JobRead | null>` (default `timeoutMs` 8000; one attempt; `null` on refusal, timeout, error or a failed check; never throws)
  - `writeQuestions(input: { job: string; experience: Experience; qas: QA[]; mostWanted: string[] }, opts: { allowCall: () => Promise<boolean>; timeoutMs?: number }): Promise<AskedQuestion[]>` (default 9000; `[]` on any problem; never throws)
  - `JOB_PROMPT_VERSION = "beginner-job-v1"`, `QUESTIONS_PROMPT_VERSION = "beginner-questions-v1"`

- [ ] **Step 1: Write the failing tests:**
  - `checkJobRead` accepts 4 to 6 repeats, 3 to 4 aiFallback, 4 to 8 apps and a known `worksFor`; returns `null` for 3 repeats, a repeat without a boolean `ai`, or `worksFor: "freelance"`.
  - A repeat label `"Follow-ups — homeowners"` comes back as `"Follow ups, homeowners"`; a label over 4 words is dropped, and if that leaves fewer than 4 repeats the result is `null`. Duplicate labels (case insensitive) are kept once.
  - `checkQuestions` keeps at most 4, assigns ids `asked_1`.. in order, drops a title over 10 words or not ending in `?`, drops `one`/`many` questions with fewer than 3 or more than 6 choices, keeps only the first `text` question, forces `choices: []` on a `text` question, and returns `[]` when fewer than 2 survive.
  - A hint over 120 characters becomes `null`.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement** both checks, both prompts and both callers, following `readBeginnerIntake`'s client, `output_config` JSON schema and `fenced()` tags. Call A's input is her job only; its prompt asks for her repeated tasks including hands on ones, each marked whether a free chat assistant can help, 3 to 4 AI helpable tasks for her job as fallback, apps she likely uses weekly, and whether her job says she works for herself, an employer, both, or isn't clear. Call B's input is her job, level, every QA so far and her screen 4 picks; its prompt carries the spec's per level guidance (level 1 what held her back, level 2 what she tried and what happened, level 3 what she uses each tool for and what still feels slow, any level one question deeper on her screen 4 pick) and at most one type or talk question. Both prompts carry the Global Constraints' question rules and the house style block from `lib/beginner/intake.ts`.
- [ ] **Step 4: Run `npm test` and `npx tsc --noEmit`.** Expected: PASS, no type errors.
- [ ] **Step 5: Commit**: "Have AI read her job and write her questions".

### Task 4: Counting the calls, and the server actions

**Files:**
- Create: `supabase/migrations/20261112120000_beginner_questions.sql`, `app/begin/questions.ts`
- Modify: `lib/funnel-db.ts` (add `spendQuestionCall`)
- Test: `tests/beginner/question-actions.test.ts`

**Interfaces:**
- Consumes: `readJob`, `writeQuestions` (Task 3); `FALLBACK_JOB_READ` (Task 2); `allowAiCall`; `readSessionId`.
- Produces:
  - SQL: `sessions.question_calls smallint not null default 0 check (question_calls between 0 and 4)`; `public.use_question_call(p_session_id uuid) returns boolean` (increments when `status <> 'paid' and question_calls < 4`, returns `found`), revoked from `public, anon, authenticated` and granted to `service_role` like `use_intake_call`; the `intake.beginner` size check raised from 8000 to 24000 bytes (drop the old check by looking it up in `pg_constraint`, as `20261024140000_extra_work_and_ai_tools.sql` does). Safe to run again.
  - `spendQuestionCall(sessionId: string): Promise<boolean>` in `lib/funnel-db.ts`.
  - `"use server"` `readJobAction(job: string): Promise<{ read: JobRead; fallback: boolean }>` and `writeQuestionsAction(input: { job: string; experience: Experience; qas: QA[]; mostWanted: string[] }): Promise<AskedQuestion[]>`. Both clean their input (`cleanText`, `oneOf`, `cleanQAs`), use `allowCall = async () => (await spendQuestionCall(id)) && (await allowAiCall())`, return `{ read: FALLBACK_JOB_READ, fallback: true }` / `[]` when there is no session, the input is bad, the call returns nothing, or `process.env.BEGINNER_QUESTIONS_OFF === "1"` (a switch for testing both fallbacks in Task 8; leaves the final read alone), and never throw.
  - The pure decision is split out for testing: `export function jobReadOrFallback(read: JobRead | null): { read: JobRead; fallback: boolean }` in `lib/beginner/quiz.ts`.

- [ ] **Step 1: Write the failing tests:** `jobReadOrFallback(null)` deep equals `{ read: FALLBACK_JOB_READ, fallback: true }`; a valid read comes back with `fallback: false`; `readJob("Electrician", { allowCall: async () => false })` resolves to `null` without a network call; `writeQuestions(…, { allowCall: async () => false })` resolves to `[]`.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement** the migration, `spendQuestionCall`, `jobReadOrFallback` and the two actions.
- [ ] **Step 4: Run `npm test` and `npx tsc --noEmit`.** Expected: PASS.
- [ ] **Step 5: Commit**: "Count question calls and serve them to the quiz". Note in the commit body that both `20261110120000_beginner.sql` and this migration must run on the live database before the beginner quiz ships.

### Task 5: The final read and what gets saved

**Files:**
- Modify: `lib/beginner/intake.ts`, `app/begin/actions.ts`, `lib/funnel-db.ts` (`loadBeginnerPlanInput`)
- Test: `tests/beginner/intake.test.ts`, `tests/beginner/answers.test.ts`

**Interfaces:**
- Consumes: `QA`, `digest`, `cleanQAs`, `Experience` (Task 2).
- Produces:
  - `BeginnerIntakeInput = { job: string; qas: QA[]; mostWanted: string[]; worksFor: WorksFor; experience: Experience; aiTools: AiTool[]; aiToolsOther: string | null; aiPolicy: AiPolicy | null; followUp?: { question: string; answer: string } }`
  - `beginnerHers(input: BeginnerIntakeInput): string` = `plain` of job, every pick and typed text in `qas`, and the follow up answer.
  - `BeginnerStep` (in `app/begin/actions.ts`) becomes `QuizStep | "follow_up"`.
  - `BeginnerAnswers = { job: string; experience: Experience; qas: QA[]; mostWanted: string[]; worksFor: WorksFor; aiTools: AiTool[]; aiToolsOther: string | null; aiPolicy: AiPolicy | null }`
  - `export function cleanAnswers(answers: BeginnerAnswers): BeginnerAnswers | null` (exported for tests).
  - `readBeginner` keeps its signature and `BeginnerRead` result; `thin` now means "send her back to screen 3".

- [ ] **Step 1: Write the failing tests:**
  - `cleanAnswers` returns `null` when `qas` lacks a `repeats` screen with at least one pick or typed text, when `mostWanted` is empty or has more than 2 entries, or when an entry is over `PICK_MAX` characters. (The server can't see Call A's fallback list, so it checks only count and length.)
  - `cleanAnswers` with `experience: "not_yet"` and `aiTools: ["chatgpt"]` returns `aiTools: ["none_yet"]`, `aiToolsOther: null`.
  - `cleanAnswers` with `worksFor: "self"` returns `aiPolicy: null`; with `"employer"` and no policy returns `null`.
  - `checkBeginnerIntake` accepts a task whose quote is one of her screen 3 picks (checked against `beginnerHers`).
  - `describe` output (export it as `describeBeginnerIntake` for the test) contains each QA's title and answers inside `<answers>` tags and a line `What she most wants to make easier: Writing quotes`.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement.** In the intake prompt: replace "job and what eats her time in a normal week" with her job and her answers; the first win's task is one of her `mostWanted` whenever a chat tool can help and it needs no private details; add "Never state a fact about her workplace she didn't give, like discounts, perks, policies or procedures. Use square brackets instead."; the follow up question must not assume a desk, inbox or computer she didn't mention. Bump `BEGINNER_INTAKE_VERSION` to `"beginner-intake-v2"`. In `readBeginner`: save `week` as `digest(answers.qas)` through `saveAnswers`, and `saveBeginner` with `{ v: 2, worksFor, experience, qas, mostWanted, firstWin, ideas, privateTasks }`. `loadBeginnerPlanInput` reads `qas` and `mostWanted` from `intake.beginner` and throws `"Her answers are missing"` when `beginner.v !== 2`.
- [ ] **Step 4: Run `npm test` and `npx tsc --noEmit`.** Expected: PASS (the plan writer's input type errors are fixed in Task 6; if they block `tsc`, do Task 6 before running it).
- [ ] **Step 5: Commit**: "Read every quiz answer and save them at the end".

### Task 6: The plan writer

**Files:**
- Modify: `lib/beginner/plan-writer.ts`
- Test: `tests/beginner/plan-writer.test.ts`

**Interfaces:**
- Consumes: `QA`, `digest` (Task 2); `loadBeginnerPlanInput` output (Task 5).
- Produces: `BeginnerPlanInput` loses `week` and gains `qas: QA[]` and `mostWanted: string[]`. `checkBeginnerPlan` signature unchanged. New `export function nearSame(a: string, b: string): boolean`.

- [ ] **Step 1: Write the failing tests:**
  - `nearSame("Instagram captions for new arrivals", "Instagram posts for new arrivals") === true`; `nearSame("Window display theme ideas", "Vendor email about a late order") === false`. Rule: lower case word sets without `a an the for of to and my your`, a trailing `s` dropped from each word, Jaccard at least 0.6.
  - `checkBeginnerPlan` given ideas `"Instagram captions for new arrivals"` (a shown idea) and `"Instagram posts for new arrivals"` keeps only the shown title, and still requires `IDEAS_MIN` after the merge.
  - The prompt input (export `describeBeginnerPlan`) contains `<answers>` with every QA, and `What she most wants to make easier: …`.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL.
- [ ] **Step 3: Implement.** Prompt additions: open her plan (tool why and first win) by naming what she most wants to make easier, in her words; her apps are where the chat tool's results go ("write it here, paste it into Notion"), never something to learn on their own; "When one of her tasks and a shown idea are about the same thing, write one idea using the shown idea's exact title." In `checkBeginnerPlan`, skip an idea that is `nearSame` as one already kept, keeping shown titles over others (process shown titles first). Bump `BEGINNER_PLAN_VERSION` to `"beginner-plan-v2"`.
- [ ] **Step 4: Run `npm test` and `npx tsc --noEmit`.** Expected: PASS, no type errors anywhere except `components/beginner/BeginnerQuiz.tsx`.
- [ ] **Step 5: Commit**: "Write the plan from every answer and merge near duplicate ideas".

### Task 7: The quiz screens

**Files:**
- Create: `components/beginner/PickStep.tsx`
- Modify: `components/beginner/BeginnerQuiz.tsx`, `components/beginner/ChoiceStep.tsx` (accept plain string options), `components/quiz/ToolsStep.tsx` only if `askPolicy={false}` needs a change
- Test: `tests/beginner/quiz.test.ts` (step list cases already there); manual checks in Task 8

**Interfaces:**
- Consumes: everything above; `readJobAction`, `writeQuestionsAction` (Task 4); `readBeginner`, `noteBeginnerStep` (Task 5).
- Produces: `PickStep({ title, hint, options, picked, onPicked, many, other, onOther, onSubmit, error, headingRef })`: chips like `ToolsStep` (multi or single), a "Something else" chip that opens a text field with `MicButton`, `privacyNote` under the field, Continue enabled when at least one pick or non empty other text. Single pick mode moves on after `PICK_BEAT`.

- [ ] **Step 1: Implement `PickStep`** reusing `quiz-topics` / `quiz-topic` / `quiz-other` classes and `Dock`.
- [ ] **Step 2: Rewrite `BeginnerQuiz`'s state and step machine.** Steps come from `stepsFor` (recomputed each render). After screen 1 Continue: note the step, then start `readJobAction(job)` and keep its promise keyed by the job text (a changed job starts a new one; an unchanged job reuses it). Entering `repeats`: if the promise isn't settled, show `waitLine` with the spinner for at most 4000 ms, then use `FALLBACK_JOB_READ`. Screen 3 uses `read.repeats` labels; screen 4 uses `mostOptions` with `most.fallbackTitle` when `fallback`; screen 5 is `TextStep` with a Skip button; screen 6 uses `read.apps`; screen 7 is `ToolsStep` with `askPolicy={false}` and `title={beginnerQuestions.tools.title}`; after screen 6 or 7, call `writeQuestionsAction` showing `waitLine` until it returns (the server timeout caps it) and render each `AskedQuestion` with `ChoiceStep` (one), `PickStep` (many) or `TextStep` with Skip (text); `works_for` shows only when `read.worksFor === "unclear"` (otherwise `worksFor` is set from it); `policy` is a `ChoiceStep` over `AI_POLICIES` with `policyQuestion.title`; the last screen's Continue calls `read()`. Each answered screen is stored as a `QA` with its id, its shown title, picks and text. Going back keeps answers; when screen 3 picks change, `mostWanted` keeps only entries still in `mostOptions`. A `thin` result sends her to `repeats`. Progress uses `stepsFor(...).length + 1`. Every `asked_N` step is noted as `"asked"`, because `sessions.last_step` only allows `^[a-z_]{1,40}$` (no digits).
- [ ] **Step 3: Run `npx tsc --noEmit`, `npm run lint` and `npm test`.** Expected: all clean.
- [ ] **Step 4: Commit**: "Ask the context quiz one screen at a time".

### Task 8: Persona runs and a click through

**Files:**
- Create: `scripts/persona-runs.ts` (built from `docs/audit/2026-11-11-retail-runs.ts`), output `docs/audit/2026-11-12-context-runs.json`

**Interfaces:**
- Consumes: `readJob`, `writeQuestions`, `readBeginnerIntake`, `writeBeginnerPlan`, `mostOptions`, `digest`.

- [ ] **Step 1: Write `scripts/persona-runs.ts`.** Personas: Jess, Maya, Kayla (bios from the spec) and the five retail women (from `docs/audit/2026-11-11-retail-runs.ts`), each with a bio and a level. One more `intakeModel()` call, `answerAs(bio, question, choices)`, plays her for every screen: picks from the choices or writes a short answer in her voice. Flow per persona: `readJob` → answer screens 3 to 7 → `writeQuestions` → answer them → `readBeginnerIntake` → `writeBeginnerPlan`. Loads `.env.local` and runs with `node_modules/.bin/jiti`, as the retail script does.
- [ ] **Step 2: Run it.** Expected: every persona gets a first win and a plan, and `"written"` prints.
- [ ] **Step 3: Read the results** against the spec's bar: each plan names her screen 4 task, uses at least three details only she gave, assumes no desk for Kayla and the retail women, and invents no workplace facts (no prices, percentages or policies she didn't give). Fix prompts and rerun until all eight pass; bump the prompt versions if prompts change.
- [ ] **Step 4: Click through `/begin` on a phone size window** (375 by 812) on a production build (`npm run build && npm start`; the OneDrive folder makes `next dev` miss saves), for one woman of each level, both fallbacks (start with `BEGINNER_QUESTIONS_OFF=1` and confirm screen 3 shows the fallback list, screen 8 is skipped, and the quiz still reaches the first win), going back from screen 6 to screen 1 and changing the job, and a "for myself" job that skips both ending screens. Expected: no stuck screen, no empty choice list, the reading screen, then the first win.
- [ ] **Step 5: Commit** `scripts/persona-runs.ts docs/audit/2026-11-12-context-runs.json` and any prompt fixes: "Check the context quiz with eight made up women".
