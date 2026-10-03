// Canonical answer values for the Find My Car questionnaire.
// Labels and copy live in config/find-my-car.ts; these are the stable machine values
// used by validation, share codes and (Phase 2) the scoring engine.

export const CONDITIONS = ["new", "used", "both"] as const;
export const USAGES = ["city", "highway", "mixed"] as const;
export const FUEL_PREFERENCES = ["petrol", "diesel", "hybrid", "electric", "any"] as const;
export const TRANSMISSION_PREFERENCES = ["manual", "automatic", "any"] as const;
export const PASSENGER_GROUPS = ["1-2", "3-4", "5+"] as const;
export const PRIORITIES = [
  "low_price",
  "fuel_economy",
  "running_cost",
  "reliability",
  "safety",
  "comfort",
  "space",
  "performance",
  "resale",
] as const;

export type Condition = (typeof CONDITIONS)[number];
export type Usage = (typeof USAGES)[number];
export type FuelPreference = (typeof FUEL_PREFERENCES)[number];
export type TransmissionPreference = (typeof TRANSMISSION_PREFERENCES)[number];
export type PassengerGroup = (typeof PASSENGER_GROUPS)[number];
export type Priority = (typeof PRIORITIES)[number];

export interface FindMyCarAnswers {
  /** Maximum budget in TND. */
  budget: number;
  condition: Condition;
  usage: Usage;
  /** Kilometres driven per month. */
  monthlyKm: number;
  fuel: FuelPreference;
  transmission: TransmissionPreference;
  passengers: PassengerGroup;
  /** 0 to MAX_PRIORITIES entries, no duplicates. Empty = no specific priority. */
  priorities: Priority[];
}

export type AnswerKey = keyof FindMyCarAnswers;

/** In-progress answers while the user is filling the questionnaire. */
export type FindMyCarDraft = Partial<FindMyCarAnswers>;
