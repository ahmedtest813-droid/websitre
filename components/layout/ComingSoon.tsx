import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CheckIcon } from "@/components/ui/Icons";
import { Container } from "./Container";

interface ComingSoonProps {
  title: string;
  description: string;
  planned: string[];
}

export function ComingSoon({ title, description, planned }: ComingSoonProps) {
  return (
    <Container className="py-12 sm:py-16">
      <Card className="mx-auto max-w-2xl space-y-6">
        <Badge tone="info">In development</Badge>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">{title}</h1>
          <p className="text-slate-600">{description}</p>
        </div>
        <ul className="space-y-2">
          {planned.map((item) => (
            <li key={item} className="flex gap-2 text-slate-700">
              <CheckIcon className="mt-0.5 size-5 shrink-0 text-accent-600" />
              {item}
            </li>
          ))}
        </ul>
        <ButtonLink href="/find-my-car">Try Find My Car</ButtonLink>
      </Card>
    </Container>
  );
}
