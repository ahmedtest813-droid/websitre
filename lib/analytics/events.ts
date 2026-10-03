import type { Condition, FuelPreference, TransmissionPreference, Usage } from "@/lib/find-my-car/types";

// Every analytics event and its allowed properties.
// Privacy rules: no personal data, no free text, no exact budgets — bands only.

export interface AnalyticsEvents {
  find_my_car_started: Record<string, never>;
  find_my_car_completed: {
    budget_band: string;
    condition: Condition;
    usage: Usage;
    fuel: FuelPreference;
    transmission: TransmissionPreference;
    /** Comma-separated priority ids, or "none". */
    priorities: string;
  };
  car_result_viewed: { car: string; rank: number };
  compare_started: Record<string, never>;
  compare_completed: { pair: string };
  cost_calculator_started: Record<string, never>;
  cost_calculator_completed: { ownership_years: number };
  used_car_started: Record<string, never>;
}

export type AnalyticsEventName = keyof AnalyticsEvents;

const BUDGET_BANDS = [20_000, 30_000, 45_000, 60_000, 80_000, 120_000, 200_000];

/** 47,500 → "45k-60k". Coarse bands so a budget can't identify anyone. */
export function budgetBand(budget: number): string {
  const k = (n: number) => `${n / 1000}k`;
  if (budget < BUDGET_BANDS[0]) return `<${k(BUDGET_BANDS[0])}`;
  for (let i = 1; i < BUDGET_BANDS.length; i++) {
    if (budget < BUDGET_BANDS[i]) return `${k(BUDGET_BANDS[i - 1])}-${k(BUDGET_BANDS[i])}`;
  }
  return `${k(BUDGET_BANDS[BUDGET_BANDS.length - 1])}+`;
}
