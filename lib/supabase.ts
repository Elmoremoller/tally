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
 * Her login's id, setting one up (already confirmed) if she has none yet. Without a confirmed login,
 * Supabase would send its "Confirm signup" email instead of the Magic Link one. Server only.
 */
async function loginId(email: string) {
  const admin = supabaseAdmin().auth.admin;
  const { data, error } = await admin.createUser({ email, email_confirm: true });
  if (data?.user) return data.user.id;
  if (error && error.code !== "email_exists" && !/already/i.test(error.message)) {
    throw new Error(`Could not set up the login for ${email}: ${error.message}`);
  }
  // She has one already. Looked up in the database (20261024130000_login_lookup.sql), since asking Supabase
  // Auth for a link would count as an email and hold the real one back for a minute.
  const found = await supabaseAdmin().rpc("login_id_for_email", { p_email: email });
  if (found.error || !found.data) throw new Error(`Could not find the login for ${email}: ${found.error?.message ?? "none"}`);
  return found.data as string;
}

/**
 * Emails her the private link to her plan. The link is kept on her login (user_metadata.plan_url) and the
 * Magic Link email shows it (see SETUP.md), so the email opens her plan directly and keeps working. Pass
 * `origin` where there's no request to read the site's address from, like after a response has gone out.
 */
export async function sendPlanEmail(email: string, planUrl: string, origin?: string) {
  const id = await loginId(email);
  const { error } = await supabaseAdmin().auth.admin.updateUserById(id, { user_metadata: { plan_url: planUrl } });
  if (error) throw new Error(`Could not keep the plan link for ${email}: ${error.message}`);
  return supabaseServer().auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false, emailRedirectTo: `${origin ?? (await requestOrigin())}/auth/confirm` },
  });
}
