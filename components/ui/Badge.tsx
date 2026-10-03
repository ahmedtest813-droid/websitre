import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "info" | "positive" | "warning";

const tones: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  info: "bg-primary-50 text-primary-700 ring-primary-200",
  positive: "bg-accent-50 text-accent-700 ring-accent-300",
  warning: "bg-amber-50 text-amber-800 ring-amber-200",
};

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
