import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

// Mirrors the TCO formula used by the Car Cost Calculator (Phase 4):
// depreciation replaces the purchase price, so nothing is counted twice.
const components = [
  { label: "Depreciation", detail: "Purchase price minus resale value" },
  { label: "Financing", detail: "Interest you pay the bank" },
  { label: "Fuel", detail: "Based on your kilometres" },
  { label: "Insurance", detail: "Yearly premium" },
  { label: "Maintenance", detail: "Servicing and repairs" },
  { label: "Taxes & fees", detail: "Vignette, registration" },
];

export function CostEquation() {
  return (
    <section className="border-y border-slate-200 bg-white py-14 sm:py-20" aria-labelledby="cost-heading">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div className="space-y-4">
          <h2 id="cost-heading" className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            We don&apos;t just look at the purchase price.
          </h2>
          <p className="text-slate-600">
            Two cars with the same price can cost very different amounts to own. We estimate what a car really
            costs you over the years — and show every part of the calculation.
          </p>
          <ButtonLink href="/car-cost" variant="secondary">
            Calculate a car&apos;s real cost
          </ButtonLink>
        </div>

        <div>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {components.map((item, i) => (
              <li key={item.label} className="relative rounded-xl border border-slate-200 bg-slate-50 p-4">
                {i > 0 && (
                  <span
                    aria-hidden
                    className="absolute -top-2.5 left-4 grid size-5 place-items-center rounded-full bg-white text-sm font-bold text-primary-600 ring-1 ring-slate-200"
                  >
                    +
                  </span>
                )}
                <p className="font-semibold text-slate-900">{item.label}</p>
                <p className="text-sm text-slate-500">{item.detail}</p>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-ink-900 p-4 text-white">
            <span className="text-lg font-bold" aria-hidden>
              =
            </span>
            <span className="flex-1 text-lg font-semibold">Real cost of ownership</span>
            <span className="w-full text-sm text-slate-300 sm:w-auto">per month · per year · per km</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
