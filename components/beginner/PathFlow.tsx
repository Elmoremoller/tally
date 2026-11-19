"use client";

import { useEffect, useRef, useState } from "react";
import { savePathPicks, writePathWorkflow, type PathResult } from "@/app/plan/actions";
import { Check } from "@/components/icons";
import { Dock } from "@/components/quiz/Dock";
import { pathCopy, workflowCopy as copy } from "@/lib/beginner/copy";
import { prepTitles } from "@/lib/beginner/free-result";
import { cardFor, type PathAnswer } from "@/lib/beginner/path";
import type { FollowAnswer, FollowSet } from "@/lib/beginner/follow-ups";
import {
  DESIGNS_MAX,
  nameOf,
  piecesOf,
  questionsFor,
  rowOf,
  screensFor,
  swapCandidates,
  type Design,
  type PathV4,
  type Screen,
  type Slot,
} from "@/lib/beginner/workflow";
import { workflowView, type ViewStep } from "@/lib/beginner/workflow-view";
import { offer } from "@/lib/offer";
import { About, DidItWork, Note, Pieces, Ready, type SavedPath } from "./PathSteps";

// Her paid path from Phase 10 (docs/DIRECTION.md, section 4), one screen at a time like the quiz: her two workflows
// to keep or swap, then for each one a few taps about how she does it today, then the workflow Tally wrote from her
// answers. Everything is saved on her plan by the server; on a local preview (no token) the page keeps it and the
// server saves nothing. The exact steps under each step come from the checked cards and recipes.

/** The first screen she still has to act on, or the first workflow she hasn't said worked, or the end. */
function firstOpen(screens: readonly Screen[], path: PathV4, answers: SavedPath["answers"]): number {
  const at = screens.findIndex((s) => {
    if (s.kind === "start") return !path.confirmed;
    if (s.kind === "questions") return !path.slots.find((slot) => slot.id === s.slot)?.design;
    if (s.kind === "solved") return true;
    if (s.kind === "workflow") return !(answers[s.slot] ?? []).includes("yes");
    if (s.kind === "ready" || s.kind === "about") return !(answers[s.kind] ?? []).includes("yes");
    return false;
  });
  return at < 0 ? screens.length - 1 : at;
}

/** How many screens her path will have once every workflow is written: each one not written yet adds two. */
function totalFor(screens: readonly Screen[], path: PathV4) {
  if (screens.at(-1)?.kind === "end") return screens.length;
  const open = path.slots.filter((s) => !s.design).length;
  return screens.length + open * 2;
}

