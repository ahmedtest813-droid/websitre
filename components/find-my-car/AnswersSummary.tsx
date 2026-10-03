import {
  CONDITION_OPTIONS,
  FUEL_OPTIONS,
  PASSENGER_OPTIONS,
  PRIORITY_OPTIONS,
  TRANSMISSION_OPTIONS,
  USAGE_OPTIONS,
  labelFor,
} from "@/config/find-my-car";
import type { FindMyCarAnswers } from "@/lib/find-my-car/types";
import { formatKm, formatTND } from "@/lib/format";

export function AnswersSummary({ answers }: { answers: FindMyCarAnswers }) {
  const rows: [string, string][] = [
    ["Budget", `Up to ${formatTND(answers.budget)}`],
    ["Condition", labelFor(CONDITION_OPTIONS, answers.condition)],
    ["Main usage", labelFor(USAGE_OPTIONS, answers.usage)],
    ["Monthly distance", `${formatKm(answers.monthlyKm)} / month`],
    ["Fuel", labelFor(FUEL_OPTIONS, answers.fuel)],
    ["Transmission", labelFor(TRANSMISSION_OPTIONS, answers.transmission)],
    ["Passengers", labelFor(PASSENGER_OPTIONS, answers.passengers)],
    [
      "Priorities",
      answers.priorities.length
        ? answers.priorities.map((p) => labelFor(PRIORITY_OPTIONS, p)).join(", ")
        : "No specific priority",
    ],
  ];

  return (
    <dl className="divide-y divide-slate-100">
      {rows.map(([term, detail]) => (
        <div key={term} className="flex justify-between gap-4 py-2.5 text-sm">
          <dt className="text-slate-500">{term}</dt>
          <dd className="text-right font-medium text-slate-900">{detail}</dd>
        </div>
      ))}
    </dl>
  );
}
