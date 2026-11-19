"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { noteBeginnerStep, readBeginner, type BeginnerAnswers, type BeginnerRead } from "@/app/begin/actions";
import { readJobAction } from "@/app/begin/questions";
import { Backdrop } from "@/components/Backdrop";
import { ArrowLeft, Check } from "@/components/icons";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { TextStep } from "@/components/quiz/TextStep";
import { ToolsStep } from "@/components/quiz/ToolsStep";
import { beginnerQuestions as questions, repeatGroups } from "@/lib/beginner/copy";
import {
  jobReadOrFallback,
  hasKind,
  mostOptions,
  repeatChoices,
  stepsFor,
  toggleKind,
  whereOptions,
  type JobRead,
  type QA,
  type QuizStep,
} from "@/lib/beginner/quiz";
import {
  canUseQuestion,
  CONNECT,
  CONNECT_ID,
  connectQuestion,
  DEVICES,
  deviceQuestion,
  doneWithAi,
  jobKinds,
  OFTEN,
  oftenQuestion,
  readingLines,
  thinAnswers,
  whereScreen,
  type Connect,
  type Device,
  type Often,
} from "@/lib/beginner/quiz-copy";
import {
  CAN_USE,
  CAN_USE_ID,
  canUseLabels,
  canUseToWork,
  EXPERIENCE,
  experienceLabels,
  hasEmployer,
  usesAi,
  type CanUse,
  type Experience,
} from "@/lib/beginner/types";
import { followUpCopy, quizErrors } from "@/lib/questions";
import { AI_TOOLS, toolLabels, type AiTool } from "@/lib/week";
import { ChoiceStep } from "./ChoiceStep";
import { AskFirst, BeginnerPaywall, FirstWinResult } from "./FirstWinResult";
import { PICK_BEAT, PickStep } from "./PickStep";

// The beginner quiz, one screen at a time, in the order stepsFor gives (lib/beginner/quiz.ts). Everyone: her
// job and where she is with AI. A Builder (Use it some weeks, Use it most days) then says what she has already
// done with AI and which AI she has used. Everyone: what she does over and over, her own responsibilities first and
// then the ones usual for her role, which would save her the most time with how often she does it, then where her
// work happens with what she uses for work under it, Can you use AI for your work (unless her job said she works
// for herself), and for Yes or Not sure there whether she could connect her work email herself. The AI reads her
// job while she answers the screens before what she does over and over; when it is slow or fails, the quiz carries
// on with the fixed list. Then the final read maps her week while lines on what is happening show in turn; if her
// answers were too thin it asks one follow up, once. Then the map of her week and the paywall. Built like
// components/quiz/Quiz.tsx. Phase 8 of docs/DIRECTION.md took out the real example and the question the AI wrote.

