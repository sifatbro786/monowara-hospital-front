import { Container } from "@/components/ui/Layout";

/**
 * Suspense fallback for [slug] pages. With partialPrefetching on, the shared App Shell must
 * not read `params`, so detail content streams in behind this (prerendered pages still ship
 * fully rendered HTML — the fallback only shows during client navigation before the payload).
 */
export function PageSkeleton() {
    return (
        <div aria-hidden className="animate-pulse">
            <div className="border-b border-line bg-paper-2">
                <Container className="py-14 lg:py-20">
                    <div className="h-3 w-28 rounded-full bg-ink/10" />
                    <div className="mt-6 h-12 w-3/4 max-w-xl rounded-2xl bg-ink/10" />
                    <div className="mt-5 h-4 w-full max-w-2xl rounded-full bg-ink/[0.07]" />
                    <div className="mt-3 h-4 w-2/3 max-w-xl rounded-full bg-ink/[0.07]" />
                </Container>
            </div>
            <Container className="py-14">
                <div className="h-40 rounded-3xl bg-ink/[0.05]" />
            </Container>
        </div>
    );
}
