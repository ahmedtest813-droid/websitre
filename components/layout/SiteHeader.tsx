import Link from "next/link";
import { mainNav, siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark, MenuIcon } from "@/components/ui/Icons";
import { Container } from "./Container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-ink-900">
          <LogoMark className="size-8" />
          <span>{siteConfig.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink href="/find-my-car" className="ml-2">
            Find My Car
          </ButtonLink>
        </nav>

        {/* Mobile menu: native <details>, works without JavaScript */}
        <details className="group relative md:hidden">
          <summary
            className="grid size-10 cursor-pointer list-none place-items-center rounded-lg text-slate-700 hover:bg-slate-100 [&::-webkit-details-marker]:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="size-6" />
          </summary>
          <nav
            aria-label="Main"
            className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
          >
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2.5 font-medium text-slate-800 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </Container>
    </header>
  );
}
