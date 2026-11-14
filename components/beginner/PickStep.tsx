"use client";

import { useEffect, useRef, type RefObject } from "react";
import { ArrowRight, Check } from "@/components/icons";
import { Dock } from "@/components/quiz/Dock";
import { MicButton } from "@/components/quiz/MicButton";
import { useDictation } from "@/components/quiz/useDictation";
import { beginnerQuestions } from "@/lib/beginner/copy";
import { PICK_MAX } from "@/lib/beginner/quiz";
import { micCopy, privacyNote } from "@/lib/questions";

/** After a tap on a one pick screen, the tick shows for this long before the next screen. */
export const PICK_BEAT = 220;

const { somethingElse } = beginnerQuestions;

type PickStepProps = {
  title: string;
  hint?: string;
  options: readonly string[];
  picked: string[];
  onPicked: (picked: string[]) => void;
  /** True lets her pick as many as fit; false takes one pick and moves on by itself. */
  many: boolean;
  /**
   * What she wrote under Something else: null while that chip is off. Leave out `onOther` and the screen has
   * no Something else.
   */
  other?: string | null;
  onOther?: (other: string | null) => void;
  onSubmit: () => void;
  error?: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
  /** One line under the chips, read out when it changes, like how many of her picks AI can help with. */
  note?: string | null;
};

/**
 * Chips to tap, like the AI tools screen: several, or one that moves on by itself after a beat. Something else
 * opens a box under the chips that she can type or talk into, with the note that she needn't name her company
 * or colleagues. Continue waits for a pick or words under Something else. In one pick mode, Something else
 * stands for her one answer, so it and a chip clear each other.
 */
export function PickStep({
  title,
  hint,
  options,
  picked,
  onPicked,
  many,
  other = null,
  onOther,
  onSubmit,
  error,
  headingRef,
  note = null,
}: PickStepProps) {
  const withOther = other !== null;
  const beat = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // The beat ends with the newest onSubmit, so it sees the pick she just made.
  const submit = useRef(onSubmit);
  useEffect(() => {
    submit.current = onSubmit;
  });
  useEffect(() => () => clearTimeout(beat.current), []);

  const toggle = (option: string) => {
    if (many) return onPicked(picked.includes(option) ? picked.filter((p) => p !== option) : [...picked, option]);
    // One pick: keep it, close Something else, show the tick for a beat, then move on. Tapping it again moves on too.
    onPicked([option]);
    onOther?.(null);
    clearTimeout(beat.current);
    beat.current = setTimeout(() => submit.current(), PICK_BEAT);
  };

  const toggleOther = () => {
    if (!onOther) return;
    clearTimeout(beat.current);
    if (withOther) return onOther(null);
    if (!many) onPicked([]);
    onOther("");
  };

  return (
    <>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-title" id="q-pick">
        {title}
      </h1>
      {hint ? <p className="quiz-hint">{hint}</p> : null}
      <fieldset className="quiz-topics" aria-labelledby="q-pick">
        {options.map((option) => {
          const on = picked.includes(option);
          return (
            <label key={option} className="quiz-topic" data-on={on || undefined}>
              <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(option)} />
              {on ? <Check /> : null}
              {option}
            </label>
          );
        })}
        {onOther ? (
          <label className="quiz-topic" data-on={withOther || undefined}>
            <input type="checkbox" className="sr-only" checked={withOther} onChange={toggleOther} />
            {withOther ? <Check /> : null}
            {somethingElse.label}
          </label>
        ) : null}
      </fieldset>
      {withOther && onOther ? <OtherBox value={other ?? ""} setValue={onOther} /> : null}
      <p className="quiz-note" role="status">
        {note ?? ""}
      </p>

      {error ? (
        <p className="quiz-error" role="alert">
          {error}
        </p>
      ) : null}
      <Dock>
        <button
          type="button"
          className="btn btn-lg quiz-next"
          disabled={!picked.length && !other?.trim()}
          onClick={onSubmit}
        >
          Continue
          <ArrowRight />
        </button>
      </Dock>
    </>
  );
}

/**
 * The box under Something else: type or talk, as on the open questions, with the privacy note under it. Short
 * by default, as a chip's words are; `max` and `placeholder` suit a longer answer.
 */
export function OtherBox({
  value,
  setValue,
  max = PICK_MAX,
  placeholder = somethingElse.placeholder,
}: {
  value: string;
  setValue: (value: string) => void;
  max?: number;
  placeholder?: string;
}) {
  const voice = useDictation({ value, setValue, max });
  const box = useRef<HTMLTextAreaElement>(null);

  // Opening the box puts her in it, and her newest words stay in sight while she talks.
  useEffect(() => {
    box.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (voice.listening && box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [value, voice.listening]);

  return (
    <div className="quiz-fields quiz-other">
      <div className="quiz-box" data-listening={voice.listening || undefined}>
        <textarea
          ref={box}
          className="quiz-story"
          aria-label={somethingElse.label}
          aria-describedby={voice.problem ? "q-other-mic q-other-private" : "q-other-private"}
          rows={2}
          maxLength={max}
          readOnly={voice.listening}
          placeholder={voice.listening ? (voice.ready ? micCopy.speak : micCopy.waiting) : placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {voice.supported ? <MicButton listening={voice.listening} ready={voice.ready} onToggle={voice.toggle} /> : null}
        <span className="sr-only" role="status">
          {voice.ready ? micCopy.listening : ""}
        </span>
      </div>
      {voice.problem ? (
        <p className="quiz-error" id="q-other-mic" role="alert">
          {micCopy.problems[voice.problem]}
        </p>
      ) : null}
      <p className="quiz-private" id="q-other-private">
        {privacyNote}
      </p>
    </div>
  );
}
