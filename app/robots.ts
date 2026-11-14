import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Lets search engines read the public pages and points them at the sitemap. Private pages (quiz, plan, login)
// already say noindex themselves, so they stay crawlable here or the engines would never see that.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
