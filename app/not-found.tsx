import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="py-20 text-center">
      <div className="mx-auto max-w-md space-y-4">
        <p className="text-sm font-semibold text-primary-600">404</p>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900">We couldn&apos;t find that page</h1>
        <p className="text-slate-600">The link may be broken or the page may have moved.</p>
        <ButtonLink href="/">Back to home</ButtonLink>
      </div>
    </Container>
  );
}
