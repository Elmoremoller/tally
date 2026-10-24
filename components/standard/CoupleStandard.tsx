"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { agreeToLine, saveStandardLine, saveWayIn, type LineState } from "@/app/plan/actions";
import { Mark } from "@/components/brand/Logo";
import { ArrowLeft, Check } from "@/components/icons";
import { FitTextarea } from "@/components/plan/FitTextarea";
import { SafetyHelp } from "@/components/SafetyHelp";
import { helpCopy, type HelpNames } from "@/lib/fight-help";
import { AGREEMENT_MAX } from "@/lib/progress";
import { mentionsHarm } from "@/lib/safety";
import { standardCopy as copy, standardParts, statusOf, type LineStatus, type SlotId, type StandardState } from "@/lib/standard";
import { reviewCopy } from "@/lib/steps";

type CoupleStandardProps = {
  names: HelpNames;
  /** Their main topic in a sentence, "chores", or "the small stuff". */
  topic: string;
  topicId: string | undefined;
  state: StandardState;
  /** Before a partner is invited, a line says they'll see it too. */
  showInvite: boolean;
  planHref: string;
  /** On the preview, lines change on the page and nothing is saved. */
  preview: boolean;
};

const SOMETHING_WRONG = "Something went wrong. Please try again in a minute.";

/**
 * Their Couple Standard: where they started, then what the two of them agree on, in the brief's four parts.
 * A shared line is a proposal until the other person agrees, or, until the other person has opened the plan,
 * until whoever wrote it marks it agreed after they talk. Each person's own way in is theirs alone to change.
 */
