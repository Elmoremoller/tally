import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { AFTER_SIGN_IN_COOKIE, AFTER_SIGN_IN_MAX_AGE, rememberFor } from "@/lib/after-sign-in";

// Keeps people signed in on their plan: Supabase logins last an hour, and this quietly renews them
// on every visit. It does not decide who may see a plan; the plan page and the database do that.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet, headers) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });
  const { data } = await supabase.auth.getClaims();
  // Someone signed out who opens the check in gets it again after signing in from the email link.
  const remember = data?.claims ? null : rememberFor(request.nextUrl.pathname);
  if (remember) {
    response.cookies.set(AFTER_SIGN_IN_COOKIE, remember, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: AFTER_SIGN_IN_MAX_AGE,
    });
  }
  return response;
}

export const config = {
  matcher: ["/plan/:path*"],
};