export function PathFlow({
  content,
  token,
  saved,
  sample = null,
}: {
  content: PathV4;
  token: string | null;
  saved: SavedPath;
  /** A preview's sample, so a preview can write a workflow from that sample's answers. */
  sample?: string | null;
}) {
  const [path, setPath] = useState(content);
  const screens = screensFor(path);
  const [at, setAt] = useState(() => firstOpen(screens, content, saved.answers));
  const [answers, setAnswers] = useState(saved.answers);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const here = Math.min(at, screens.length - 1);
  const screen = screens[here];

  useEffect(() => {
    if (!moved.current) return;
    window.scrollTo({ top: 0 });
    heading.current?.focus();
  }, [here]);

  const go = (to: number) => {
    moved.current = true;
    setAt(Math.max(0, to));
  };
  const preview = token ? null : path;
  const took = (result: PathResult) => {
    if (result.content) setPath(result.content);
    return result;
  };

  const slotOf = (id: string) => path.slots.find((s) => s.id === id)!;
  const prep = prepTitles(path.tool, path.device);
  const title =
    screen.kind === "start"
      ? copy.startTitle
      : screen.kind === "solved"
        ? copy.solvedTitle
        : screen.kind === "ready"
          ? prep.ready
          : screen.kind === "about"
            ? prep.about
            : screen.kind === "end"
              ? copy.endTitle
              : nameOf(rowOf(path, slotOf(screen.slot).task)!);
  const stepId = screen.kind === "workflow" ? screen.slot : screen.kind === "ready" || screen.kind === "about" ? screen.kind : null;
  // Next is for reading screens; the start, the questions and a solved row move on by their own buttons.
  const canNext = here < screens.length - 1 && (screen.kind === "workflow" || screen.kind === "ready" || screen.kind === "about" || (screen.kind === "questions" && Boolean(slotOf(screen.slot).design)));

  return (
    <div className="path-flow">
      <div className="path-progress">
        <p className="quiz-eyebrow">{pathCopy.eyebrow}</p>
        <p className="path-count" role="status">
          {copy.progress(here + 1, totalFor(screens, path))}
        </p>
        <div className="path-bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${(here + 1) / totalFor(screens, path)})` }} />
        </div>
      </div>

      <div key={`${here}-${screen.kind}`} className="quiz-step path-step" data-dir="forward">
        <h1 ref={heading} tabIndex={-1} className="quiz-title path-title">
          {title}
        </h1>

        {screen.kind === "start" ? (
          <Start
            path={path}
            onStart={async (picks) => {
              const result = took(await savePathPicks({ token, picks, preview }).catch(() => ({ ok: false }) as PathResult));
              if (result.ok) go(here + 1);
              return result.ok;
            }}
          />
        ) : null}
        {screen.kind === "questions" ? (
          <Questions
            key={slotOf(screen.slot).task}
            path={path}
            slot={slotOf(screen.slot)}
            onWrite={async (given) => {
              const result = took(
                await writePathWorkflow({ token, slot: screen.slot, answers: given, preview, sample }).catch(() => ({ ok: false, error: "failed" }) as PathResult),
              );
              if (result.ok) go(here + 1);
              return result;
            }}
          />
        ) : null}
        {screen.kind === "solved" ? (
          <Solved
            path={path}
            slot={slotOf(screen.slot)}
            onSwap={async (task) => {
              const picks = path.slots.map((s) => (s.id === screen.slot ? task : s.task));
              took(await savePathPicks({ token, picks, preview }).catch(() => ({ ok: false }) as PathResult));
            }}
            onWrite={async (given) => took(await writePathWorkflow({ token, slot: screen.slot, answers: given, preview, sample }).catch(() => ({ ok: false, error: "failed" }) as PathResult))}
          />
        ) : null}
        {screen.kind === "ready" ? <Ready step={{ id: "ready", kind: "ready", card: cardFor(path.tool, "get_started"), firstStep: null }} plan={path} /> : null}
        {screen.kind === "about" ? (
          <About step={{ id: "about", kind: "about", card: cardFor(path.tool, "about_you"), note: path.prep?.aboutNote ?? "" }} plan={path} />
        ) : null}
        {screen.kind === "workflow" ? <Workflow path={path} slot={slotOf(screen.slot) as Slot & { design: Design }} /> : null}
        {screen.kind === "end" ? <End path={path} /> : null}

        {stepId ? (
          <DidItWork
            key={stepId}
            token={token}
            stepId={stepId}
            answers={answers[stepId] ?? []}
            onSaved={(answer: PathAnswer) => setAnswers((all) => ({ ...all, [stepId]: [...(all[stepId] ?? []), answer] }))}
          />
        ) : null}
        {screen.kind === "workflow" ? (
          <p className="path-stops">
            <span className="plan-try-label">{pathCopy.stopsLabel}</span> {pathCopy.stops(offer.supportEmail)}
          </p>
        ) : null}

        {here > 0 || canNext ? (
          <Dock className="path-nav">
            {here > 0 ? (
              <button type="button" className="btn btn-lg btn-quiet" onClick={() => go(here - 1)}>
                {pathCopy.back}
              </button>
            ) : null}
            {canNext ? (
              <button type="button" className="btn btn-lg quiz-next" onClick={() => go(here + 1)}>
                {pathCopy.next}
              </button>
            ) : null}
          </Dock>
        ) : null}
      </div>
    </div>
  );
}

