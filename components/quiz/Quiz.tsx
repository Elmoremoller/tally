"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { confirmWeek, noteQuizStep, readWeek, type Answers, type QuizStep, type ReadResult } from "@/app/start/actions";
import { Backdrop } from "@/components/Backdrop";
import { ArrowLeft } from "@/components/icons";
import { followUpCopy, openQuestions, quizErrors, readingLine } from "@/lib/questions";
import type { AiPolicy, AiTool, WeekTask } from "@/lib/week";
import { FreeResult } from "./FreeResult";
import { HeardStep } from "./HeardStep";
import { Paywall } from "./Paywall";
import { QuizHeader } from "./QuizHeader";
import { TextStep } from "./TextStep";
import { ToolsStep } from "./ToolsStep";

// One screen at a time: her job, her week, what she wants to be known for, then the two taps. The AI reads
// her answers while "Reading your week" shows; if her week was too thin it asks one follow up, once. Then
// Here's what we heard, with her hours on sliders, and Looks right shows her free result and the paywall.
const STEPS = ["job", "week", "known_for", "tools"] as const;
const SCREENS = STEPS.length + 1;
/** "Reading your week" stays up at least this long, so it can be read. */
const READING_MIN = 1200;

type Phase = "questions" | "reading" | "follow-up" | "heard" | "result";
type Heard = NonNullable<Extract<ReadResult, { ok: true }>["heard"]>;

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export function Quiz() {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("questions");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [job, setJob] = useState("");
  const [week, setWeek] = useState("");
  const [knownFor, setKnownFor] = useState("");
  const [tools, setTools] = useState<AiTool[]>([]);
  const [policy, setPolicy] = useState<AiPolicy | null>(null);
  /** The one follow up question, once it's been asked, and her answer to it. */
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [heard, setHeard] = useState<Heard | null>(null);
  const [tasks, setTasks] = useState<WeekTask[]>([]);
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  /** Steps are noted on her session one after another, the first one starting it. */
  const notes = useRef<Promise<void>>(Promise.resolve());
  /** Counts readings, so one that comes back after Back was pressed is ignored. */
  const reading = useRef(0);
  /** The last reading, so going back and on without changing anything doesn't read again. */
  const lastRead = useRef<{ key: string; result: ReadResult } | null>(null);

  // After moving to a new screen, put focus on its question so screen readers announce it.
  useEffect(() => {
    if (moved.current) headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [step, phase]);

  const show = (next: Phase, to = step, way: "forward" | "back" = "forward") => {
    moved.current = true;
    setDirection(way);
    setStep(to);
    setPhase(next);
  };

  const note = (name: QuizStep) => {
    notes.current = notes.current.then(() => noteQuizStep(name)).catch(() => {});
  };

  const next = () => {
    setError("");
    note(STEPS[step]);
    show("questions", step + 1);
  };

  const back = () => {
    setError("");
    reading.current++;
    if (phase === "heard" && followUp) return show("follow-up", step, "back");
    if (phase !== "questions") return show("questions", STEPS.length - 1, "back");
    show("questions", step - 1, "back");
  };

  /** What the reading says to do next: the follow up, Here's what we heard, or back with an error. */
  const handle = (result: ReadResult | null) => {
    if (!result || !result.ok) {
      setError(result?.error ?? quizErrors.generic);
      return show("questions", result && !result.ok && result.thin ? 1 : STEPS.length - 1, "back");
    }
    if (result.followUp) {
      setFollowUp(result.followUp);
      return show("follow-up");
    }
    if (result.heard) {
      setHeard(result.heard);
      setTasks(result.heard.tasks);
      setEditing(false);
      return show("heard");
    }
    setError(quizErrors.generic);
    show("questions", STEPS.length - 1, "back");
  };

  const read = async () => {
    if (!policy) return;
    setError("");
    const answers: Answers = { job, week, knownFor, aiTools: tools, aiPolicy: policy };
    const withFollowUp = followUp && followUpAnswer.trim() ? { question: followUp, answer: followUpAnswer } : undefined;
    const key = JSON.stringify([answers, withFollowUp ?? null]);
    if (lastRead.current?.key === key) return handle(lastRead.current.result);

    const ticket = ++reading.current;
    show("reading");
    await notes.current;
    const [result] = await Promise.all([
      readWeek({ answers, followUp: withFollowUp }).catch(() => null),
      wait(READING_MIN),
    ]);
    if (ticket !== reading.current) return;
    if (result?.ok) lastRead.current = { key, result };
    handle(result);
  };

  const confirm = async () => {
    setError("");
    setPending(true);
    const cleaned = tasks.map((t) => ({ ...t, name: t.name.trim() }));
    const result = await confirmWeek(cleaned).catch(() => null);
    setPending(false);
    if (!result?.ok) return setError(result?.error ?? quizErrors.generic);
    setTasks(cleaned);
    show("result");
  };

  const progress =
    phase === "questions" ? step / SCREENS : phase === "heard" ? (SCREENS - 0.5) / SCREENS : phase === "result" ? 1 : STEPS.length / SCREENS;

  return (
    <div className="quiz">
      <Backdrop progress={progress} />
      <QuizHeader
        progress={progress}
        back={
          phase === "result" ? undefined : phase === "questions" && step === 0 ? (
            <Link href="/" className="quiz-back" aria-label="Back to home">
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
        {phase === "reading" ? (
          <div className="quiz-making" role="status">
            <span className="quiz-spinner" aria-hidden="true" />
            <h1 ref={headingRef} tabIndex={-1} className="quiz-title">
              {readingLine}
            </h1>
          </div>
        ) : phase === "result" ? (
          <FreeResult tasks={tasks} headingRef={headingRef}>
            <Paywall tasks={tasks} />
          </FreeResult>
        ) : (
          <div key={phase === "questions" ? step : phase} className="quiz-step" data-dir={direction}>
            {phase === "questions" ? (
              <p className="sr-only">
                Question {step + 1} of {SCREENS}
              </p>
            ) : null}
            {phase === "follow-up" && followUp ? (
              <TextStep
                title={followUp}
                hint={followUpCopy.hint}
                value={followUpAnswer}
                setValue={setFollowUpAnswer}
                onSubmit={read}
                headingRef={headingRef}
              />
            ) : phase === "heard" && heard ? (
              <HeardStep
                role={heard.role}
                knownFor={heard.knownFor}
                tasks={tasks}
                onTasks={setTasks}
                editing={editing}
                onEditing={setEditing}
                onConfirm={confirm}
                pending={pending}
                error={error}
                headingRef={headingRef}
              />
            ) : step === 0 ? (
              <TextStep
                {...openQuestions.job}
                value={job}
                setValue={setJob}
                onSubmit={next}
                headingRef={headingRef}
              />
            ) : step === 1 ? (
              <TextStep
                {...openQuestions.week}
                value={week}
                setValue={setWeek}
                onSubmit={next}
                error={error}
                headingRef={headingRef}
              />
            ) : step === 2 ? (
              <TextStep
                {...openQuestions.knownFor}
                value={knownFor}
                setValue={setKnownFor}
                onSubmit={next}
                headingRef={headingRef}
              />
            ) : (
              <ToolsStep
                tools={tools}
                onTools={setTools}
                policy={policy}
                onPolicy={setPolicy}
                onSubmit={read}
                error={error}
                headingRef={headingRef}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
