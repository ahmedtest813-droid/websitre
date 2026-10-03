import type {
  AnswerKey,
  Condition,
  FuelPreference,
  PassengerGroup,
  Priority,
  TransmissionPreference,
  Usage,
} from "@/lib/find-my-car/types";

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

export const BUDGET_LIMITS = { min: 5_000, max: 1_000_000 } as const;
export const BUDGET_SUGGESTIONS = [30_000, 45_000, 60_000, 80_000, 120_000] as const;

export const MONTHLY_KM_LIMITS = { min: 50, max: 20_000 } as const;

/** Each preset stores a representative value used for cost estimates. */
export const DISTANCE_PRESETS = [
  { id: "lt-500", label: "Less than 500 km", value: 400 },
  { id: "500-1000", label: "500–1,000 km", value: 750 },
  { id: "1000-2000", label: "1,000–2,000 km", value: 1_500 },
  { id: "gt-2000", label: "More than 2,000 km", value: 2_500 },
] as const;

export const MAX_PRIORITIES = 3;

export const CONDITION_OPTIONS: ChoiceOption<Condition>[] = [
  { value: "new", label: "New", hint: "From an official dealer" },
  { value: "used", label: "Used", hint: "Second-hand market" },
  { value: "both", label: "Both", hint: "Show me the best option either way" },
];

export const USAGE_OPTIONS: ChoiceOption<Usage>[] = [
  { value: "city", label: "Mostly city", hint: "Traffic, short trips, parking" },
  { value: "highway", label: "Mostly highway", hint: "Long distances, higher speeds" },
  { value: "mixed", label: "Mixed", hint: "A bit of everything" },
];

export const FUEL_OPTIONS: ChoiceOption<FuelPreference>[] = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" },
  { value: "any", label: "No preference" },
];

export const TRANSMISSION_OPTIONS: ChoiceOption<TransmissionPreference>[] = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automatic" },
  { value: "any", label: "No preference" },
];

export const PASSENGER_OPTIONS: ChoiceOption<PassengerGroup>[] = [
  { value: "1-2", label: "1–2 people" },
  { value: "3-4", label: "3–4 people" },
  { value: "5+", label: "5 or more" },
];

export const PRIORITY_OPTIONS: ChoiceOption<Priority>[] = [
  { value: "low_price", label: "Low price" },
  { value: "fuel_economy", label: "Fuel economy" },
  { value: "running_cost", label: "Low running cost" },
  { value: "reliability", label: "Reliability" },
  { value: "safety", label: "Safety" },
  { value: "comfort", label: "Comfort" },
  { value: "space", label: "Family / space" },
  { value: "performance", label: "Performance" },
  { value: "resale", label: "Resale value" },
];

/** Question order and copy. Reorder here to change the questionnaire flow. */
export const QUESTIONS: { id: AnswerKey; title: string; description?: string }[] = [
  {
    id: "budget",
    title: "What is your car budget?",
    description: "The maximum you want to spend on the car, in Tunisian dinars.",
  },
  { id: "condition", title: "New or used?" },
  { id: "usage", title: "How will you mainly use the car?" },
  {
    id: "monthlyKm",
    title: "How far do you drive per month?",
    description: "Used to estimate fuel and running costs.",
  },
  { id: "fuel", title: "Which fuel do you want?" },
  { id: "transmission", title: "Which transmission?" },
  { id: "passengers", title: "How many people will usually ride in the car?" },
  {
    id: "priorities",
    title: "What matters most to you?",
    description: `Pick up to ${MAX_PRIORITIES}. Optional — skip it to weigh everything evenly.`,
  },
];

export function labelFor<T extends string>(options: ChoiceOption<T>[], value: T): string {
  return options.find((o) => o.value === value)?.label ?? value;
}
