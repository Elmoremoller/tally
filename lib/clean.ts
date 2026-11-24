// Checks for anything the browser sends. Anyone can call a server action, so nothing is trusted as sent.

export const oneOf = <T extends string>(list: readonly T[], value: unknown): value is T =>
  typeof value === "string" && (list as readonly string[]).includes(value);

/** Trimmed text up to `max` characters, or null when it's empty, too long or not text. */
export const cleanText = (value: unknown, max: number) => {
  const text = typeof value === "string" ? value.trim() : "";
  return text && text.length <= max ? text : null;
};

export const looksLikeEmail = (value: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
