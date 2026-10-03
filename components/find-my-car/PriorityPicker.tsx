import { MAX_PRIORITIES, PRIORITY_OPTIONS } from "@/config/find-my-car";
import { OptionTile } from "@/components/ui/OptionTile";
import type { Priority } from "@/lib/find-my-car/types";

interface PriorityPickerProps {
  name: string;
  labelledBy: string;
  value: Priority[];
  onChange: (value: Priority[]) => void;
}

export function PriorityPicker({ name, labelledBy, value, onChange }: PriorityPickerProps) {
  const full = value.length >= MAX_PRIORITIES;

  function toggle(priority: Priority) {
    if (value.includes(priority)) onChange(value.filter((p) => p !== priority));
    else if (!full) onChange([...value, priority]);
  }

  return (
    <div className="space-y-3">
      <p aria-live="polite" className="text-sm font-medium text-slate-600 tabular-nums">
        {value.length} of {MAX_PRIORITIES} selected
      </p>
      <div role="group" aria-labelledby={labelledBy} className="grid gap-3 sm:grid-cols-2">
        {PRIORITY_OPTIONS.map((option) => {
          const checked = value.includes(option.value);
          return (
            <OptionTile
              key={option.value}
              type="checkbox"
              name={name}
              value={option.value}
              label={option.label}
              checked={checked}
              disabled={full && !checked}
              onChange={() => toggle(option.value)}
            />
          );
        })}
      </div>
    </div>
  );
}
