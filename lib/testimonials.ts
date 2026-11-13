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
//
// Until then the placeholders further down fill the section, to show how the page will look. They are invented
// and never show on the live site.

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

/** Invented names and words for showcasing the page, never real people. */
export const placeholderTestimonials: readonly Testimonial[] = [
  {
    quote: "I used to take notes in every single meeting. The plan gave me **one polite line to hand it back**, and it worked the first time.",
    name: "Megan T.",
    detail: "Project coordinator, Columbus",
  },
  {
    quote: "Took the quiz on my lunch break. Seeing my hours written down was **a little embarrassing, honestly**, but so useful.",
    name: "Priya S.",
    detail: "Marketing manager, Austin",
  },
  {
    quote: "My company is weird about AI, so I liked that it **stuck to what we’re actually allowed** to use.",
    name: "Dana L.",
    detail: "Paralegal, Chicago",
  },
  {
    quote: "The work profile for Copilot was **ready to paste**. I had it set up before my coffee got cold.",
    name: "Rachel K.",
    detail: "Executive assistant, Atlanta",
  },
  { quote: "I finally said no to planning the holiday party. **Nobody even blinked.**", name: "Lauren M.", detail: "Account manager, Denver" },
  { quote: "It’s not another course, thankfully. **Ten minutes and I had a plan.**", name: "Keisha W.", detail: "Operations lead, Charlotte" },
  {
    quote: "The script for talking to my manager about AI was the best part. **She asked me to show the whole team.**",
    name: "Emily R.",
    detail: "HR generalist, Minneapolis",
  },
  {
    quote: "I got **about five hours back** in my first week, mostly from status updates I used to write by hand.",
    name: "Sofia G.",
    detail: "Office manager, Phoenix",
  },
  {
    quote: "It felt like it was written by someone who’s sat in my meetings. **Weirdly specific, in a good way.**",
    name: "Hannah B.",
    detail: "Sales coordinator, Nashville",
  },
  {
    quote: "I’d been using ChatGPT in secret for months. Now **I use it out in the open** and get credit for it.",
    name: "Jasmine P.",
    detail: "Financial analyst, Seattle",
  },
  { quote: "Sent it to two friends at work the same day. **We’re all handing stuff back now.**", name: "Caroline D.", detail: "Program manager, Boston" },
  {
    quote: "The visibility plan picked one project for me to own. **My review this year was the best I’ve had.**",
    name: "Natalie H.",
    detail: "Recruiter, San Diego",
  },
];

/** Real reviews of the beginner version (lib/beginner), added the same way. Its page shows these, never the first version's. */
export const beginnerTestimonials: readonly Testimonial[] = [];

/** The live site: a production deploy on Vercel. Local setups and Vercel preview links are not. */
const live = process.env.VERCEL_ENV === "production";

/** What the landing page shows: the real reviews once there are enough, the placeholders before that, but never on the live site. */
export const landingTestimonials = testimonials.length >= reviewsMinimum || live ? testimonials : placeholderTestimonials;

/** The same rule for the beginner page, with its own real reviews. Until it has them it borrows the placeholders above (the user's call, 2026-11-11). */
export const beginnerLandingTestimonials =
  beginnerTestimonials.length >= reviewsMinimum || live ? beginnerTestimonials : placeholderTestimonials;
