import Link from "next/link";
import type { ReactNode } from "react";
import { Lockup } from "@/components/brand/Logo";

/** The quiz's header: a back control on the left, the logo in the middle, and the progress line under it. */
export function QuizHeader({ progress, back }: { progress: number; back?: ReactNode }) {
  return (
    <header className="quiz-head">
      <div className="quiz-head-row">
        {back ?? <span />}
        <Link href="/" className="quiz-brand" aria-label="The Couple Standard, home">
          <Lockup />
        </Link>
        <span />
      </div>
      <div className="quiz-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${Math.max(progress, 0.04)})` }} />
      </div>
    </header>
  );
}
