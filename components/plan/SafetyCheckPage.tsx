import { cookies } from "next/headers";
import { Backdrop } from "@/components/Backdrop";
import { SAFETY_ASKED_COOKIE } from "@/lib/safety";
import { SafetyCheck } from "./SafetyCheck";

/** True for an invited partner who hasn't been asked the safety question in this browser yet. */
export async function needsSafetyCheck(role: "owner" | "partner") {
  return role === "partner" && !(await cookies()).has(SAFETY_ASKED_COOKIE);
}

/** The safety question on its own page, before an invited partner's plan opens. */
export function SafetyCheckPage() {
  return (
    <main id="main" className="page-narrow">
      <Backdrop progress={0.3} />
      <SafetyCheck />
    </main>
  );
}
