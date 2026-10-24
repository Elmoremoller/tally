"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check } from "@/components/icons";
import { backAt, helpCopy as copy, type HelpNames } from "@/lib/fight-help";
import { FightHelp, type HelpScreen, type SaveAgreement } from "./FightHelp";
import { PAUSE_ASKS_FOR, useNow, usePauseUntil } from "./store";

type View = "ask" | "plan" | HelpScreen;

type WelcomeFlowProps = {
  names: HelpNames;
  save: SaveAgreement;
  /** Where their plan link went, and Send it again. */
  children: ReactNode;
};

/**
 * Right after paying: Did you just have a fight? Yes opens the help for right now, calming down first while
 * it's still heated. No shows where their plan link went, the way this page always has. Coming back while
 * the 20 minutes run goes straight to the timer.
 */
export function WelcomeFlow({ names, save, children }: WelcomeFlowProps) {
  const now = useNow();
  const pause = usePauseUntil();
  const [view, setView] = useState<View | null>(null);
  const [tapped, setTapped] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const running = now > 0 && pause !== null && now - pause < PAUSE_ASKS_FOR;
  const shown: View = view ?? (running ? { name: "pause" } : "ask");
  const key = typeof shown === "string" ? shown : "help";

  useEffect(() => {
    if (!tapped || key === "help") return;
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [key, tapped]);

  const open = (next: View) => {
    setTapped(true);
    setView(next);
  };

  if (typeof shown !== "string") {
    return <FightHelp names={names} entry={shown} save={save} onBack={() => open("ask")} onDone={() => open("plan")} focusFirst={tapped} />;
  }

  if (shown === "plan") {
    return (
      <>
        <h1 ref={headingRef} tabIndex={-1} className="page-title">
          {copy.ready}
        </h1>
        {children}
      </>
    );
  }

  const answers: [string, () => void][] = [
    [copy.answers.heated, () => open({ name: "calm", time: backAt(new Date()), kept: false })],
    [copy.answers.calmer, () => open({ name: "makeUp" })],
    [copy.answers.no, () => open("plan")],
  ];
  return (
    <>
      <p className="page-eyebrow">{copy.ready}</p>
      <h1 ref={headingRef} tabIndex={-1} id="welcome-question" className="page-title">
        {copy.question}
      </h1>
      <div className="quiz-choices welcome-answers" role="group" aria-labelledby="welcome-question">
        {answers.map(([label, onChoose]) => (
          <button key={label} type="button" className="quiz-choice" onClick={onChoose}>
            <span>{label}</span>
            <span className="quiz-tick" aria-hidden="true">
              <Check />
            </span>
          </button>
        ))}
      </div>
      {children}
    </>
  );
}
