import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Used Car Fair Price",
  description: "Check whether a used car's asking price is fair compared to the market.",
  robots: { index: false }, // Phase 5 — only once real comparable market data exists
};

export default function UsedCarPricePage() {
  return (
    <ComingSoon
      title="Used Car Fair Price"
      description="We will only launch valuations once we have enough real market data to back them up."
      planned={[
        "Fair price range based on comparable listings",
        "Adjustments for mileage, version, condition and history",
        "A deal score with a clear confidence level",
      ]}
    />
  );
}
