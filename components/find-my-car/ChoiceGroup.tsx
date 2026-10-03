import type { ChoiceOption } from "@/config/find-my-car";
import { OptionTile } from "@/components/ui/OptionTile";
import { cn } from "@/lib/cn";

interface ChoiceGroupProps<T extends string> {
  name: string;
  labelledBy: string;
  options: ChoiceOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  columns?: 1 | 2;
}

export function ChoiceGroup<T extends string>({
  name,
  labelledBy,
  options,
  value,
  onChange,
  columns = 1,
}: ChoiceGroupProps<T>) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className={cn("grid gap-3", columns === 2 && "sm:grid-cols-2")}>
      {options.map((option) => (
        <OptionTile
          key={option.value}
          type="radio"
          name={name}
          value={option.value}
          label={option.label}
          hint={option.hint}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}
