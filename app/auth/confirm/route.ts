import type { EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { AFTER_SIGN_IN_COOKIE, afterSignIn } from "@/lib/after-sign-in";
import { supabaseWithSession } from "@/lib/supabase";

// The link in the login email lands here. It signs the person in on this browser, then opens their plan,
// or the check in if that's what they opened before signing in.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  const supabase = await supabaseWithSession();
  const { error } = tokenHash && type
    ? await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    : code
      ? await supabase.auth.exchangeCodeForSession(code)
      : { error: new Error("No token in the link") };

  const jar = await cookies();
  const next = afterSignIn(jar.get(AFTER_SIGN_IN_COOKIE)?.value);
  if (!error) jar.delete(AFTER_SIGN_IN_COOKIE);
  return NextResponse.redirect(new URL(error ? "/login?link=expired" : next, origin));
}
