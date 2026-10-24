"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChoiceStep } from "@/components/quiz/ChoiceStep";
import { SafetyHelp } from "@/components/SafetyHelp";
import { partnerSafetyCheck, SAFETY_ASKED_COOKIE, safetyQuestion, type SafetyAnswer } from "@/lib/safety";

/**
 * The safety question, asked privately the first time an invited partner opens the plan, since they never
 * took the quiz. Whatever they answer, this browser only remembers that they were asked, so the plan opens
 * straight away next time. No opens it now; Yes or Not sure shows the hotline, with Go back for a mis-tap.
 */
export function SafetyCheck() {
  const router = useRouter();
  const [picked, setPicked] = useState<SafetyAnswer | null>(null);
  const [stopped, setStopped] = useState(false);
  /** True after Go back, so the question slides in from the side it was left on. */
  const [cameBack, setCameBack] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (moved.current) headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [stopped]);

  const choose = (id: SafetyAnswer) => {
    setPicked(id);
    moved.current = true;
    // Set here rather than in a Server Action: a cookie set there re-renders the page straight away, which
    // would open the plan before the hotline could show.
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${SAFETY_ASKED_COOKIE}=1; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
    if (id === "no") router.refresh();
    else setStopped(true);
  };

  const goBack = () => {
    setCameBack(true);
    setStopped(false);
  };

  return stopped ? (
    <div key="help" className="quiz-step">
      <SafetyHelp headingRef={headingRef} onBack={goBack} />
    </div>
  ) : (
    <div key="question" className="quiz-step" data-dir={cameBack ? "back" : undefined}>
      <p className="quiz-eyebrow">{partnerSafetyCheck.eyebrow}</p>
      <ChoiceStep
        title={safetyQuestion.title}
        hint={partnerSafetyCheck.hint}
        choices={safetyQuestion.choices}
        picked={picked ?? undefined}
        onChoose={choose}
        headingRef={headingRef}
      />
    </div>
  );
}
