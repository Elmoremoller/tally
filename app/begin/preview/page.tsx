import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { BeginnerPaywall, FirstWinResult } from "@/components/beginner/FirstWinResult";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { freePlanFor, offerFor, orderMap } from "@/lib/beginner/free-result";
import { sampleWho, withLevels } from "@/lib/beginner/levels";
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
  const sampled = beginnerSampleFor(sample) ?? beginnerSamples.dental;
  const { firstWin, free, plan } = sampled;
  // Levels and the offer are chosen as on the live result, from her path, her answers and her own tasks.
  const map = orderMap(withLevels(free.map, sampleWho(sampled)), firstWin.task);
  const offer = offerFor({
    track: free.track,
    tool: plan.tool,
    map,
    top: firstWin.task,
    device: free.device,
    restricted: plan.policy === "restricted",
  });
  return (
    <FirstWinResult result={{ firstWin, map }} restricted={plan.policy === "restricted"}>
      <BeginnerPaywall {...offer} freePlan={freePlanFor(map, firstWin.task)} />
    </FirstWinResult>
  );
}
