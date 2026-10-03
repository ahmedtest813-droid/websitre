import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/find-my-car/result/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
