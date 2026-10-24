import Link from "next/link";
import { SiteNav } from "./SiteNav";

/** A plain holding page for routes that are linked from the landing page but not built yet. */
export function Placeholder({ title }: { title: string }) {
  return (
    <>
      <SiteNav cta={false} />
      <main
        id="main"
        className="wrap grid min-h-[calc(100dvh-var(--nav-h))] content-center justify-items-center gap-4 py-16 text-center"
      >
        <h1 className="heading">{title}</h1>
        <p className="text-lead text-muted">This page is coming soon.</p>
        <Link href="/" className="btn btn-lg mt-4">
          Back to home
        </Link>
      </main>
    </>
  );
}
