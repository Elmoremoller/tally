"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Asks the server for the page again every few seconds, so her plan opens by itself once it's written. */
export function AutoRefresh({ seconds }: { seconds: number }) {
  const router = useRouter();
  useEffect(() => {
    const timer = window.setInterval(() => router.refresh(), seconds * 1000);
    return () => window.clearInterval(timer);
  }, [router, seconds]);
  return null;
}
