import type { JSX } from "react";
import { Check, Mic } from "@/components/icons";
import { planParts, stepSample } from "@/lib/landing";
import { micCopy } from "@/lib/questions";

// What each step of How it works looks like, drawn small above it: her answer being written, her hours, and
// her plan. Decorative: the step's own line carries the meaning.

function Answer() {
  return (
    <span className="shot">
      <span className="shot-kicker">{stepSample.question}</span>
      <span className="shot-say shot-typing">{stepSample.answer}</span>
      <span className="shot-chips">
        <span>
          <Mic />
          {micCopy.start}
        </span>
      </span>
    </span>
  );
}

function Hours() {
  return (
    <span className="shot shot-center">
      <span className="shot-small">{stepSample.resultLead}</span>
      <span className="shot-big">
        <span className="smile">{stepSample.hours}</span>
      </span>
      <span className="shot-small">{stepSample.resultLine}</span>
    </span>
  );
}

function Plan() {
  return (
    <span className="shot">
      <span className="shot-kicker">Your plan</span>
      <span className="shot-list">
        {planParts.parts.slice(0, 4).map((part) => (
          <span key={part.id}>
            <Check />
            {part.title}
          </span>
        ))}
      </span>
    </span>
  );
}

export const stepVisuals: (() => JSX.Element)[] = [Answer, Hours, Plan];
