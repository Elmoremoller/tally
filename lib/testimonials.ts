// Reviews from real buyers, shown on the landing page in two rows that drift sideways. The section stays
// hidden until there are at least three. Only real people, about this plan, in their own words, with their
// permission to be named: invented or edited reviews are against the FTC's rules and the brief.
//
// To add one, copy the example below into the list. Put **two stars** around the words to show in bold.
//
//   {
//     quote: "I got **six hours back** in my first week, and my manager finally saw the project I care about.",
//     name: "Jamie R.",
//     detail: "Office manager, Denver",
//   },

export type Testimonial = {
  /** Her words as she wrote them. **Two stars** around a phrase show it in bold. */
  quote: string;
  /** As she agreed to be named, like "Jamie R." */
  name: string;
  /** Optional line under the name, like her role or city. */
  detail?: string;
};

/** The section's title, approved on 2026-10-24. */
export const reviewsTitle = "In their own words";

/** Fewer than this and the section stays hidden. */
export const reviewsMinimum = 3;

export const testimonials: readonly Testimonial[] = [];
