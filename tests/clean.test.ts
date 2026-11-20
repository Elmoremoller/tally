import test from "node:test";
import assert from "node:assert/strict";
import { cleanText, looksLikeEmail, oneOf } from "../lib/clean";

// These checks guard every quiz answer and the login email before the server trusts them.

test("cleanText trims and keeps text within the limit", () => {
  assert.equal(cleanText("  Electrician, my own business  ", 100), "Electrician, my own business");
  assert.equal(cleanText("abc", 3), "abc");
});

test("cleanText turns empty or blank text into null", () => {
  assert.equal(cleanText("", 100), null);
  assert.equal(cleanText("   \n\t ", 100), null);
});

test("cleanText refuses text over the limit, measured after trimming", () => {
  assert.equal(cleanText("abcd", 3), null);
  assert.equal(cleanText("  abc  ", 3), "abc");
});

test("cleanText refuses anything that is not text", () => {
  for (const value of [undefined, null, 42, true, ["a"], { text: "a" }]) assert.equal(cleanText(value, 100), null);
});

test("oneOf accepts only values on the list", () => {
  const tools = ["chatgpt", "claude", "other"] as const;
  assert.equal(oneOf(tools, "claude"), true);
  assert.equal(oneOf(tools, "gemini"), false);
  assert.equal(oneOf(tools, "Claude"), false);
  assert.equal(oneOf(tools, " claude"), false);
  assert.equal(oneOf(tools, ""), false);
});

test("oneOf refuses anything that is not text", () => {
  const tools = ["chatgpt", "claude"] as const;
  for (const value of [undefined, null, 0, ["claude"], { id: "claude" }]) assert.equal(oneOf(tools, value), false);
});

test("looksLikeEmail accepts ordinary addresses", () => {
  for (const email of ["sam@example.com", "sam.lee+tally@mail.example.co.uk", "a@b.io"])
    assert.equal(looksLikeEmail(email), true, email);
});

test("looksLikeEmail refuses addresses that cannot work", () => {
  for (const email of ["", "sam", "sam@", "@example.com", "sam@example", "sam @example.com", "sam@exa mple.com", "sam@@example.com"])
    assert.equal(looksLikeEmail(email), false, email);
});
