import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

const steps = [
  {
    title: "Tell us what you need",
    text: "Budget, how you drive, fuel, transmission, passengers and up to 3 priorities.",
  },
  {
    title: "We filter and score",
    text: "Cars that don't meet your must-haves are removed. The rest are scored on 10 criteria, weighted by your priorities.",
  },
  {
    title: "See why, not just what",
    text: "Each match shows its score breakdown, the reasons behind it and how confident we are in the data.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-14 sm:py-20" aria-labelledby="how-heading">
      <Container className="space-y-8">
        <h2 id="how-heading" className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
          How Find My Car works
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-4 md:flex-col">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-600 font-bold text-white tabular-nums">
                {i + 1}
              </span>
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">{step.title}</p>
                <p className="text-slate-600">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <ButtonLink href="/find-my-car" size="lg" className="w-full sm:w-auto">
          Find My Car
        </ButtonLink>
      </Container>
    </section>
  );
}
