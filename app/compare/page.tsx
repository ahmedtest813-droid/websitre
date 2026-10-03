import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Compare Cars",
  description: "Compare two cars side by side: price, consumption, space, safety and real monthly cost.",
  robots: { index: false }, // index once the feature ships (Phase 3)
};

export default function ComparePage() {
  return (
    <ComingSoon
      title="Compare Cars"
      description="Put two cars side by side and see the real differences, explained with data."
      planned={[
        "Price, engine, power, transmission and consumption",
        "Seats, boot space, safety and reliability",
        "Estimated monthly and annual ownership cost",
        "A factual summary of where each car is stronger",
      ]}
    />
  );
}