const READING_MIN = 1200;
/** How long each line shows while her answers are read, before the next one. The last one stays. */
const READING_LINE_MS = 2400;
/** How long screen 3 waits for the read of her job before it uses the fixed list. */
const JOB_READ_WAIT = 4000;
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
  canUse: CanUse | null;
  connect: Connect | null;
  device: Device | null;
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
  const [done, setDone] = useState<string[]>([]);
  const [jobRead, setJobRead] = useState<(Read & { job: string }) | null>(null);
  const [repeats, setRepeats] = useState<Picks>(NO_PICKS);
  const [mostWanted, setMostWanted] = useState<string[]>([]);
  const [mostOther, setMostOther] = useState<string | null>(null);
  const [often, setOften] = useState<Often | null>(null);
  const [where, setWhere] = useState<Picks>(NO_PICKS);
  const [tools, setTools] = useState<AiTool[]>([]);
  const [otherTools, setOtherTools] = useState("");
  const [device, setDevice] = useState<Device | null>(null);
  const [canUse, setCanUse] = useState<CanUse | null>(null);
  const [connect, setConnect] = useState<Connect | null>(null);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [win, setWin] = useState<Win | null>(null);
  const [error, setError] = useState("");
  const [readingAt, setReadingAt] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const notes = useRef<Promise<void>>(Promise.resolve());
  /** Counts each wait and read, so one she has left by going back is ignored when it ends. */
  const pending = useRef(0);
  const beat = useRef<number | undefined>(undefined);
  const jobCall = useRef<JobCall | null>(null);
  const lastRead = useRef<{ key: string; result: BeginnerRead } | null>(null);

  useEffect(() => {
    if (moved.current) headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [step, phase]);

  // While her answers are read, the line moves on every little while and stays on the last one.
  useEffect(() => {
    if (phase !== "reading") return;
    const timer = window.setInterval(
      () => setReadingAt((at) => Math.min(at + 1, readingLines.length - 1)),
      READING_LINE_MS,
    );
    return () => window.clearInterval(timer);
  }, [phase]);

  const now: Snapshot = { level, canUse, connect, device };
  /** True when the read of her job says she works for herself: Can you use AI for your work is then not asked. */
  const selfFromJob = jobRead?.read.worksFor === "self";
  const most = jobRead ? mostOptions(jobRead.read, repeats.picked, repeats.other) : [];
  const stepsWith = (s: Snapshot) =>
    stepsFor({ level: s.level, worksForFromJob: jobRead?.read.worksFor ?? null, canUse: s.canUse });
  const steps = stepsWith(now);
  const mostTyped = mostOther?.trim() || null;
  // A list of one is her answer without a tap. Otherwise changing her picks on the repeats screen keeps only the
  // most wanted picks still offered, and her own words there count as one of her two.
  const wanted =
    most.length === 1 && !mostTyped
      ? most
      : [...mostWanted.filter((m) => most.includes(m)), ...(mostTyped && !most.includes(mostTyped) ? [mostTyped] : [])].slice(
          0,
          MOST_WANTED_MAX,
        );
  const places = jobRead ? whereOptions(jobRead.read) : [];
  const choices = jobRead ? repeatChoices(jobRead.read) : [];
  // Her own responsibilities and the usual ones in two small groups; the fixed list on its own, with no labels.
  const groups =
    jobRead && !jobRead.fallback
      ? [
          { label: repeatGroups.hers, options: choices.filter((c) => c.group === "hers").map((c) => c.label) },
          { label: repeatGroups.usual, options: choices.filter((c) => c.group === "usual").map((c) => c.label) },
        ].filter((g) => g.options.length)
      : undefined;

  /**
   * The screens before the questions about her work, in order: her level, then for a Builder what she has done and
   * the AI she has used, then what she repeats, her top task and how often, then where her work happens and what she
   * uses for work. What she repeats and her top task are always there: her map is read through them.
   */
  const baseQas = (s: Snapshot): QA[] =>
    jobRead && s.level
      ? [
          choiceQA("level", questions.level.title, EXPERIENCE, experienceLabels, s.level),
          ...(usesAi(s.level)
            ? [
                { id: "done", title: doneWithAi.title, picked: done, text: null, shown: [...doneWithAi.choices, doneWithAi.none] },
                pickedQA(
                  "tools",
                  questions.tools.title,
                  AI_TOOLS.map((t) => toolLabels[t]),
                  { picked: tools.map((t) => toolLabels[t]), other: tools.includes("other") ? otherTools : null },
                ),
              ]
            : []),
          pickedQA("repeats", questions.repeats.title, choices.map((r) => r.label), repeats),
          { id: "most", title: questions.most.title, picked: wanted, text: null, shown: most },
          ...(often ? [choiceQA("often", oftenQuestion.title, OFTEN, oftenQuestion.labels, often)] : []),
          pickedQA("where", whereScreen.title, places, where),
          ...(s.device ? [choiceQA("device", deviceQuestion.title, DEVICES, deviceQuestion.labels, s.device)] : []),
        ]
      : [];
  /** Can you use AI for your work, and whether she could connect her work email, when she was shown them. */
  const workQas = (s: Snapshot): QA[] =>
    !selfFromJob && s.canUse
      ? [
          choiceQA(CAN_USE_ID, canUseQuestion.title, CAN_USE, canUseLabels, s.canUse),
          ...((s.canUse === "yes" || s.canUse === "not_sure") && s.connect
            ? [choiceQA(CONNECT_ID, connectQuestion.title, CONNECT, connectQuestion.labels, s.connect)]
            : []),
        ]
      : [];
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
    const labels = repeatChoices(result.read).map((r) => r.label);
    const names = whereOptions(result.read);
    setRepeats((p) => ({ ...p, picked: p.picked.filter((l) => labels.includes(l)) }));
    setWhere((p) => ({ ...p, picked: p.picked.filter((a) => names.includes(a)) }));
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
      show("waiting", from);
      result = await Promise.race([call.promise, wait(JOB_READ_WAIT).then(() => null)]);
      if (ticket !== pending.current) return;
    }
    keepRead(text, result ?? jobReadOrFallback(null));
    show("questions", "repeats");
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
    const work = selfFromJob ? canUseToWork("self") : s.canUse ? canUseToWork(s.canUse) : null;
    const experience = s.level;
    if (!experience || !work || !wanted.length) {
      setError(quizErrors.missing);
      return;
    }
    setError("");
    // Only a Builder sees the AI tools screen; the server counts a Starter as None yet or Not sure.
    const builder = usesAi(experience);
    const answers: BeginnerAnswers = {
      job,
      experience,
      qas: [...baseQas(s), ...workQas(s)],
      mostWanted: wanted,
      worksFor: work.worksFor,
      aiTools: builder ? tools : experience === "not_yet" ? ["none_yet"] : ["not_sure"],
      aiToolsOther: builder && tools.includes("other") ? otherTools.trim() : null,
      aiPolicy: hasEmployer(work.worksFor) ? work.aiPolicy : null,
      often,
    };
    const withFollowUp = followUp && followUpAnswer.trim() ? { question: followUp, answer: followUpAnswer } : undefined;
    const key = JSON.stringify([answers, withFollowUp ?? null]);
    if (lastRead.current?.key === key) return handle(lastRead.current.result, s);

    const ticket = ++pending.current;
    setReadingAt(0);
    show("reading");
    await notes.current;
    const [result] = await Promise.all([readBeginner({ answers, followUp: withFollowUp }).catch(() => null), wait(READING_MIN)]);
    if (ticket !== pending.current) return;
    if (result?.ok) lastRead.current = { key, result };
    handle(result, s);
  };

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
        return (
          <TextStep
            {...questions.job}
            value={job}
            setValue={setJob}
            onSubmit={() => advance()}
            headingRef={headingRef}
            afterHint={
              <div className="quiz-kinds">
                <p className="quiz-hint" id="q-kinds">
                  {jobKinds.hint}
                </p>
                <div className="quiz-topics" role="group" aria-labelledby="q-kinds">
                  {jobKinds.list.map((kind) => {
                    const on = hasKind(job, kind);
                    return (
                      <button
                        key={kind}
                        type="button"
                        className="quiz-topic"
                        aria-pressed={on}
                        data-on={on || undefined}
                        onClick={() => setJob((text) => toggleKind(text, kind))}
                      >
                        {on ? <Check /> : null}
                        {kind}
                      </button>
                    );
                  })}
                </div>
              </div>
            }
          />
        );
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
            error={error}
            headingRef={headingRef}
          />
        );
      case "done":
        return (
          <PickStep
            title={doneWithAi.title}
            hint={doneWithAi.hint}
            options={[...doneWithAi.choices, doneWithAi.none]}
            picked={done}
            onPicked={(picked) => {
              // None of these clears the others, and any other clears it.
              const added = picked.find((p) => !done.includes(p));
              setDone(added === doneWithAi.none ? [doneWithAi.none] : picked.filter((p) => p !== doneWithAi.none));
            }}
            many
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
            options={choices.map((r) => r.label)}
            groups={groups}
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
            title={questions.most.title}
            hint={questions.most.hint}
            options={most}
            picked={wanted.filter((w) => most.includes(w))}
            onPicked={(picked) => setMostWanted(picked.slice(-(MOST_WANTED_MAX - (mostOther !== null ? 1 : 0))))}
            many
            other={mostOther}
            onOther={(other) => {
              setMostOther(other);
              if (other !== null) setMostWanted((m) => m.filter((w) => most.includes(w)).slice(-(MOST_WANTED_MAX - 1)));
            }}
            onSubmit={() => advance()}
            error={error}
            headingRef={headingRef}
            after={
              <div className="quiz-often">
                <p className="quiz-often-title" id="q-often">
                  {oftenQuestion.title}
                </p>
                <div className="quiz-topics" role="group" aria-labelledby="q-often">
                  {OFTEN.map((o) => {
                    const on = often === o;
                    return (
                      <button
                        key={o}
                        type="button"
                        className="quiz-topic"
                        aria-pressed={on}
                        data-on={on || undefined}
                        onClick={() => setOften(on ? null : o)}
                      >
                        {on ? <Check /> : null}
                        {oftenQuestion.labels[o]}
                      </button>
                    );
                  })}
                </div>
              </div>
            }
          />
        );
      case "where":
        return jobRead ? (
          <PickStep
            title={whereScreen.title}
            hint={whereScreen.hint}
            options={places}
            picked={where.picked}
            onPicked={(picked) => setWhere((p) => ({ ...p, picked }))}
            many
            other={where.other}
            onOther={(other) => setWhere((p) => ({ ...p, other }))}
            onSubmit={() => (device ? advance() : setError(whereScreen.needsDevice))}
            error={error}
            headingRef={headingRef}
            after={
              <div className="quiz-often">
                <p className="quiz-often-title" id="q-device">
                  {deviceQuestion.title}
                </p>
                <div className="quiz-topics" role="group" aria-labelledby="q-device">
                  {DEVICES.map((d) => {
                    const on = device === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        className="quiz-topic"
                        aria-pressed={on}
                        data-on={on || undefined}
                        onClick={() => {
                          setDevice(d);
                          setError("");
                        }}
                      >
                        {on ? <Check /> : null}
                        {deviceQuestion.labels[d]}
                      </button>
                    );
                  })}
                </div>
              </div>
            }
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
            policy={null}
            onPolicy={() => {}}
            onSubmit={() => advance()}
            error={error}
            headingRef={headingRef}
          />
        );
      case "can_use":
        return (
          <ChoiceStep
            title={canUseQuestion.title}
            options={CAN_USE}
            labels={canUseLabels}
            value={canUse}
            onPick={(value) => {
              setCanUse(value);
              pickThen({ canUse: value });
            }}
            error={error}
            headingRef={headingRef}
          />
        );
      case "connect":
        return (
          <ChoiceStep
            title={connectQuestion.title}
            options={CONNECT}
            labels={connectQuestion.labels}
            value={connect}
            onPick={(value) => {
              setConnect(value);
              pickThen({ connect: value });
            }}
            error={error}
            headingRef={headingRef}
          />
        );
    }
    return null;
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
              {phase === "reading" ? readingLines[readingAt] : questions.waitLine}
            </h1>
          </div>
        ) : phase === "result" && win ? (
          <FirstWinResult result={win} restricted={win.restricted && !win.askOnly} headingRef={headingRef}>
            {win.askOnly && win.askMessage ? (
              <AskFirst message={win.askMessage} />
            ) : (
              <BeginnerPaywall setups={win.setups} offer={win.offer} prep={win.prep} freePlan={win.freePlan} />
            )}
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
