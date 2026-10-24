import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { FreeResult } from "@/components/quiz/FreeResult";
import { Paywall } from "@/components/quiz/Paywall";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { offer } from "@/lib/offer";
import { planSamples } from "@/lib/plan-samples";
import { previewAllowed } from "@/lib/preview";

// The free result and the paywall for a sample week, only on a local setup. /start/preview shows the marketing
// coordinator's; add ?sample=law_firm for the executive assistant's, and &drop=hand_back or &drop=hand_to_ai
// (or both, comma separated) to leave out a pile. Nothing is saved; Get my plan here only asks for the quiz.
export const metadata: Metadata = { title: `Result preview · ${offer.name}`, robots: { index: false } };

export default function Page({ searchParams }: PageProps<"/start/preview">) {
  return (
    <div className="quiz">
      <Backdrop progress={1} />
      <QuizHeader progress={1} />
      <main id="main" className="quiz-main">
        <Suspense>
          <Preview searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

async function Preview({ searchParams }: { searchParams: PageProps<"/start/preview">["searchParams"] }) {
  // Reading the address first keeps this page decided per request, so PLAN_PREVIEW at start up is what counts.
  const { sample, drop } = await searchParams;
  if (!previewAllowed) notFound();
  const plan = sample === "law_firm" ? planSamples.law_firm : planSamples.marketing;
  const dropped = String(drop ?? "").split(",");
  const tasks = plan.tasks.filter((t) => !dropped.includes(t.pile));
  return (
    <FreeResult tasks={tasks}>
      <Paywall
        tasks={tasks}
        aiTools={plan.tool ? [plan.tool] : ["not_sure"]}
        aiPolicy={plan.policy}
        knownFor={plan.knownFor}
      />
    </FreeResult>
  );
}
