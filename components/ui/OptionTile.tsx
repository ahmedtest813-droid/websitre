import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface OptionTileProps extends Omit<ComponentProps<"input">, "type" | "className"> {
  type: "radio" | "checkbox";
  label: ReactNode;
  hint?: ReactNode;
}

/** Large, tap-friendly radio or checkbox built on a native input (keyboard + screen reader support for free). */
export function OptionTile({ type, label, hint, disabled, ...inputProps }: OptionTileProps) {
  return (
    <label
      className={cn(
        "group flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors",
        "hover:border-primary-300",
        "has-checked:border-primary-600 has-checked:bg-primary-50 has-checked:ring-1 has-checked:ring-primary-600",
        "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary-500",
        disabled && "cursor-not-allowed opacity-50 hover:border-slate-200",
      )}
    >
      <input type={type} disabled={disabled} className="peer sr-only" {...inputProps} />
      <span
        aria-hidden
        className={cn(
          "grid size-5 shrink-0 place-items-center border-2 border-slate-300 bg-white transition-colors",
          "peer-checked:border-primary-600 peer-checked:bg-primary-600",
          type === "radio" ? "rounded-full" : "rounded-md",
        )}
      >
        {type === "radio" ? (
          <span className="size-2 rounded-full bg-white" />
        ) : (
          <svg viewBox="0 0 16 16" className="size-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="flex flex-col">
        <span className="font-medium text-slate-900">{label}</span>
        {hint && <span className="text-sm text-slate-500">{hint}</span>}
      </span>
    </label>
  );
}
