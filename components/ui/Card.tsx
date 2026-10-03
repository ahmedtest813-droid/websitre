import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-card border border-slate-200 bg-white p-5 shadow-sm sm:p-6", className)}
      {...props}
    />
  );
}
