import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Only list pages that are live and indexable. Add /compare, /car-cost and car
// profile pages (/cars/[brand]/[model]) here as each phase ships.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/find-my-car`, changeFrequency: "monthly", priority: 0.9 },
  ];
}
