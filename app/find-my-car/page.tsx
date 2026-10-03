import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Questionnaire } from "@/components/find-my-car/Questionnaire";
import { decodeAnswers } from "@/lib/find-my-car/share-code";

export const metadata: Metadata = {
  title: "Find My Car — which car suits your budget and needs?",
  description:
    "Answer 8 quick questions about your budget, driving and priorities. Get cars ranked with a transparent score and real ownership cost.",
  alternates: { canonical: "/find-my-car" },
};

export default async function FindMyCarPage(props: PageProps<"/find-my-car">) {
  const { edit } = await props.searchParams;
  const initialAnswers = typeof edit === "string" ? (decodeAnswers(edit) ?? undefined) : undefined;

  return (
    <Container className="py-8 sm:py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-sm font-semibold uppercase tracking-wider text-primary-600">Find My Car</h1>
          <p className="text-slate-600">
            8 short questions, about 1 minute. Your answers stay in the link — no account needed.
          </p>
        </header>
        <Questionnaire initialAnswers={initialAnswers} />
      </div>
    </Container>
  );
}
