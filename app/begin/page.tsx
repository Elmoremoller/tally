import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { BeginnerQuiz } from "@/components/beginner/BeginnerQuiz";
import { isBeginner, offer } from "@/lib/offer";
import { readSource, SOURCE_COOKIE } from "@/lib/source";

// The beginner quiz (lib/beginner). The beginner landing pages' buttons open it. Kept out of search results.
export const metadata: Metadata = {
  title: `Take the quiz · ${offer.name}`,
  robots: { index: false },
};

export default function Page() {
  return (
    <Suspense>
      <Begin />
    </Suspense>
  );
}

/** Back and the logo go to the beginner page she came from, not the first version's. */
async function Begin() {
  const { angle } = readSource((await cookies()).get(SOURCE_COOKIE)?.value);
  return <BeginnerQuiz home={`/?angle=${isBeginner(angle) ? angle : "new_to_ai"}`} />;
}
