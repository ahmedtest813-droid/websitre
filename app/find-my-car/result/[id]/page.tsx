import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AnswersSummary } from "@/components/find-my-car/AnswersSummary";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CopyLinkButton } from "@/components/ui/CopyLinkButton";
import { decodeAnswers } from "@/lib/find-my-car/share-code";

export const metadata: Metadata = {
  title: "Your car matches",
  description: "Cars ranked for your budget, usage and priorities.",
  // Personal results are shareable but should not be indexed.
  robots: { index: false, follow: true },
};

export default async function FindMyCarResultPage(props: PageProps<"/find-my-car/result/[id]">) {
  const { id } = await props.params;
  const answers = decodeAnswers(id);
  if (!answers) notFound();

  return (
    <Container className="py-8 sm:py-12">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="space-y-6" aria-labelledby="results-heading">
          <div className="space-y-2">
            <h1 id="results-heading" className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              Your car matches
            </h1>
            <p className="text-slate-600">Ranked by how well each car fits your answers.</p>
          </div>

          {/* Phase 2: replace this card with the ranked top 5 from lib/scoring/recommend.ts */}
          <Card className="space-y-3 border-dashed">
            <Badge tone="info">Phase 2</Badge>
            <p className="font-semibold text-slate-900">Recommendations are not available yet.</p>
            <p className="text-slate-600">
              The scoring engine and car database are being built. Your answers below are saved in this link and will
              produce your ranked matches as soon as the engine is live.
            </p>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card className="space-y-3">
            <h2 className="font-semibold text-slate-900">Your answers</h2>
            <AnswersSummary answers={answers} />
          </Card>
          <div className="flex flex-col gap-2">
            <ButtonLink href={`/find-my-car?edit=${id}`} variant="secondary">
              Edit answers
            </ButtonLink>
            <CopyLinkButton />
          </div>
        </aside>
      </div>
    </Container>
  );
}
