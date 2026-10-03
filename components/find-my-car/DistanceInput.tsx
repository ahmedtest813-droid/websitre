"use client";

import { useState } from "react";
import { DISTANCE_PRESETS } from "@/config/find-my-car";
import { OptionTile } from "@/components/ui/OptionTile";
import { formatNumber } from "@/lib/format";

interface DistanceInputProps {
  name: string;
  labelledBy: string;
  describedBy?: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export function DistanceInput({ name, labelledBy, describedBy, value, onChange }: DistanceInputProps) {
  const matchesPreset = DISTANCE_PRESETS.some((p) => p.value === value);
  const [custom, setCustom] = useState(value !== undefined && !matchesPreset);
  const customInputId = `${name}-custom`;

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="grid gap-3 sm:grid-cols-2">
      {DISTANCE_PRESETS.map((preset) => (
        <OptionTile
          key={preset.id}
          type="radio"
          name={name}
          value={preset.id}
          label={preset.label}
          checked={!custom && value === preset.value}
          onChange={() => {
            setCustom(false);
            onChange(preset.value);
          }}
        />
      ))}
      <OptionTile
        type="radio"
        name={name}
        value="custom"
        label="Enter my own distance"
        checked={custom}
        onChange={() => {
          setCustom(true);
          onChange(undefined);
        }}
      />

      {custom && (
        <div className="sm:col-span-2">
          <label htmlFor={customInputId} className="mb-1.5 block text-sm font-medium text-slate-700">
            Kilometres per month
          </label>
          <div className="relative">
            <input
              id={customInputId}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              placeholder="1,200"
              aria-describedby={describedBy}
              value={value === undefined ? "" : formatNumber(value)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 5);
                onChange(digits ? Number(digits) : undefined);
              }}
              className="h-14 w-full rounded-xl border border-slate-300 bg-white pl-4 pr-24 text-xl font-semibold tabular-nums focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-500">
              km / month
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
