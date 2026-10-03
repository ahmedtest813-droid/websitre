import { BUDGET_SUGGESTIONS } from "@/config/find-my-car";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

interface BudgetInputProps {
  labelledBy: string;
  describedBy?: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  invalid?: boolean;
}

export function BudgetInput({ labelledBy, describedBy, value, onChange, invalid }: BudgetInputProps) {
  return (
    <div className="space-y-5">
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="45,000"
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          value={value === undefined ? "" : formatNumber(value)}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 7);
            onChange(digits ? Number(digits) : undefined);
          }}
          className={cn(
            "h-16 w-full rounded-xl border bg-white pl-4 pr-14 text-2xl font-semibold text-slate-900 tabular-nums",
            "placeholder:text-slate-300 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-200",
            invalid ? "border-red-400" : "border-slate-300",
          )}
        />
        <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-lg font-semibold text-slate-500">
          DT
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-slate-500">Or pick a common budget</p>
        <div className="flex flex-wrap gap-2">
          {BUDGET_SUGGESTIONS.map((amount) => (
            <button
              key={amount}
              type="button"
              aria-pressed={value === amount}
              onClick={() => onChange(amount)}
              className={cn(
                "rounded-full border px-3.5 py-2 text-sm font-medium tabular-nums transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
                value === amount
                  ? "border-primary-600 bg-primary-50 text-primary-700"
                  : "border-slate-300 bg-white text-slate-700 hover:border-primary-300",
              )}
            >
              {formatNumber(amount)} DT
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
