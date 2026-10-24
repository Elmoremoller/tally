import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { FreeResult } from "@/components/quiz/FreeResult";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { loadWeek } from "@/lib/funnel-db";
import { offer } from "@/lib/offer";
import { readSessionId } from "@/lib/session-cookie";

// Her free result again, from her session, for coming back to it, like after a trip to Stripe without paying.
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
  return <FreeResult tasks={week.tasks.map((t) => ({ name: t.name, pile: t.pile, hours: t.confirmed_hours ?? t.estimated_hours }))} />;
}
