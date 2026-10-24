import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";

// The brand's type is Times New Roman Condensed for headings and Neue Montreal for everything else. Both
// need a paid web licence, so until there is one these free, openly licensed look-alikes stand in, served
// from this site like any other file. To switch, swap each call for next/font/local pointing at the
// licensed files and keep the variable names: globals.css only reads --brand-serif and --brand-sans.

/** Headings. A condensed serif in one weight, regular and italic, close to Times New Roman Condensed. */
export const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--brand-serif",
  display: "swap",
});

/** Body text, buttons and labels. A plain grotesk close to Neue Montreal. */
export const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--brand-sans",
  display: "swap",
});
