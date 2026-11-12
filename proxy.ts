import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isBeginner } from "@/lib/offer";
import { readSource, SOURCE_COOKIE, SOURCE_MAX_AGE, sourceFrom, writeSource } from "@/lib/source";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/") return landing(request);
  return plan(request);
}

/**
 * The landing page. An ad's ?angle= is served from the page built for that angle, while the address keeps
 * the angle in it; a missing or unknown angle gets the default page. The angle and any UTM values are kept
 * in a cookie, so the quiz can put them on her session.
 */
function landing(request: NextRequest) {
  const source = sourceFrom(request.nextUrl.searchParams);
  // Someone who came in on a beginner angle keeps the beginner page when she comes back to / without it, from
  // the logo or a bookmark: it's a different page, not just a different headline.
  const kept = source ? null : readSource(request.cookies.get(SOURCE_COOKIE)?.value).angle;
  const angle = source?.angle ?? (kept && isBeginner(kept) ? kept : "default");
  const response =
    angle !== "default"
      ? NextResponse.rewrite(new URL(`/angle/${angle}${request.nextUrl.search}`, request.url))
      : NextResponse.next();
  if (source) {
    response.cookies.set(SOURCE_COOKIE, writeSource(source), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SOURCE_MAX_AGE,
    });
  }
  return response;
}

// Keeps her signed in where the email's link lands: Supabase logins last an hour, and this quietly renews
// them. It does not decide who may see a plan; the plan's private link does that.
async function plan(request: NextRequest) {
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
  await supabase.auth.getClaims();
  return response;
}

export const config = {
  matcher: ["/", "/plan"],
};
