const integerFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export function formatNumber(value: number): string {
  return integerFormatter.format(value);
}

/** 45000 → "45,000 DT" */
export function formatTND(value: number): string {
  return `${integerFormatter.format(value)} DT`;
}

/** 1500 → "1,500 km" */
export function formatKm(value: number): string {
  return `${integerFormatter.format(value)} km`;
}
