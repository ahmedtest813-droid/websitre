import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon, ChartIcon, CheckIcon, ShieldIcon } from "@/components/ui/Icons";
import { Container } from "@/components/layout/Container";

const trustPoints = [
  { icon: ChartIcon, text: "Transparent, formula-based scores" },
  { icon: ShieldIcon, text: "Every number shows its confidence" },
  { icon: CheckIcon, text: "Free, no account needed" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_80%_0%,rgba(61,108,244,0.35),transparent_70%)]"
      />
      <Container className="relative py-16 sm:py-24">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-300">
            Car decisions for Tunisia
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Find the car that fits your life — and your budget.
          </h1>
          <p className="text-lg text-slate-300 text-pretty">
            Compare cars, estimate real ownership costs and make a smarter car decision.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/find-my-car" size="lg">
              Find My Car
              <ArrowRightIcon className="size-5" />
            </ButtonLink>
            <ButtonLink href="/compare" size="lg" variant="inverted">
              Compare Cars
            </ButtonLink>
          </div>
          <ul className="flex flex-col gap-2 pt-4 text-sm text-slate-300 sm:flex-row sm:gap-6">
            {trustPoints.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2">
                <Icon className="size-4 text-accent-400" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
