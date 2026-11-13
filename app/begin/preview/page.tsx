import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { BeginnerPaywall, FirstWinResult } from "@/components/beginner/FirstWinResult";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { beginnerSampleFor, beginnerSamples } from "@/lib/beginner/samples";
import { offer } from "@/lib/offer";
import { previewAllowed } from "@/lib/preview";

// The beginner version's free result and paywall for a sample, only on a local setup. /begin/preview shows the
// dental office receptionist's; add ?sample=salon or ?sample=nurse for the others. Nothing is saved; Get my
// plan here only asks for the quiz.
export const metadata: Metadata = {
  title: `First win preview · ${offer.name}`,
  robots: { index: false },
};

export default function Page({ searchParams }: PageProps<"/begin/preview">) {
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

async function Preview({ searchParams }: { searchParams: PageProps<"/begin/preview">["searchParams"] }) {
  const { sample } = await searchParams;
  if (!previewAllowed) notFound();
  const { firstWin, ideas, plan } = beginnerSampleFor(sample) ?? beginnerSamples.dental;
  return (
    <FirstWinResult firstWin={firstWin} ideas={ideas} restricted={plan.policy === "restricted"}>
      <BeginnerPaywall />
    </FirstWinResult>
  );
}
