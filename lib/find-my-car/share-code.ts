// Compact, URL-safe encoding of questionnaire answers.
// The share code IS the result id: /find-my-car/result/<code>. No storage, no login.
//
// Format (version 1):  1<budget base36>-<monthlyKm base36>-<letters>
//   letters = condition, usage, fuel, transmission, passengers, then 0–3 priority letters
//   e.g. 45,000 DT · 1,500 km · new · city · petrol · automatic · 3–4 · [safety, reliability]
//        → "1yq0-15o-ncpamed"
//
// Never reuse or reorder letters within a version. To change the format, bump the
// version prefix and keep decoding the old one.

import type {
  Condition,
  FindMyCarAnswers,
  FuelPreference,
  PassengerGroup,
  Priority,
  TransmissionPreference,
  Usage,
} from "./types";
import { validateAnswers } from "./validation";

const CODE_VERSION = "1";

const CONDITION_CODES: Record<Condition, string> = { new: "n", used: "u", both: "b" };
const USAGE_CODES: Record<Usage, string> = { city: "c", highway: "h", mixed: "m" };
const FUEL_CODES: Record<FuelPreference, string> = {
  petrol: "p",
  diesel: "d",
  hybrid: "h",
  electric: "e",
  any: "x",
};
const TRANSMISSION_CODES: Record<TransmissionPreference, string> = {
  manual: "m",
  automatic: "a",
  any: "x",
};
const PASSENGER_CODES: Record<PassengerGroup, string> = { "1-2": "s", "3-4": "m", "5+": "l" };
const PRIORITY_CODES: Record<Priority, string> = {
  low_price: "a",
  fuel_economy: "b",
  running_cost: "c",
  reliability: "d",
  safety: "e",
  comfort: "f",
  space: "g",
  performance: "h",
  resale: "i",
};

function invert<T extends string>(map: Record<T, string>): Record<string, T> {
  return Object.fromEntries(Object.entries(map).map(([key, code]) => [code, key])) as Record<string, T>;
}

const DECODE = {
  condition: invert(CONDITION_CODES),
  usage: invert(USAGE_CODES),
  fuel: invert(FUEL_CODES),
  transmission: invert(TRANSMISSION_CODES),
  passengers: invert(PASSENGER_CODES),
  priority: invert(PRIORITY_CODES),
};

const CODE_PATTERN = /^1([0-9a-z]{1,6})-([0-9a-z]{1,5})-([a-z]{5,8})$/;

export function encodeAnswers(answers: FindMyCarAnswers): string {
  const letters =
    CONDITION_CODES[answers.condition] +
    USAGE_CODES[answers.usage] +
    FUEL_CODES[answers.fuel] +
    TRANSMISSION_CODES[answers.transmission] +
    PASSENGER_CODES[answers.passengers] +
    answers.priorities.map((p) => PRIORITY_CODES[p]).join("");

  return `${CODE_VERSION}${answers.budget.toString(36)}-${answers.monthlyKm.toString(36)}-${letters}`;
}

/** Returns null for any malformed or out-of-range code. */
export function decodeAnswers(code: string): FindMyCarAnswers | null {
  const match = CODE_PATTERN.exec(code);
  if (!match) return null;

  const [, budget36, km36, letters] = match;
  const [c, u, f, t, p, ...priorityLetters] = letters.split("");

  const result = validateAnswers({
    budget: parseInt(budget36, 36),
    monthlyKm: parseInt(km36, 36),
    condition: DECODE.condition[c],
    usage: DECODE.usage[u],
    fuel: DECODE.fuel[f],
    transmission: DECODE.transmission[t],
    passengers: DECODE.passengers[p],
    priorities: priorityLetters.map((letter) => DECODE.priority[letter]),
  });

  return result.ok ? result.value : null;
}
