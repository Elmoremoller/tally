import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";
import { offer } from "@/lib/offer";

// The quiz. Kept out of search results.
export const metadata: Metadata = {
  title: `Take the quiz · ${offer.name}`,
  robots: { index: false },
};

export default function Page() {
  return <Quiz />;
}
