import type { Priority } from "@/lib/find-my-car/types";

// Find My Car scoring configuration.
// Tune the recommendation engine here — the algorithm in lib/scoring reads these
// values and must not hardcode its own.

export const SCORING_CONFIG_VERSION = "2026-10-v1";

export const CRITERIA = [
  "budgetFit",
  "usageFit",
  "runningCost",
  "fuelEconomy",
  "reliability",
  "safety",
  "space",
  "comfort",
  "resale",
  "performance",
] as const;

export type Criterion = (typeof CRITERIA)[number];

/** Base weights in percent. Must sum to 100. */
export const BASE_WEIGHTS: Record<Criterion, number> = {
  budgetFit: 20,
  usageFit: 15,
  runningCost: 15,
  fuelEconomy: 10,
  reliability: 10,
  safety: 10,
  space: 8,
  comfort: 5,
  resale: 5,
  performance: 2,
};

/** Selecting a priority multiplies the weight of its criterion, then all weights are re-normalised. */
export const PRIORITY_MULTIPLIERS: Record<Priority, { criterion: Criterion; multiplier: number }> = {
  low_price: { criterion: "budgetFit", multiplier: 1.5 },
  fuel_economy: { criterion: "fuelEconomy", multiplier: 1.7 },
  running_cost: { criterion: "runningCost", multiplier: 1.7 },
  reliability: { criterion: "reliability", multiplier: 1.7 },
  safety: { criterion: "safety", multiplier: 1.7 },
  comfort: { criterion: "comfort", multiplier: 1.5 },
  space: { criterion: "space", multiplier: 1.7 },
  performance: { criterion: "performance", multiplier: 1.5 },
  resale: { criterion: "resale", multiplier: 1.5 },
};

export const CRITERION_LABELS: Record<Criterion, string> = {
  budgetFit: "Budget fit",
  usageFit: "Usage fit",
  runningCost: "Running cost",
  fuelEconomy: "Fuel economy",
  reliability: "Reliability",
  safety: "Safety",
  space: "Space",
  comfort: "Comfort",
  resale: "Resale value",
  performance: "Performance",
};

export const RESULTS_LIMIT = 5;
