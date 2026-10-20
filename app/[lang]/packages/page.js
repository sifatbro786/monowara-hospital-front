import { Suspense } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMedia } from "@/lib/api/media";
import { Emphasis } from "@/components/ui/Emphasis";
import { PackageCard } from "@/components/packages/PackageCard";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getPackages } from "@/lib/api/packages";
import { href } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const CATEGORIES = ["maternity", "surgical", "checkup"];

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const p = (await getDictionary(lang)).packages;
    return {
        title: p.eyebrow,
        description: p.metaDescription,
        alternates: { canonical: href(lang, "/packages") },
    };
}

/** Packages — header prerendered; the ?category= filter (URL data) renders inside <Suspense>. */
export default async function PackagesPage({ params, searchParams }) {
    const { lang } = await params;
    const media = await getMedia();
    const dict = await getDictionary(lang);
    const p = dict.packages;
    return (
        <>
            <PageHeader
                eyebrow={p.eyebrow}
                title=<Emphasis text={p.title} />
                lead={p.lead}
                media={media["header.packages"]}
                lang={lang}
            />
            <Suspense fallback={<Container className="h-96 py-14" />}>
                <PackageList searchParams={searchParams} dict={dict} lang={lang} />
            </Suspense>
        </>
    );
}

async function PackageList({ searchParams, dict, lang }) {
    const sp = await searchParams;
    const raw = Array.isArray(sp.category) ? sp.category[0] : sp.category;
    const active = CATEGORIES.includes(raw) ? raw : null;
    const all = await getPackages();
    const p = dict.packages;
    const groups = (active ? [active] : CATEGORIES)
        .map((c) => ({ c, items: all.filter((x) => x.category === c) }))
        .filter((g) => g.items.length);

    const chip = (key, label) => {
        const on = (key || null) === active;
        return (
            <li key={key || "all"}>
                <Link
                    href={href(lang, key ? `/packages?category=${key}` : "/packages")}
                    aria-current={on ? "page" : undefined}
                    className={cn(
                        "inline-flex h-10 items-center rounded-pill border px-4 text-sm",
                        on
                            ? "border-ink bg-ink text-paper"
                            : "border-line bg-card text-ink-2 hover:border-teal-600/50",
                    )}
                >
                    {label}
                </Link>
            </li>
        );
    };

    return (
        <>
            <nav aria-label={p.eyebrow} className="border-b border-line bg-paper">
                <Container>
                    <ul className="flex gap-2 overflow-x-auto py-3">
                        {chip(null, p.all)}
                        {CATEGORIES.map((c) => chip(c, p.categories[c]))}
                    </ul>
                </Container>
            </nav>
            {groups.map(({ c, items }, i) => (
                <section
                    key={c}
                    id={c}
                    aria-labelledby={`pkg-${c}`}
                    className={cn("py-14 lg:py-18", i % 2 ? "bg-mint" : "bg-paper")}
                >
                    <Container>
                        <div className="grid gap-3 lg:grid-cols-12 lg:items-end">
                            <h2 id={`pkg-${c}`} className="text-h2 lg:col-span-6">
                                {p.categories[c]}
                            </h2>
                            <p className="text-ink-2 lg:col-span-6 lg:text-right">
                                {p.categoryLead[c]}
                            </p>
                        </div>
                        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {items.map((pkg) => (
                                <li key={pkg._id}>
                                    <PackageCard pkg={pkg} dict={dict} lang={lang} />
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            ))}
            <Container className="py-10">
                <p className="max-w-2xl text-sm text-ink-3">{p.priceNote}</p>
            </Container>
        </>
    );
}
