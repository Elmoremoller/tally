import { cookies } from "next/headers";
import type { CoupleTypeId, FightMove } from "./quiz";

// After the quiz, the result is kept in a cookie for 30 days, so the paywall can be shown again when
// someone comes back from Stripe without paying. Only this person's browser has it, and the server never
// trusts it for anything but their own checkout.
const NAME = "tcs_result";
const MAX_AGE = 60 * 60 * 24 * 30;

export type QuizResult = {
  email: string;
  coupleType: CoupleTypeId;
  topics: string[];
  you: FightMove;
  partner: FightMove;
  partnerName: string | null;
};

export async function saveResult(result: QuizResult) {
  (await cookies()).set(NAME, Buffer.from(JSON.stringify(result)).toString("base64url"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function readResult(): Promise<QuizResult | null> {
  const raw = (await cookies()).get(NAME)?.value;
  if (!raw) return null;
  try {
    const value = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    return typeof value?.email === "string" && typeof value?.coupleType === "string" ? value : null;
  } catch {
    return null;
  }
}
