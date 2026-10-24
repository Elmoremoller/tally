import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Backdrop } from "@/components/Backdrop";
import { LoginForm } from "@/components/plan/LoginForm";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Open your plan · The Couple Standard",
  robots: { index: false },
};

export default function Page({ searchParams }: PageProps<"/login">) {
  return (
    <>
      <Backdrop progress={0.3} />
      <SiteNav cta={false} />
      <main id="main" className="page-narrow">
        <h1 className="page-title">Open your plan</h1>
        <Suspense>
          <LinkProblem searchParams={searchParams} />
        </Suspense>
        <p className="page-text">Enter the email you used, and we’ll send you a link. No password needed.</p>
        <LoginForm />
        <p className="page-small">
          No plan yet? <Link href="/start">Take the quiz</Link>
        </p>
      </main>
    </>
  );
}

async function LinkProblem({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  const { link } = await searchParams;
  if (link !== "expired") return null;
  return (
    <p className="page-note" role="alert">
      That link has expired or was already used. Enter your email for a new one.
    </p>
  );
}
