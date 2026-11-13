"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type SetStateAction } from "react";
import { noteBeginnerStep, readBeginner, type BeginnerAnswers, type BeginnerRead } from "@/app/begin/actions";
import { readJobAction, writeQuestionsAction } from "@/app/begin/questions";
import { Backdrop } from "@/components/Backdrop";
import { ArrowLeft, Check } from "@/components/icons";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { TextStep } from "@/components/quiz/TextStep";
import { ToolsStep } from "@/components/quiz/ToolsStep";
import { beginnerQuestions as questions } from "@/lib/beginner/copy";
import {
  experienceFor,
  jobReadOrFallback,
  mostOptions,
  skipsMost,
  softwareOptions,
  stepsFor,
  type AskedQuestion,
  type JobRead,
  type QA,
  type QuizStep,
} from "@/lib/beginner/quiz";
import {
  aiUses as aiUsesCopy,
  DEVICES,
  deviceQuestion,
  heldBack,
  levelOther as levelOtherCopy,
  pictureNoIdea,
  questionsWait,
  readingLines,
  thinAnswers,
  type Device,
} from "@/lib/beginner/quiz-copy";
import {
  EXPERIENCE,
  experienceLabels,
  hasEmployer,
  WORKS_FOR,
  worksForLabels,
  type Experience,
  type WorksFor,
} from "@/lib/beginner/types";
import { followUpCopy, policyQuestion, quizErrors } from "@/lib/questions";
import { AI_POLICIES, AI_TOOLS, policyLabels, toolLabels, type AiPolicy, type AiTool } from "@/lib/week";
import { ChoiceStep } from "./ChoiceStep";
import { BeginnerPaywall, FirstWinResult } from "./FirstWinResult";
import { PICK_BEAT, PickStep } from "./PickStep";

// The beginner quiz, one screen at a time, in the order stepsFor gives (lib/beginner/quiz.ts): her job, where
// she is with AI (or her own words for it), what has held her back (unless she already uses AI), what she does
// over and over, which of those would save her the most time (unless that is only one), how she pictures AI
// helping, her software, the AI she has used (unless she hasn't tried it), what she uses it for (when she
// does), phone or computer, two or three questions the AI writes for her, who she works for (unless her job
// said) and her company's view on AI (when she has an employer). The AI reads her job while she answers the
// screens before what she does over and over, and writes her questions after phone or computer; when either is
// slow or fails, the quiz carries on with the fixed lists or without those questions. Then the final read
// drafts her first win while lines on what is happening show in turn; if her answers were too thin it asks one
// follow up, once. Then her first win and the paywall. Built like components/quiz/Quiz.tsx.

const READING_MIN = 1200;
/** How long each line shows while her answers are read, before the next one. The last one stays. */
const READING_LINE_MS = 2400;
/** How long screen 3 waits for the read of her job before it uses the fixed list. */
const JOB_READ_WAIT = 4000;
/** How long the quiz waits for her questions before it goes on without them. */
const QUESTIONS_WAIT = 12000;
/** She picks one or two things she'd most like to make easier. */
const MOST_WANTED_MAX = 2;

type Phase = "questions" | "waiting" | "reading" | "follow-up" | "result";
type Win = NonNullable<Extract<BeginnerRead, { ok: true }>["win"]>;
type Read = { read: JobRead; fallback: boolean };
/** A read of her job on its way, kept for the job text it was asked about. */
type JobCall = { job: string; promise: Promise<Read>; result: Read | null };
/** Her taps on a chips screen, and her words under Something else (null while that is off). */
type Picks = { picked: string[]; other: string | null };
/** The answers that decide which screens come next, with any she has just tapped. */
type Snapshot = {
  level: Experience | null;
  worksFor: WorksFor | null;
  policy: AiPolicy | null;
  askedCount: number | null;
  device: Device | null;
  /** True when she tapped I have no idea yet on the picture screen. */
  noIdea: boolean;
  /**
   * The type or talk screen she has just skipped. Its words count as cleared in this click, since clearing
   * them in state only lands on the next render, after the final read may already have been sent.
   */
  skipped?: string;
};

