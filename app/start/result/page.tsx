import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { BeginnerPaywall, FirstWinResult } from "@/components/beginner/FirstWinResult";
import { FreeResult } from "@/components/quiz/FreeResult";
import { Paywall } from "@/components/quiz/Paywall";
import { PlanPreview } from "@/components/quiz/PlanPreview";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { loadWeek } from "@/lib/funnel-db";
import { offer } from "@/lib/offer";
import { readSessionId } from "@/lib/session-cookie";

// Her free result and the paywall again, from her session, for coming back to it, like after a trip to Stripe
// without paying.
export const metadata: Metadata = {
  title: `Your week · ${offer.name}`,
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="quiz">
      <Backdrop progress={1} />
      <QuizHeader progress={1} />
      <main id="main" className="quiz-main">
        <Suspense>
          <SavedResult />
        </Suspense>
      </main>
    </div>
  );
}

async function SavedResult() {
  const sessionId = await readSessionId();
  const week = sessionId ? await loadWeek(sessionId).catch(() => null) : null;
  const done = week?.session && week.session.status !== "started" && week.tasks.length;
  if (!week || !done) redirect("/start");
  // The beginner quiz's result is her first win, with what else it showed her. Answers saved before Phase 2
  // have no `shown`, and come back as they first did.
  const beginner = week.intake?.beginner;
  if (beginner) {
    const shown = beginner.shown;
    return (
      <FirstWinResult
        result={{ firstWin: beginner.firstWin, ideas: beginner.ideas, ...shown }}
        restricted={week.intake?.ai_policy === "restricted"}
      >
        <BeginnerPaywall setups={shown?.setups} tool={shown?.tool} />
      </FirstWinResult>
    );
  }
  const tasks = week.tasks.map((t) => ({ name: t.name, pile: t.pile, hours: t.confirmed_hours ?? t.estimated_hours }));
  return (
    <FreeResult tasks={tasks}>
      <Paywall>
        <PlanPreview tasks={tasks} aiTools={week.intake?.ai_tools ?? []} aiPolicy={week.intake?.ai_policy ?? null} />
      </Paywall>
    </FreeResult>
  );
}
