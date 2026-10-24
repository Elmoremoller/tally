import type { Metadata } from "next";
import { Quiz } from "@/components/quiz/Quiz";

// The quiz. Kept out of search results.
export const metadata: Metadata = {
  title: "Get started · The Couple Standard",
  robots: { index: false },
};

export default function Page() {
  return <Quiz />;
}
