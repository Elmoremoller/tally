// Where the link in the login email opens: their plan, or the check in when that's what they opened before
// being asked to sign in, so a check in link sent by email still lands on the check in. A cookie remembers
// it for an hour, on that browser only. This file imports nothing, so Node can test it.

export const AFTER_SIGN_IN_COOKIE = "tcs_after_sign_in";
export const AFTER_SIGN_IN_MAX_AGE = 60 * 60;
const pages: Record<string, string> = { "check-in": "/plan/check-in" };

/** What to remember for a page opened before signing in, or null when it's not one we come back to. */
export const rememberFor = (pathname: string) => Object.keys(pages).find((key) => pages[key] === pathname) ?? null;

/** Where to go once signed in. Only ever one of our own pages. */
export const afterSignIn = (remembered: string | undefined) =>
  remembered && Object.hasOwn(pages, remembered) ? pages[remembered] : "/plan";
