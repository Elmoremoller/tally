import { useEffect, useRef, type Dispatch, type FormEvent, type RefObject, type SetStateAction } from "react";
import { ArrowRight } from "@/components/icons";
import { micCopy, privacyNote } from "@/lib/questions";
import { ANSWER_MAX } from "@/lib/week";
import { Dock } from "./Dock";
import { MicButton } from "./MicButton";
import { TypingHint } from "./TypingHint";
import { useDictation } from "./useDictation";

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

/**
 * One open question: a box with room for a few lines, Talk instead of typing inside it where the browser can,
 * and the note that she needn't name her company or colleagues. With `examples`, the empty box types out
 * one example answer after another. While she talks the examples stop, her words show in the box as she says
 * them, and the box waits for Done before it can be typed in. Until the browser is really listening the box
 * asks her to wait a moment. A pause to think doesn't end it; if talking does stop for a reason, she's told why.
 */
export function TextStep({ title, hint, placeholder, examples, value, setValue, onSubmit, error, headingRef }: TextStepProps) {
  const voice = useDictation({ value, setValue, max: ANSWER_MAX });
  const box = useRef<HTMLTextAreaElement>(null);
  const describedBy = [hint && "q-hint", examples && "q-example", voice.problem && "q-mic", "q-private"].filter(Boolean).join(" ");

  // Her newest words stay in sight as the box fills up.
  useEffect(() => {
    if (voice.listening && box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [value, voice.listening]);

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
        <div className="quiz-box" data-listening={voice.listening || undefined}>
          <textarea
            ref={box}
            className="quiz-story"
            aria-labelledby="q-title"
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            rows={4}
            maxLength={ANSWER_MAX}
            readOnly={voice.listening}
            placeholder={voice.listening ? (voice.ready ? micCopy.speak : micCopy.waiting) : examples ? undefined : placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {examples && !value && !voice.listening ? <TypingHint examples={examples} /> : null}
          {examples ? (
            <span className="sr-only" id="q-example">
              For example: {examples[0]}
            </span>
          ) : null}
          {voice.supported ? <MicButton listening={voice.listening} ready={voice.ready} onToggle={voice.toggle} /> : null}
          <span className="sr-only" role="status">
            {voice.ready ? micCopy.listening : ""}
          </span>
        </div>
        {voice.problem ? (
          <p className="quiz-error" id="q-mic" role="alert">
            {micCopy.problems[voice.problem]}
          </p>
        ) : null}
        <p className="quiz-private" id="q-private">
          {privacyNote}
        </p>
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
