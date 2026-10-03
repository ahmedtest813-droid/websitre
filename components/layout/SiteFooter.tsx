import Link from "next/link";
import { mainNav, siteConfig } from "@/config/site";
import { Container } from "./Container";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <Container className="flex flex-col gap-6 py-10 text-sm text-slate-600 sm:flex-row sm:justify-between">
        <div className="max-w-md space-y-2">
          <p className="font-semibold text-slate-900">{siteConfig.name}</p>
          <p>
            Costs, scores and prices are estimates based on the data we hold, which may be incomplete.
            They are not guarantees or financial advice. Always confirm with the dealer or seller.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-slate-900">
              {item.label}
            </Link>
          ))}
          <Link href="/used-car-price" className="hover:text-slate-900">
            Used Car Fair Price
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
