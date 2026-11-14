import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// The pages search engines should list. Angle pages are left out: they all point at / as their canonical page.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
