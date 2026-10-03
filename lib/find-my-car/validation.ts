import { BUDGET_LIMITS, MAX_PRIORITIES, MONTHLY_KM_LIMITS } from "@/config/find-my-car";
import { formatKm, formatTND } from "@/lib/format";
import {
  CONDITIONS,
  FUEL_PREFERENCES,
  PASSENGER_GROUPS,
  PRIORITIES,
  TRANSMISSION_PREFERENCES,
  USAGES,
  type AnswerKey,
  type FindMyCarAnswers,
} from "./types";

export type AnswerErrors = Partial<Record<AnswerKey, string>>;

export type ValidationResult =
  | { ok: true; value: FindMyCarAnswers }
  | { ok: false; errors: AnswerErrors };

function isOneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (list as readonly string[]).includes(value);
}

function isWholeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

const validators: Record<AnswerKey, (value: unknown) => string | null> = {
  budget(value) {
    if (!isWholeNumber(value)) return "Enter your budget in dinars.";
    if (value < BUDGET_LIMITS.min) return `The minimum budget is ${formatTND(BUDGET_LIMITS.min)}.`;
    if (value > BUDGET_LIMITS.max) return `The maximum budget is ${formatTND(BUDGET_LIMITS.max)}.`;
    return null;
  },
  condition: (value) => (isOneOf(CONDITIONS, value) ? null : "Choose new, used or both."),
  usage: (value) => (isOneOf(USAGES, value) ? null : "Choose how you will mainly drive."),
  monthlyKm(value) {
    if (!isWholeNumber(value)) return "Choose a distance or enter your own.";
    if (value < MONTHLY_KM_LIMITS.min || value > MONTHLY_KM_LIMITS.max) {
      return `Enter a distance between ${formatKm(MONTHLY_KM_LIMITS.min)} and ${formatKm(MONTHLY_KM_LIMITS.max)}.`;
    }
    return null;
  },
  fuel: (value) => (isOneOf(FUEL_PREFERENCES, value) ? null : "Choose a fuel type or “No preference”."),
  transmission: (value) =>
    isOneOf(TRANSMISSION_PREFERENCES, value) ? null : "Choose a transmission or “No preference”.",
  passengers: (value) => (isOneOf(PASSENGER_GROUPS, value) ? null : "Choose how many people ride."),
  priorities(value) {
    const valid =
      Array.isArray(value) &&
      value.length <= MAX_PRIORITIES &&
      value.every((p) => isOneOf(PRIORITIES, p)) &&
      new Set(value).size === value.length;
    return valid ? null : `Choose up to ${MAX_PRIORITIES} priorities.`;
  },
};

export function validateField(field: AnswerKey, value: unknown): string | null {
  return validators[field](value);
}

export function validateAnswers(input: Partial<Record<AnswerKey, unknown>>): ValidationResult {
  const errors: AnswerErrors = {};
  for (const field of Object.keys(validators) as AnswerKey[]) {
    const error = validators[field](input[field]);
    if (error) errors[field] = error;
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: input as FindMyCarAnswers };
}
