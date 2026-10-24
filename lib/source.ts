import { angleFor, type AngleId } from "./offer";

// Where a visitor came from: the ad angle and UTM values in the landing page's address. proxy.ts keeps them
// in a cookie for 30 days, and the quiz copies them onto her session when it starts. The latest ad she came
// from wins. This file imports nothing from the server, so the proxy can use it.

export const SOURCE_COOKIE = "wht_source";
export const SOURCE_MAX_AGE = 60 * 60 * 24 * 30;

export type Source = {
  angle: AngleId;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
};

const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
const clean = (value: string | null | undefined) => value?.trim().slice(0, 200) || null;

/** The source in a landing page address, or null when it carries no angle and no UTM values. */
export function sourceFrom(params: URLSearchParams): Source | null {
  if (!params.has("angle") && !UTM.some((key) => params.has(key))) return null;
  return {
    angle: angleFor(params.get("angle")),
    utm_source: clean(params.get("utm_source")),
    utm_medium: clean(params.get("utm_medium")),
    utm_campaign: clean(params.get("utm_campaign")),
    utm_content: clean(params.get("utm_content")),
  };
}

export const writeSource = (source: Source) => encodeURIComponent(JSON.stringify(source));

/** The source kept in the cookie, checked like anything else from the browser. Default when there is none. */
export function readSource(value: string | undefined): Source {
  let raw: Record<string, unknown> = {};
  try {
    raw = value ? JSON.parse(decodeURIComponent(value)) : {};
  } catch {}
  const text = (v: unknown) => (typeof v === "string" ? clean(v) : null);
  return {
    angle: angleFor(raw.angle),
    utm_source: text(raw.utm_source),
    utm_medium: text(raw.utm_medium),
    utm_campaign: text(raw.utm_campaign),
    utm_content: text(raw.utm_content),
  };
}