/** Her two workflows, with the pieces her offer listed. She keeps them, or swaps one for another row. */
function Start({ path, onStart }: { path: PathV4; onStart: (picks: string[]) => Promise<boolean> }) {
  const [picks, setPicks] = useState(() => path.slots.map((s) => s.task));
  const [swapping, setSwapping] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const others = swapCandidates({ ...path, slots: path.slots.map((s, i) => ({ ...s, task: picks[i] })) });
  return (
    <>
      <p className="quiz-type-text">{copy.startLead}</p>
      {picks.map((task, i) => {
        const row = rowOf(path, task);
        if (!row) return null;
        return (
          <section key={task} className="path-part path-pick" aria-label={nameOf(row)}>
            <p className="path-piece-label">{nameOf(row)}</p>
            <ul className="plan-rules">
              {piecesOf(path, row).map((piece) => (
                <li key={piece}>{piece}</li>
              ))}
            </ul>
            {others.length ? (
              <button type="button" className="btn btn-quiet path-change" aria-expanded={swapping === i} onClick={() => setSwapping(swapping === i ? null : i)}>
                {swapping === i ? copy.swapCancel : copy.swap}
              </button>
            ) : null}
            {swapping === i ? (
              <div className="path-swap">
                <p className="quiz-often-title">{copy.swapTitle}</p>
                <div className="quiz-topics" role="group" aria-label={copy.swapTitle}>
                  {others.map((m) => (
                    <button
                      key={m.task}
                      type="button"
                      className="quiz-topic"
                      onClick={() => {
                        setPicks((all) => all.map((t, n) => (n === i ? m.task : t)));
                        setSwapping(null);
                      }}
                    >
                      {nameOf(m)}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        );
      })}
      <button
        type="button"
        className="btn btn-lg"
        disabled={state === "saving"}
        onClick={async () => {
          setState("saving");
          setState((await onStart(picks)) ? "idle" : "error");
        }}
      >
        {copy.start}
      </button>
      {state === "error" ? <p className="quiz-error" role="alert">{pathCopy.saveError}</p> : null}
    </>
  );
}

/** One question as tap chips: one pick or many. */
function Question({ q, picked, onChange, disabled }: { q: FollowSet["questions"][number]; picked: string[]; onChange: (p: string[]) => void; disabled: boolean }) {
  const id = `fq-${q.id}`;
  return (
    <div className="quiz-often">
      <p className="quiz-often-title" id={id}>
        {q.title}
      </p>
      {q.hint || q.kind === "many" ? <p className="quiz-hint">{q.hint ?? copy.pickMany}</p> : null}
      <div className="quiz-topics" role="group" aria-labelledby={id}>
        {q.choices.map((c) => {
          const on = picked.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              className="quiz-topic"
              aria-pressed={on}
              data-on={on || undefined}
              disabled={disabled}
              onClick={() => onChange(q.kind === "one" ? (on ? [] : [c.id]) : on ? picked.filter((p) => p !== c.id) : [...picked, c.id])}
            >
              {on ? <Check /> : null}
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** The follow up questions for one workflow, then the call that writes it. Read only once it is written. */
function Questions({ path, slot, onWrite }: { path: PathV4; slot: Slot; onWrite: (answers: FollowAnswer[]) => Promise<PathResult> }) {
  const asked = questionsFor(path, slot);
  const [picked, setPicked] = useState<Record<string, string[]>>(() =>
    Object.fromEntries((slot.answers ?? []).filter((a) => a.id !== "example").map((a) => [a.id, a.picked])),
  );
  const [example, setExample] = useState(() => slot.answers?.find((a) => a.id === "example")?.text ?? "");
  const [state, setState] = useState<"idle" | "writing" | "failed" | "limit">(slot.tries >= DESIGNS_MAX && !slot.design ? "limit" : "idle");
  if (!asked) return null;
  const done = Boolean(slot.design);
  const ready = asked.set.questions.every((q) => (picked[q.id] ?? []).length > 0);
  const send = async () => {
    setState("writing");
    const result = await onWrite([
      ...asked.set.questions.map((q) => ({ id: q.id, picked: picked[q.id] ?? [], text: null })),
      { id: "example", picked: [], text: example.trim() || null },
    ]);
    if (!result.ok) setState(result.error === "limit" ? "limit" : "failed");
    else setState("idle");
  };
  if (state === "writing")
    return (
      <div className="quiz-making" role="status">
        <span className="quiz-spinner" aria-hidden="true" />
        <p className="quiz-type-text">{copy.writing}</p>
      </div>
    );
  return (
    <>
      <p className="quiz-type-text">{copy.questionsLead}</p>
      {asked.set.questions.map((q) => (
        <Question key={q.id} q={q} picked={picked[q.id] ?? []} disabled={done} onChange={(p) => setPicked((all) => ({ ...all, [q.id]: p }))} />
      ))}
      <div className="path-help">
        <label className="path-help-label" htmlFor={`fq-example-${slot.id}`}>
          {asked.set.example.label}
        </label>
        <p className="quiz-hint">{asked.set.example.hint}</p>
        <textarea
          id={`fq-example-${slot.id}`}
          className="path-help-box"
          rows={4}
          maxLength={1500}
          value={example}
          readOnly={done}
          onChange={(e) => setExample(e.target.value)}
        />
      </div>
      {!done ? (
        <button type="button" className="btn btn-lg" disabled={!ready} onClick={send}>
          {copy.write}
        </button>
      ) : null}
      {state === "failed" ? <p className="quiz-error" role="alert">{copy.writeError}</p> : null}
      {state === "limit" ? <p className="quiz-error" role="alert">{copy.writeLimit(offer.supportEmail)}</p> : null}
    </>
  );
}

/** An app already does this: she picks another row, or changes her answers. */
function Solved({
  path,
  slot,
  onSwap,
  onWrite,
}: {
  path: PathV4;
  slot: Slot;
  onSwap: (task: string) => Promise<void>;
  onWrite: (answers: FollowAnswer[]) => Promise<PathResult>;
}) {
  const [again, setAgain] = useState(false);
  if (again) return <Questions path={{ ...path }} slot={{ ...slot, answers: null }} onWrite={onWrite} />;
  const others = swapCandidates(path);
  return (
    <>
      <p className="quiz-type-text">{copy.solvedLead}</p>
      <div className="quiz-topics" role="group" aria-label={copy.solvedLead}>
        {others.map((m) => (
          <button key={m.task} type="button" className="quiz-topic" onClick={() => void onSwap(m.task)}>
            {nameOf(m)}
          </button>
        ))}
      </div>
      <button type="button" className="btn btn-quiet path-change" onClick={() => setAgain(true)}>
        {copy.solvedBack}
      </button>
    </>
  );
}

/** One step: her short line, the exact clicks from its card, and what to know first. */
function Step({ step, n }: { step: ViewStep; n: number }) {
  return (
    <li value={n} className="path-wstep">
      <p className="path-say">
        <strong>{step.say}</strong>
        {step.piece ? <span className="path-uses"> {copy.copyThis(step.piece)}</span> : null}
      </p>
      {step.lines.length ? (
        <ol className="path-clicks">
          {step.lines.map((line, i) => (
            <li key={`${i}-${line}`}>{line}</li>
          ))}
        </ol>
      ) : null}
      {step.note ? (
        <p className="path-note">
          <span className="plan-try-label">{copy.noteLabel}</span> {step.note}
        </p>
      ) : null}
      {step.region ? (
        <p className="path-note">
          <span className="plan-try-label">{copy.regionLabel}</span> {step.region}
        </p>
      ) : null}
    </li>
  );
}

/** One workflow, in the parts of section 4. */
function Workflow({ path, slot }: { path: PathV4; slot: Slot & { design: Design } }) {
  const v = workflowView(path, slot);
  return (
    <>
      <p className="path-read">{v.read}</p>
      {v.cost.length ? <Note label={copy.costFirst} text={v.cost.join(" ")} /> : null}
      <Pieces pieces={v.material} />
      <section className="path-part" aria-label={copy.onceLabel}>
        <p className="plan-try-label">{copy.onceLabel}</p>
        <ol className="plan-steps path-wsteps">
          {v.once.map((s, i) => (
            <Step key={`${i}-${s.say}`} step={s} n={i + 1} />
          ))}
        </ol>
      </section>
      <section className="path-part" aria-label={copy.eachTimeLabel}>
        <p className="plan-try-label">{copy.eachTimeLabel}</p>
        <ol className="plan-steps path-wsteps" start={v.once.length + 1}>
          {v.eachTime.map((s, i) => (
            <Step key={`${i}-${s.say}`} step={s} n={v.once.length + i + 1} />
          ))}
        </ol>
      </section>
      <div className="plan-try">
        <p className="plan-try-label">{copy.tryLabel}</p>
        <p>{v.tryOn}</p>
        <p className="plan-try-label">{copy.goodLabel}</p>
        <p>{v.good}</p>
      </div>
      <Note label={copy.approvalLabel} text={v.approval} />
    </>
  );
}

/** The end: with an AI workflow, what is safe at her job and, when she needs it, the message to ask. */
function End({ path }: { path: PathV4 }) {
  return (
    <>
      <p className="quiz-type-text">{copy.endLead}</p>
      {path.prep?.safeUse.length ? (
        <section className="path-part" aria-label={copy.safeTitle}>
          <p className="plan-try-label">{copy.safeTitle}</p>
          <ul className="plan-rules path-safe">
            {path.prep.safeUse.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {path.prep?.askMessage ? <Pieces pieces={[{ label: pathCopy.askLabel, items: [path.prep.askMessage] }]} lead={pathCopy.askLead} /> : null}
    </>
  );
}
