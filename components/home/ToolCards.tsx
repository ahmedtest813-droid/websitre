import Link from "next/link";
import { ArrowRightIcon, CalculatorIcon, CompareIcon, SearchIcon } from "@/components/ui/Icons";
import { Container } from "@/components/layout/Container";

const tools = [
  {
    href: "/find-my-car",
    icon: SearchIcon,
    title: "Find My Car",
    text: "Answer 8 quick questions and get cars ranked for your budget, usage and priorities.",
    cta: "Start the questionnaire",
  },
  {
    href: "/compare",
    icon: CompareIcon,
    title: "Compare Cars",
    text: "Put two cars side by side: price, consumption, space, safety and monthly cost.",
    cta: "Compare two cars",
  },
  {
    href: "/car-cost",
    icon: CalculatorIcon,
    title: "Calculate Car Cost",
    text: "Estimate financing, fuel, insurance, maintenance and depreciation over the years you own it.",
    cta: "Calculate the real cost",
  },
];

export function ToolCards() {
  return (
    <section className="py-14 sm:py-20" aria-labelledby="tools-heading">
      <Container className="space-y-8">
        <h2 id="tools-heading" className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          What are you looking for?
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tools.map(({ href, icon: Icon, title, text, cta }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-4 rounded-card border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary-500"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-primary-50 text-primary-600">
                <Icon className="size-6" />
              </span>
              <span className="space-y-2">
                <span className="block text-lg font-semibold text-slate-900">{title}</span>
                <span className="block text-slate-600">{text}</span>
              </span>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
                {cta}
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
