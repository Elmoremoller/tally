import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { Reveal } from "@/components/quiz/Reveal";
import { readResult } from "@/lib/result-cookie";

// The couple type and the paywall again, for someone coming back from Stripe without paying.
export const metadata: Metadata = {
  title: "Your pattern · The Couple Standard",
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
  const result = await readResult();
  if (!result) redirect("/start");
  return (
    <Reveal
      coupleType={result.coupleType}
      topics={result.topics}
      you={result.you}
      partner={result.partner}
      partnerName={result.partnerName}
    />
  );
}