export function CoupleStandard({ names, topic, topicId, state, showInvite, planHref, preview }: CoupleStandardProps) {
  const [lines, setLines] = useState(state.lines);
  const [myWayIn, setMyWayIn] = useState(state.myWayIn);
  const startedId = useId();

  // Words about fear or harm go to the hotline instead, whether or not anything is saved.
  const send = async (call: () => Promise<LineState>, text?: string): Promise<LineState> => {
    if (text !== undefined && mentionsHarm(text)) return { safety: true };
    if (preview) return null;
    return call().catch(() => ({ error: SOMETHING_WRONG }));
  };

  const saveLine = async (slot: SlotId, text: string) => {
    const result = await send(() => saveStandardLine({ slot, text }), text);
    if (result) return result;
    // The same words keep it as it was; new words make it their proposal.
    setLines((all) => {
      const before = all[slot];
      return { ...all, [slot]: before?.text === text ? before : { text, mine: true, agreed: false } };
    });
    return null;
  };
  const agree = async (slot: SlotId) => {
    const result = await send(() => agreeToLine({ slot }));
    if (result) return result;
    setLines((all) => {
      const before = all[slot];
      return before ? { ...all, [slot]: { ...before, agreed: true } } : all;
    });
    return null;
  };
  const saveMine = async (text: string) => {
    const result = await send(() => saveWayIn({ text }), text);
    if (result) return result;
    setMyWayIn(text);
    return null;
  };

  return (
    <div className="standard">
      <Link href={planHref} className="help-back">
        <ArrowLeft />
        {helpCopy.backToPlan}
      </Link>
      <header className="standard-head">
        <Mark className="standard-mark" />
        <h1 className="standard-title">{copy.title(names)}</h1>
        <p className="standard-intro">{copy.intro}</p>
        {showInvite ? <p className="standard-invite">{copy.invite(names)}</p> : null}
      </header>

      {state.started ? (
        <section className="standard-part" aria-labelledby={startedId}>
          <h2 id={startedId} className="standard-part-title">
            {copy.started}
          </h2>
          <ul className="quiz-heard standard-heard">
            {state.started.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <p className="standard-private">{copy.onlyYou}</p>
        </section>
      ) : null}

      <Part title={copy.wayIn.title} text={copy.wayIn.text}>
        <Line label={copy.wayIn.me(names)} hint={copy.wayIn.hint} text={myWayIn} status={null} names={names} onSave={saveMine} />
        {/* Theirs shows once they've written it; only they can change it. */}
        {state.theirWayIn ? (
          <Line label={copy.wayIn.partner(names)} hint="" text={state.theirWayIn} status={null} names={names} />
        ) : null}
      </Part>

      {standardParts(topic).map((part) => (
        <Part key={part.title} title={part.title}>
          {part.slots.map((slot) => {
            const line = lines[slot];
            return (
              <Line
                key={slot}
                label={copy.slots[slot].label}
                hint={slot === "practical" ? copy.practicalHint(topicId) : copy.slots[slot].hint}
                text={line?.text ?? null}
                status={line ? statusOf(line, state.otherOpened) : null}
                names={names}
                onSave={(text) => saveLine(slot, text)}
                onAgree={() => agree(slot)}
              />
            );
          })}
        </Part>
      ))}
    </div>
  );
}

function Part({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  const id = useId();
  return (
    <section className="standard-part" aria-labelledby={id}>
      <h2 id={id} className="standard-part-title">
        {title}
      </h2>
      {text ? <p className="standard-part-text">{text}</p> : null}
      <div className="standard-lines">{children}</div>
    </section>
  );
}

type LineProps = {
  label: string;
  /** What to write, while it's empty. */
  hint: string;
  text: string | null;
  /** How far it is from agreed. Null for each person's own way in, which nobody agrees to. */
  status: LineStatus | null;
  names: HelpNames;
  /** Without it, the line is someone else's and only shows its words. */
  onSave?: (text: string) => Promise<LineState>;
  onAgree?: () => Promise<LineState>;
};

/** One line: its words and where it stands, or what to write. Write it and Change open a box in place. */
function Line({ label, hint, text, status, names, onSave, onAgree }: LineProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [safety, setSafety] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const labelId = useId();
  const hintId = useId();

  const run = async (call: () => Promise<LineState>, then: () => void) => {
    if (pending) return;
    setPending(true);
    setError("");
    const result = await call();
    setPending(false);
    if (result && "safety" in result) return setSafety(true);
    if (result) return setError(result.error);
    then();
  };
  const open = () => {
    setDraft(text ?? "");
    setError("");
    setEditing(true);
  };
  const save = () => {
    const words = draft.trim();
    if (words && onSave) run(() => onSave(words), () => setEditing(false));
  };

  const errorLine = error ? (
    <p className="quiz-error" role="alert">
      {error}
    </p>
  ) : null;

  let body: ReactNode;
  if (safety) {
    body = <SafetyHelp level={3} onBack={() => setSafety(false)} />;
  } else if (editing) {
    body = (
      <div className="standard-edit">
        <FitTextarea
          className="quiz-story step-review-agree"
          aria-labelledby={labelId}
          aria-describedby={hintId}
          rows={1}
          maxLength={AGREEMENT_MAX}
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
        />
        <p id={hintId} className="standard-hint">
          {reviewCopy.agreeHint}
        </p>
        <div className="standard-actions">
          <button type="button" className="btn" disabled={!draft.trim() || pending} onClick={save}>
            {reviewCopy.save}
          </button>
          <button type="button" className="link-button" disabled={pending} onClick={() => setEditing(false)}>
            {copy.cancel}
          </button>
        </div>
        {errorLine}
      </div>
    );
  } else if (text) {
    body = (
      <>
        <p className="standard-text">{text}</p>
        {status ? (
          <p className="standard-status" data-status={status}>
            {status === "agreed" ? <Check /> : null}
            {status === "agreed"
              ? copy.agreed
              : status === "waiting"
                ? copy.waiting(names)
                : status === "suggested"
                  ? copy.suggested(names)
                  : copy.notYet}
          </p>
        ) : null}
        {(status === "suggested" || status === "notYet" || onSave) && (
          <div className="standard-actions">
            {status === "suggested" && onAgree ? (
              <button type="button" className="btn" disabled={pending} onClick={() => run(onAgree, () => {})}>
                {copy.agree}
              </button>
            ) : null}
            {status === "notYet" && onAgree ? (
              <button type="button" className="btn btn-quiet" disabled={pending} onClick={() => run(onAgree, () => {})}>
                {copy.weAgreed}
              </button>
            ) : null}
            {onSave ? (
              <button type="button" className="link-button" disabled={pending} onClick={open}>
                {copy.change}
              </button>
            ) : null}
          </div>
        )}
        {errorLine}
      </>
    );
  } else {
    body = (
      <>
        <p className="standard-hint">{hint}</p>
        {onSave ? (
          <button type="button" className="btn btn-quiet standard-write" onClick={open}>
            {copy.write}
          </button>
        ) : null}
      </>
    );
  }

  return (
    <div className="standard-line">
      <p id={labelId} className="standard-label">
        {label}
      </p>
      {body}
    </div>
  );
}
