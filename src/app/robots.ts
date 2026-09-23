import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

// `output: "export"` requires every route to be static, so the route handler
// must opt out of any dynamic evaluation.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
