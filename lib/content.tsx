import type { ComponentType, SVGProps } from "react";
import { Heart, PauseCircle, Shield } from "@/components/icons";
import { hotline } from "./safety";

// The old offer's words that its quiz and plan pages still use. They go when Phases 3 and 4 replace those
// pages. The landing page's words are in lib/landing.ts.

export const topics = [
  "Chores",
  "Money",
  "Phones and trust",
  "Time with friends",
  "Family",
  "Sharing space",
  "Texts that land wrong",
] as const;


type MethodStep = { title: string; text: string; Icon: ComponentType<SVGProps<SVGSVGElement>> };

export const method: readonly MethodStep[] = [
  { title: "Prevent", text: "Clear the small stuff before it turns into a fight.", Icon: Shield },
  { title: "Pause", text: "Stop a fight from getting bigger, in the moment.", Icon: PauseCircle },
  { title: "Repair", text: "Start making up in 10 minutes, not 3 days.", Icon: Heart },
];



export const faqs = [
  { q: "Is this therapy?", a: "No. It’s practical help for everyday arguments." },
  {
    q: "Why pay when advice is free?",
    a: "Free advice is general. Your plan is built around your answers, with the exact words to use.",
  },
  { q: "Can my partner join?", a: "Yes, for free. Invite them any time to use the same plan. It works on your own too." },
  {
    q: "What if it’s more than arguing?",
    a: (
      <>
        If you ever feel scared or unsafe, please reach out to the National Domestic Violence Hotline: call{" "}
        <a href={hotline.call}>1.800.799.7233</a>, text START to <a href={hotline.text}>88788</a>, or chat at{" "}
        <a href={hotline.chat} target="_blank" rel="noopener noreferrer">
          thehotline.org
        </a>
        . This plan isn’t made for that.
      </>
    ),
  },
] as const;
