import { planCopy, type TryWords } from "@/lib/steps";
import { SayBox } from "./SayBox";

/** The Try part of a step: one action, or a sentence they can change and copy to say or send. */
export function TryBox({ tryWords }: { tryWords: TryWords }) {
  if (tryWords.kind === "do") {
    return (
      <div className="plan-try">
        <p className="plan-try-label">{planCopy.tryThis}</p>
        <p>{tryWords.text}</p>
      </div>
    );
  }

  return (
    <div className="plan-try">
      <p className="plan-try-label">{planCopy.trySaying}</p>
      {tryWords.lead ? <p>{tryWords.lead}</p> : null}
      <SayBox words={tryWords.words} />
      {tryWords.after ? <p>{tryWords.after}</p> : null}
    </div>
  );
}
