import Link from "next/link";
import type { ReactNode } from "react";
import { company, type LegalPage } from "@/lib/legal";

/** The words in the pages that open something: the Privacy page, and our email once it's real. */
const targets: Record<string, { href: string; external?: boolean }> = {
  "Privacy page": { href: "/privacy" },
  ...(company.email.includes("@") ? { [company.email]: { href: `mailto:${company.email}` } } : {}),
};
const pattern = new RegExp(
  Object.keys(targets)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"),
  "g",
);

/** The approved words exactly, with those in `targets` made into links. */
function linked(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const word = match[0];
    const { href, external } = targets[word];
    parts.push(text.slice(last, match.index));
    parts.push(
      href.startsWith("/") ? (
        <Link key={match.index} href={href}>
          {word}
        </Link>
      ) : (
        <a key={match.index} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {word}
        </a>
      ),
    );
    last = match.index + word.length;
  }
  parts.push(text.slice(last));
  return parts;
}

/** The privacy or terms page: its title and date, then short sections under plain headings. */
export function LegalDocument({ page }: { page: LegalPage }) {
  return (
    <article className="legal" aria-labelledby={`${page.key}-title`}>
      <header className="legal-head">
        <h1 id={`${page.key}-title`} className="page-title">
          {page.title}
        </h1>
        <p className="legal-updated">{page.updated}</p>
        <p className="legal-intro">{linked(page.intro)}</p>
      </header>
      {page.sections.map((section, i) => (
        <section key={section.title} className="legal-section" aria-labelledby={`${page.key}-${i}`}>
          <h2 id={`${page.key}-${i}`} className="legal-title">
            {section.title}
          </h2>
          {section.blocks.map((block, j) =>
            "list" in block ? (
              <ul key={j} className="legal-list">
                {block.list.map((item) => (
                  <li key={item}>{linked(item)}</li>
                ))}
              </ul>
            ) : (
              <p key={j} className="legal-text">
                {linked(block.p)}
              </p>
            ),
          )}
        </section>
      ))}
    </article>
  );
}
