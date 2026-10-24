import { cookies } from "next/headers";

// Which quiz session this browser is on. Set when she answers the first question, kept for 30 days so her
// free result and the paywall can come back after a trip to Stripe. Only her browser has it, and every
// server action reads it here rather than trusting an id sent from the page.
const NAME = "wht_session";
const MAX_AGE = 60 * 60 * 24 * 30;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function readSessionId(): Promise<string | null> {
  const value = (await cookies()).get(NAME)?.value;
  return value && UUID.test(value) ? value : null;
}

export async function rememberSession(id: string) {
  (await cookies()).set(NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}
