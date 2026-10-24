import type { Dispatch, FormEvent, RefObject, SetStateAction } from "react";
import { ArrowRight } from "@/components/icons";
import { privacyNote } from "@/lib/questions";
import { ANSWER_MAX } from "@/lib/week";
import { Dock } from "./Dock";
import { MicButton } from "./MicButton";
import { TypingHint } from "./TypingHint";

type TextStepProps = {
  title: string;
  hint?: string;
  placeholder?: string;
  /** Example answers typed out in turn while the box is empty, in place of a placeholder. */
  examples?: readonly string[];
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  error?: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

/** Adds what she said to what's already in the box, up to the limit. */
const append = (text: string, said: string) => (text.trim() ? `${text.trimEnd()} ${said}` : said).slice(0, ANSWER_MAX);

/**
 * One open question: a box with room for a few lines, a way to talk instead of typing where the browser can,
 * and the note that she needn't name her company or colleagues. With `examples`, the empty box types out
 * one example answer after another.
 */
export function TextStep({ title, hint, placeholder, examples, value, setValue, onSubmit, error, headingRef }: TextStepProps) {
  const describedBy = [hint && "q-hint", examples && "q-example", "q-private"].filter(Boolean).join(" ");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.trim()) onSubmit();
  };
  return (
    <form onSubmit={submit}>
      <h1 ref={headingRef} tabIndex={-1} className="quiz-title" id="q-title">
        {title}
      </h1>
      {hint ? (
        <p className="quiz-hint" id="q-hint">
          {hint}
        </p>
      ) : null}
      <div className="quiz-fields">
        <div className="quiz-box">
          <textarea
            className="quiz-story"
            aria-labelledby="q-title"
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            rows={5}
            maxLength={ANSWER_MAX}
            placeholder={examples ? undefined : placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {examples && !value ? <TypingHint examples={examples} /> : null}
          {examples ? (
            <span className="sr-only" id="q-example">
              For example: {examples[0]}
            </span>
          ) : null}
        </div>
        <div className="quiz-under">
          <MicButton onText={(said) => setValue((text) => append(text, said))} />
          <p className="quiz-private" id="q-private">
            {privacyNote}
          </p>
        </div>
        {error ? (
          <p className="quiz-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <Dock>
        <button type="submit" className="btn btn-lg quiz-next" disabled={!value.trim()}>
          Continue
          <ArrowRight />
        </button>
      </Dock>
    </form>
  );
}
