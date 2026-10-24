import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { requestOrigin } from "./site";

// The project's address and its publishable key are safe to show in the browser: with them the database
// only runs the functions it was given (see supabase/migrations) and shows signed in people their own plan.
// The secret key stays on the server. It is only used to record payments.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;

export const supabaseConfigured = Boolean(url && publishableKey);

const noSession = { auth: { persistSession: false, autoRefreshToken: false } } as const;

function need<T>(value: T | undefined, name: string): T {
  if (!value) throw new Error(`${name} is not set. See SETUP.md.`);
  return value;
}

/** For saving quiz answers and sending login links. Acts as nobody in particular. */
export function supabaseServer() {
  return createClient(need(url, "NEXT_PUBLIC_SUPABASE_URL"), need(publishableKey, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"), noSession);
}

/** Full access, for recording payments from Stripe. Server only. */
export function supabaseAdmin() {
  return createClient(need(url, "NEXT_PUBLIC_SUPABASE_URL"), need(secretKey, "SUPABASE_SECRET_KEY"), noSession);
}

/** Acts as whoever is signed in on this request, using the login cookie. */
export async function supabaseWithSession() {
  const store = await cookies();
  return createServerClient(need(url, "NEXT_PUBLIC_SUPABASE_URL"), need(publishableKey, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"), {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (toSet) => {
        // Pages can read cookies but not write them; the proxy refreshes the login on the next request.
        try {
          toSet.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {}
      },
    },
  });
}

/**
 * Makes sure this email has a login, already confirmed. Without this, Supabase would send a brand new
 * person its "Confirm signup" email instead of the Magic Link one, and that link can't sign them in here.
 * It also means a failed email never leaves a paying customer without a login. Server only.
 */
async function ensureLogin(email: string) {
  const { error } = await supabaseAdmin().auth.admin.createUser({ email, email_confirm: true });
  if (error && error.code !== "email_exists" && !/already/i.test(error.message)) {
    throw new Error(`Could not set up the login for ${email}: ${error.message}`);
  }
}

/**
 * Emails a login link. The email's link opens /auth/confirm on this site (see the Magic Link email in SETUP.md).
 * `create` is true when the person has just paid or was just invited, so their login is set up first.
 */
export async function sendLoginLink(email: string, { create }: { create: boolean }) {
  if (create) await ensureLogin(email);
  const origin = await requestOrigin();
  return supabaseServer().auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false, emailRedirectTo: `${origin}/auth/confirm` },
  });
}
