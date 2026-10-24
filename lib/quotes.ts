// Founding couple quotes for the landing page. Only real ones: answers to "What would you tell another couple
// about it?" in the two weeks in and month in check ins, from people who ticked "You can show this on the
// website with my first name". Find them in Supabase's founding_quotes view (see SETUP.md).
//
// - Copy each quote word for word. Fix an obvious typo at most, and never change what it says.
// - Leave out any that name their partner or give away something private.
// - Pick for variety, not only the warmest ones.
// - If founding couples got anything for free or for less, the section has to say so.
// - If someone asks to be deleted, or changes their mind, take theirs out here too.
//
// The section stays hidden until there are at least QUOTES_MIN of them.

export type FoundingQuote = {
  quote: string;
  /** The first name from the founding_quotes view. */
  name: string;
};

export const QUOTES_MIN = 3;

export const foundingQuotes: readonly FoundingQuote[] = [];
