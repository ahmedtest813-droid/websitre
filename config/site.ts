export const siteConfig = {
  name: "Find My Cars",
  tagline: "Find the car that fits your budget, lifestyle and real ownership cost.",
  description:
    "Compare cars, estimate real ownership costs and make a smarter car decision in Tunisia.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_TN",
} as const;

export const mainNav = [
  { href: "/find-my-car", label: "Find My Car" },
  { href: "/compare", label: "Compare" },
  { href: "/car-cost", label: "Car Cost" },
] as const;