const NO_PICKS: Picks = { picked: [], other: null };

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** A one tap screen as an answered screen: every choice it showed, and hers. */
const choiceQA = <T extends string>(id: string, title: string, options: readonly T[], labels: Record<T, string>, value: T): QA => ({
  id,
  title,
  picked: [labels[value]],
  text: null,
  shown: options.map((o) => labels[o]),
});

/** Her answers as Call B gets them, with her words on screen 5 left out, so editing them alone writes no new questions. */
const questionsKey = (input: { qas: QA[] }) =>
  JSON.stringify({ ...input, qas: input.qas.map((qa) => (qa.id === "picture" ? { ...qa, text: null } : qa)) });

/** A chips screen as an answered screen: what it showed, what she tapped and what she wrote. */
const pickedQA = (id: string, title: string, shown: readonly string[], picks: Picks): QA => ({
  id,
  title,
  picked: picks.picked,
  text: picks.other?.trim() || null,
  shown: [...shown],
});

export function BeginnerQuiz({ home }: { home: string }) {
  const [step, setStep] = useState<QuizStep>("job");
  const [phase, setPhase] = useState<Phase>("questions");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [job, setJob] = useState("");
  const [level, setLevel] = useState<Experience | null>(null);
  /** Her own words on Where are you with AI: null while that row is off. */
  const [levelText, setLevelText] = useState<string | null>(null);
  const [held, setHeld] = useState<Picks>(NO_PICKS);
  const [jobRead, setJobRead] = useState<(Read & { job: string }) | null>(null);
  const [repeats, setRepeats] = useState<Picks>(NO_PICKS);
  const [mostWanted, setMostWanted] = useState<string[]>([]);
  const [mostOther, setMostOther] = useState<string | null>(null);
  const [picture, setPicture] = useState("");
  const [noIdea, setNoIdea] = useState(false);
  const [apps, setApps] = useState<Picks>(NO_PICKS);
  const [tools, setTools] = useState<AiTool[]>([]);
  const [otherTools, setOtherTools] = useState("");
  const [uses, setUses] = useState<Picks>(NO_PICKS);
  const [device, setDevice] = useState<Device | null>(null);
  const [asked, setAsked] = useState<{ key: string; questions: AskedQuestion[] } | null>(null);
  const [askedPicks, setAskedPicks] = useState<Record<string, Picks>>({});
  const [askedText, setAskedText] = useState<Record<string, string>>({});
  const [worksFor, setWorksFor] = useState<WorksFor | null>(null);
  const [policy, setPolicy] = useState<AiPolicy | null>(null);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [win, setWin] = useState<Win | null>(null);
  const [error, setError] = useState("");
  const [waitFor, setWaitFor] = useState<"job" | "questions">("job");
  const [readingAt, setReadingAt] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const notes = useRef<Promise<void>>(Promise.resolve());
  /** Counts each wait and read, so one she has left by going back is ignored when it ends. */
  const pending = useRef(0);
  const beat = useRef<number | undefined>(undefined);
  const jobCall = useRef<JobCall | null>(null);
  const lastRead = useRef<{ key: string; result: BeginnerRead } | null>(null);
  /** Her questions on their way, kept for the answers they were asked from, so going back and on again waits for the same call. */
  const questionsCall = useRef<{ key: string; promise: Promise<AskedQuestion[]> } | null>(null);

  useEffect(() => {
    if (moved.current) headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [step, phase]);

  // While her answers are read, the line moves on every little while and stays on the last one.
  useEffect(() => {
    if (phase !== "reading") return;
    setReadingAt(0);
    const timer = window.setInterval(
      () => setReadingAt((at) => Math.min(at + 1, readingLines.length - 1)),
      READING_LINE_MS,
    );
    return () => window.clearInterval(timer);
  }, [phase]);

  const now: Snapshot = { level, worksFor, policy, askedCount: asked ? asked.questions.length : null, device, noIdea };
  const fromJob = jobRead && jobRead.read.worksFor !== "unclear" ? jobRead.read.worksFor : null;
  const most = jobRead ? mostOptions(jobRead.read, repeats.picked, repeats.other) : { options: [], fallback: false };
  const skipMost = skipsMost(most);
  const stepsWith = (s: Snapshot) =>
    stepsFor({
      level: s.level,
      askedCount: s.askedCount,
      worksForFromJob: jobRead?.read.worksFor ?? null,
      worksFor: s.worksFor,
      skipMost,
    });
  const steps = stepsWith(now);
  const mostTyped = mostOther?.trim() || null;
  // A list of one is her answer without asking. Otherwise changing her picks on the repeats screen keeps only
  // the most wanted picks still offered, and her own words there count as one of her two.
  const wanted = skipMost
    ? most.options
    : [...mostWanted.filter((m) => most.options.includes(m)), ...(mostTyped && !most.options.includes(mostTyped) ? [mostTyped] : [])].slice(
        0,
        MOST_WANTED_MAX,
      );
  const ownWords = Boolean(levelText?.trim());
  const software = jobRead ? softwareOptions(jobRead.read) : [];
  /** Her level for the AI: her own words count as tried, unless she then picked None yet. */
  const experienceOf = (s: Snapshot) => (s.level ? experienceFor(s.level, ownWords, tools) : null);

  /**
   * The screens before the AI's questions, in order: her level, then screens 3 to 6, then the AI she has used when
   * she was asked. Screens 3 and 4 are always there: the first win is found through them.
   */
  const baseQas = (s: Snapshot): QA[] =>
    jobRead && s.level
      ? [
          ownWords
            ? {
                id: "level",
                title: questions.level.title,
                picked: [],
                text: levelText?.trim() || null,
                shown: EXPERIENCE.map((e) => experienceLabels[e]),
              }
            : choiceQA("level", questions.level.title, EXPERIENCE, experienceLabels, s.level),
          ...(s.level === "uses" ? [] : [pickedQA("held_back", heldBack.title, heldBack.choices, held)]),
          pickedQA("repeats", questions.repeats.title, jobRead.read.repeats.map((r) => r.label), repeats),
          {
            id: "most",
            title: most.fallback ? questions.most.fallbackTitle : questions.most.title,
            picked: wanted,
            text: null,
            shown: most.options,
          },
          {
            id: "picture",
            title: questions.picture.title,
            picked: s.noIdea ? [pictureNoIdea.chip] : [],
            text: s.noIdea || s.skipped === "picture" ? null : picture.trim() || null,
            ...(s.noIdea ? { shown: [pictureNoIdea.chip] } : {}),
          },
          pickedQA("apps", questions.apps.title, software, apps),
          ...(s.level === "not_yet"
            ? []
            : [
                pickedQA(
                  "tools",
                  questions.tools.title,
                  AI_TOOLS.map((t) => toolLabels[t]),
                  { picked: tools.map((t) => toolLabels[t]), other: tools.includes("other") ? otherTools : null },
                ),
              ]),
          ...(s.level === "uses" ? [pickedQA("ai_uses", aiUsesCopy.title, jobRead.read.aiUses, uses)] : []),
          ...(s.device ? [choiceQA("device", deviceQuestion.title, DEVICES, deviceQuestion.labels, s.device)] : []),
        ]
      : [];
  /** The screens after the AI's questions, when she was shown them: who she works for, and her company's view. */
  const workQas = (s: Snapshot, who: WorksFor): QA[] => [
    ...(fromJob ? [] : [choiceQA("works_for", questions.worksFor.title, WORKS_FOR, worksForLabels, who)]),
    ...(hasEmployer(who) && s.policy ? [choiceQA("policy", policyQuestion.title, AI_POLICIES, policyLabels, s.policy)] : []),
  ];
  const askedQas = (s: Snapshot): QA[] =>
    (asked?.questions ?? []).map((q) =>
      q.kind === "text"
        ? { id: q.id, title: q.title, picked: [], text: s.skipped === q.id ? null : askedText[q.id]?.trim() || null }
        : pickedQA(q.id, q.title, q.choices, askedPicks[q.id] ?? NO_PICKS),
    );

  const show = (next: Phase, to: QuizStep = step, way: "forward" | "back" = "forward") => {
    moved.current = true;
    setDirection(way);
    setStep(to);
    setPhase(next);
  };

  const note = (name: QuizStep) => {
    notes.current = notes.current.then(() => noteBeginnerStep(name)).catch(() => {});
  };

  /** Starts reading her job once her session is noted. The same job text keeps the read already on its way. */
  const startJobRead = (text: string) => {
    if (jobCall.current?.job === text) return;
    const call: JobCall = { job: text, promise: Promise.resolve(jobReadOrFallback(null)), result: null };
    call.promise = notes.current
      .then(() => readJobAction(text))
      .catch(() => jobReadOrFallback(null))
      .then((result) => {
        call.result = result;
        return result;
      });
    jobCall.current = call;
  };

  /** The read her screens use from now on. Picks that aren't on its screens any more are dropped. */
  const keepRead = (text: string, result: Read) => {
    const labels = result.read.repeats.map((r) => r.label);
    const names = softwareOptions(result.read);
    setRepeats((p) => ({ ...p, picked: p.picked.filter((l) => labels.includes(l)) }));
    setApps((p) => ({ ...p, picked: p.picked.filter((a) => names.includes(a)) }));
    setUses((p) => ({ ...p, picked: p.picked.filter((u) => result.read.aiUses.includes(u)) }));
    setJobRead({ job: text, ...result });
  };

  /** The repeats screen needs the read of her job: wait a short while for it, then go on with the fixed list. */
  const toRepeats = async (from: QuizStep) => {
    const text = job.trim();
    if (jobRead?.job === text) return show("questions", "repeats");
    startJobRead(text);
    const call = jobCall.current;
    if (!call) return;
    let result = call.result;
    if (!result) {
      const ticket = ++pending.current;
      setWaitFor("job");
      show("waiting", from);
      result = await Promise.race([call.promise, wait(JOB_READ_WAIT).then(() => null)]);
      if (ticket !== pending.current) return;
    }
    keepRead(text, result ?? jobReadOrFallback(null));
    show("questions", "repeats");
  };

  /** Has the AI write her questions from what she has said so far, unless it already has for the same answers. */
  const toAsked = async (from: QuizStep, s: Snapshot) => {
    const experience = experienceOf(s);
    if (!experience) return;
    const input = { job: job.trim(), experience, qas: baseQas(s), mostWanted: wanted };
    const key = questionsKey(input);
    let written = asked?.key === key ? asked.questions : null;
    if (!written) {
      // A call already on its way for the same answers is waited for, not asked again.
      if (questionsCall.current?.key !== key) {
        const promise = Promise.race([
          notes.current.then(() => writeQuestionsAction(input)).catch((): AskedQuestion[] => []),
          wait(QUESTIONS_WAIT).then((): AskedQuestion[] => []),
        ]);
        questionsCall.current = { key, promise };
      }
      const call = questionsCall.current;
      const ticket = ++pending.current;
      setWaitFor("questions");
      show("waiting", from);
      const fresh = await call.promise;
      if (ticket !== pending.current) return;
      if (fresh.length || !asked?.questions.length) {
        written = fresh;
        setAskedPicks({});
        setAskedText({});
      } else {
        // No new questions: the ones she has already seen stay, with her answers to them.
        written = asked.questions;
      }
      setAsked({ key, questions: written });
    }
    moveOn(from, { ...s, askedCount: written.length });
  };

  /** The screen after `from`, or the final read after the last one. */
  const moveOn = (from: QuizStep, s: Snapshot) => {
    const list = stepsWith(s);
    const to = list[list.indexOf(from) + 1];
    if (to) show("questions", to);
    else void finish(s);
  };

  const advance = (patch: Partial<Snapshot> = {}) => {
    setError("");
    const s = { ...now, ...patch };
    note(step);
    if (step === "job") startJobRead(job.trim());
    if (step === "device") return void toAsked(step, s);
    const list = stepsWith(s);
    if (list[list.indexOf(step) + 1] === "repeats") return void toRepeats(step);
    moveOn(step, s);
  };

  /** A tap on a one tap question: the tick shows for a beat, then the quiz moves on with that answer. */
  const pickThen = (patch: Partial<Snapshot>) => {
    window.clearTimeout(beat.current);
    beat.current = window.setTimeout(() => advance(patch), PICK_BEAT);
  };

  const back = () => {
    setError("");
    pending.current++;
    window.clearTimeout(beat.current);
    if (phase === "waiting") return show("questions", step, "back");
    if (phase !== "questions") return show("questions", steps[steps.length - 1], "back");
    show("questions", steps[Math.max(steps.indexOf(step) - 1, 0)], "back");
  };

  const handle = (result: BeginnerRead | null, s: Snapshot) => {
    const list = stepsWith(s);
    if (!result || !result.ok) {
      const thin = Boolean(result && !result.ok && result.thin);
      setError(thin ? thinAnswers : (result?.error ?? quizErrors.generic));
      return show("questions", thin ? "repeats" : list[list.length - 1], "back");
    }
    if (result.followUp) {
      setFollowUp(result.followUp);
      return show("follow-up");
    }
    if (result.win) {
      setWin(result.win);
      return show("result");
    }
    setError(quizErrors.generic);
    show("questions", list[list.length - 1], "back");
  };

  /** The final read: every answer goes to the server, which saves them and drafts her first win. */
  const finish = async (s: Snapshot) => {
    const who = fromJob ?? s.worksFor;
    const employed = who ? hasEmployer(who) : false;
    const experience = experienceOf(s);
    if (!experience || !who || (employed && !s.policy) || !wanted.length) {
      setError(quizErrors.missing);
      return;
    }
    setError("");
    const answers: BeginnerAnswers = {
      job,
      experience,
      qas: [...baseQas(s), ...askedQas(s), ...workQas(s, who)],
      mostWanted: wanted,
      worksFor: who,
      aiTools: experience === "not_yet" ? ["none_yet"] : tools,
      aiToolsOther: experience !== "not_yet" && tools.includes("other") ? otherTools.trim() : null,
      aiPolicy: employed ? s.policy : null,
    };
    const withFollowUp = followUp && followUpAnswer.trim() ? { question: followUp, answer: followUpAnswer } : undefined;
    const key = JSON.stringify([answers, withFollowUp ?? null]);
    if (lastRead.current?.key === key) return handle(lastRead.current.result, s);

    const ticket = ++pending.current;
    show("reading");
    await notes.current;
    const [result] = await Promise.all([readBeginner({ answers, followUp: withFollowUp }).catch(() => null), wait(READING_MIN)]);
    if (ticket !== pending.current) return;
    if (result?.ok) lastRead.current = { key, result };
    handle(result, s);
  };

  const setAskedTextFor = (id: string) => (value: SetStateAction<string>) =>
    setAskedText((all) => ({ ...all, [id]: typeof value === "function" ? value(all[id] ?? "") : value }));

  /** Skip under a type or talk question: her words there are cleared, and the quiz moves on without them. */
  const skipButton = (id: string, clear: () => void) => (
    <button
      type="button"
      className="btn btn-lg btn-quiet quiz-next"
      style={{ marginTop: "0.75rem" }}
      onClick={() => {
        clear();
        advance({ skipped: id });
      }}
    >
      {questions.picture.skip}
    </button>
  );

  const at = Math.max(steps.indexOf(step), 0);
  const screens = steps.length + 1;
  const progress =
    phase === "questions"
      ? at / screens
      : phase === "waiting"
        ? (at + 1) / screens
        : phase === "result"
          ? 1
          : steps.length / screens;
  const question = asked?.questions.find((q) => q.id === step) ?? null;

  const screen = () => {
    if (phase === "follow-up" && followUp) {
      return (
        <TextStep
          title={followUp}
          hint={followUpCopy.hint}
          value={followUpAnswer}
          setValue={setFollowUpAnswer}
          onSubmit={() => void finish(now)}
          error={error}
          headingRef={headingRef}
        />
      );
    }
    switch (step) {
      case "job":
        return <TextStep {...questions.job} value={job} setValue={setJob} onSubmit={() => advance()} headingRef={headingRef} />;
      case "level":
        return (
          <ChoiceStep
            title={questions.level.title}
            options={EXPERIENCE}
            labels={experienceLabels}
            value={level}
            onPick={(value) => {
              setLevel(value);
              pickThen({ level: value });
            }}
            other={{
              label: levelOtherCopy.label,
              placeholder: levelOtherCopy.placeholder,
              value: levelText,
              onChange: (value) => {
                window.clearTimeout(beat.current);
                setLevelText(value);
              },
              onSubmit: () => {
                setLevel("tried");
                advance({ level: "tried" });
              },
            }}
            error={error}
            headingRef={headingRef}
          />
        );
      case "held_back":
        return (
          <PickStep
            title={heldBack.title}
            hint={heldBack.hint}
            options={heldBack.choices}
            picked={held.picked}
            onPicked={(picked) => setHeld((p) => ({ ...p, picked }))}
            many
            other={held.other}
            onOther={(other) => setHeld((p) => ({ ...p, other }))}
            onSubmit={() => advance()}
            error={error}
            headingRef={headingRef}
          />
        );
      case "repeats":
        return jobRead ? (
          <PickStep
            title={questions.repeats.title}
            hint={questions.repeats.hint}
            options={jobRead.read.repeats.map((r) => r.label)}
            picked={repeats.picked}
            onPicked={(picked) => setRepeats((p) => ({ ...p, picked }))}
            many
            other={repeats.other}
            onOther={(other) => setRepeats((p) => ({ ...p, other }))}
            onSubmit={() => advance()}
            error={error}
            headingRef={headingRef}
          />
        ) : null;
      case "most":
        return (
          <PickStep
            title={most.fallback ? questions.most.fallbackTitle : questions.most.title}
            hint={most.fallback ? questions.most.fallbackHint : questions.most.hint}
            options={most.options}
            picked={wanted.filter((w) => most.options.includes(w))}
            onPicked={(picked) => setMostWanted(picked.slice(-(MOST_WANTED_MAX - (mostOther !== null ? 1 : 0))))}
            many
            other={mostOther}
            onOther={(other) => {
              setMostOther(other);
              if (other !== null) setMostWanted((m) => m.filter((w) => most.options.includes(w)).slice(-(MOST_WANTED_MAX - 1)));
            }}
            onSubmit={() => advance()}
            error={error}
            headingRef={headingRef}
          />
        );
      case "picture":
        return (
          <>
            <TextStep
              title={questions.picture.title}
              hint={pictureNoIdea.hint}
              value={picture}
              setValue={(value) => {
                setNoIdea(false);
                setPicture(value);
              }}
              onSubmit={() => {
                setNoIdea(false);
                advance({ noIdea: false });
              }}
              error={error}
              headingRef={headingRef}
              afterHint={
                <button
                  type="button"
                  className="quiz-topic quiz-no-idea"
                  aria-pressed={noIdea}
                  data-on={noIdea || undefined}
                  onClick={() => {
                    setNoIdea(true);
                    setPicture("");
                    pickThen({ noIdea: true });
                  }}
                >
                  {noIdea ? <Check /> : null}
                  {pictureNoIdea.chip}
                </button>
              }
            />
          </>
        );
      case "apps":
        return jobRead ? (
          <PickStep
            title={questions.apps.title}
            hint={questions.apps.hint}
            options={software}
            picked={apps.picked}
            onPicked={(picked) => setApps((p) => ({ ...p, picked }))}
            many
            other={apps.other}
            onOther={(other) => setApps((p) => ({ ...p, other }))}
            onSubmit={() => advance()}
            error={error}
            headingRef={headingRef}
          />
        ) : null;
      case "tools":
        return (
          <ToolsStep
            title={questions.tools.title}
            askPolicy={false}
            tools={tools}
            onTools={setTools}
            other={otherTools}
            onOther={setOtherTools}
            policy={policy}
            onPolicy={setPolicy}
            onSubmit={() => advance()}
            error={error}
            headingRef={headingRef}
          />
        );
      case "ai_uses":
        return jobRead ? (
          <PickStep
            title={aiUsesCopy.title}
            hint={aiUsesCopy.hint}
            options={jobRead.read.aiUses}
            picked={uses.picked}
            onPicked={(picked) => setUses((p) => ({ ...p, picked }))}
            many
            other={uses.other}
            onOther={(other) => setUses((p) => ({ ...p, other }))}
            onSubmit={() => advance()}
            error={error}
            headingRef={headingRef}
          />
        ) : null;
      case "device":
        return (
          <ChoiceStep
            title={deviceQuestion.title}
            options={DEVICES}
            labels={deviceQuestion.labels}
            value={device}
            onPick={(value) => {
              setDevice(value);
              pickThen({ device: value });
            }}
            error={error}
            headingRef={headingRef}
          />
        );
      case "works_for":
        return (
          <ChoiceStep
            title={questions.worksFor.title}
            options={WORKS_FOR}
            labels={worksForLabels}
            value={worksFor}
            onPick={(value) => {
              setWorksFor(value);
              pickThen({ worksFor: value });
            }}
            error={error}
            headingRef={headingRef}
          />
        );
      case "policy":
        return (
          <ChoiceStep
            title={policyQuestion.title}
            options={AI_POLICIES}
            labels={policyLabels}
            value={policy}
            onPick={(value) => {
              setPolicy(value);
              pickThen({ policy: value });
            }}
            error={error}
            headingRef={headingRef}
          />
        );
    }
    if (!question) return null;
    if (question.kind === "text") {
      return (
        <>
          <TextStep
            title={question.title}
            hint={question.hint ?? undefined}
            value={askedText[question.id] ?? ""}
            setValue={setAskedTextFor(question.id)}
            onSubmit={() => advance()}
            error={error}
            headingRef={headingRef}
          />
          {skipButton(question.id, () => setAskedText((all) => ({ ...all, [question.id]: "" })))}
        </>
      );
    }
    const picks = askedPicks[question.id] ?? NO_PICKS;
    const many = question.kind === "many";
    return (
      <PickStep
        title={question.title}
        hint={question.hint ?? (many ? questions.repeats.hint : undefined)}
        options={question.choices}
        picked={picks.picked}
        onPicked={(picked) => setAskedPicks((all) => ({ ...all, [question.id]: { ...(all[question.id] ?? NO_PICKS), picked } }))}
        many={many}
        other={picks.other}
        onOther={(other) => setAskedPicks((all) => ({ ...all, [question.id]: { ...(all[question.id] ?? NO_PICKS), other } }))}
        onSubmit={() => advance()}
        error={error}
        headingRef={headingRef}
      />
    );
  };

  return (
    <div className="quiz">
      <Backdrop still />
      <QuizHeader
        progress={progress}
        home={home}
        back={
          phase === "result" ? undefined : phase === "questions" && step === "job" ? (
            <Link href={home} className="quiz-back" aria-label="Back to home">
              <ArrowLeft />
            </Link>
          ) : (
            <button type="button" className="quiz-back" aria-label="Back" onClick={back}>
              <ArrowLeft />
            </button>
          )
        }
      />

      <main id="main" className="quiz-main">
        {phase === "reading" || phase === "waiting" ? (
          <div className="quiz-making" role="status">
            <span className="quiz-spinner" aria-hidden="true" />
            <h1 ref={headingRef} tabIndex={-1} className="quiz-title">
              {phase === "reading" ? readingLines[readingAt] : waitFor === "questions" ? questionsWait : questions.waitLine}
            </h1>
          </div>
        ) : phase === "result" && win ? (
          <FirstWinResult firstWin={win.firstWin} ideas={win.ideas} restricted={win.restricted} headingRef={headingRef}>
            <BeginnerPaywall />
          </FirstWinResult>
        ) : (
          <div key={phase === "questions" ? step : phase} className="quiz-step" data-dir={direction}>
            {phase === "questions" ? (
              <p className="sr-only">
                Question {at + 1} of {steps.length}
              </p>
            ) : null}
            {screen()}
          </div>
        )}
      </main>
    </div>
  );
}
