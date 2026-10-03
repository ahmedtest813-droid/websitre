import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Car Cost Calculator",
  description: "Estimate the total cost of owning a car in Tunisia: financing, fuel, insurance, maintenance and depreciation.",
  robots: { index: false }, // index once the feature ships (Phase 4)
};

export default function CarCostPage() {
  return (
    <ComingSoon
      title="Car Cost Calculator"
      description="Estimate what a car really costs you — not just its price tag."
      planned={[
        "Loan repayment estimate from price, down payment, rate and duration",
        "Fuel cost from your monthly kilometres and the car's consumption",
        "Insurance, maintenance, repair reserve, taxes and depreciation",
        "Monthly, annual, 3-year and 5-year totals with a full breakdown",
      ]}
    />
  );
}
