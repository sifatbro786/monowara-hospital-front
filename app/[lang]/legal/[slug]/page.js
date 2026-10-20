import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Layout";
import { Icon } from "@/components/ui/Icon";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getLegalPage, getLegalSlugs } from "@/lib/api/pages";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { telHref, formatPhone } from "@/lib/utils";

export async function generateStaticParams() {
    return (await getLegalSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
    const { lang, slug } = await params;
    const page = await getLegalPage(slug);
    if (!page) return {};
    return {
        title: t(page.title, lang),
        description: t(page.summary, lang),
        alternates: { canonical: href(lang, `/legal/${slug}`) },
    };
}

const DATE_FMT = { en: "en-GB", bn: "bn-BD" };

async function LegalPageContent({ params }) {
    const { lang, slug } = await params;
    const [page, dict, settings, slugs] = await Promise.all([
        getLegalPage(slug),
        getDictionary(lang),
        getSettings(),
        getLegalSlugs(),
    ]);
    if (!page) notFound();

    const l = dict.legal;
    const updated = new Intl.DateTimeFormat(DATE_FMT[lang], {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
    }).format(new Date(page.updatedAt));
    const siblings = await Promise.all(slugs.filter((s) => s !== slug).map((s) => getLegalPage(s)));

    return (
        <>
            <header className="border-b border-line bg-paper-2">
                <Container className="py-14 lg:py-20">
                    <p className="eyebrow">{dict.meta.legalName}</p>
                    <h1 className="mt-4 max-w-3xl text-h1">{t(page.title, lang)}</h1>
                    <p className="mt-4 max-w-2xl text-lg text-ink-2">{t(page.summary, lang)}</p>
                    <p className="mt-6 text-sm text-ink-3">
                        {l.updated}: <time dateTime={page.updatedAt}>{updated}</time>
                    </p>
                </Container>
            </header>

            <Container className="grid gap-12 py-14 lg:grid-cols-12 lg:py-20">
                <aside className="lg:col-span-4">
                    <nav aria-label={l.contents} className="lg:sticky lg:top-28">
                        <p className="text-sm font-semibold text-ink">{l.contents}</p>
                        <ol className="mt-3 border-l border-line">
                            {page.sections.map((s, i) => (
                                <li key={s.id}>
                                    <a
                                        href={`#${s.id}`}
                                        className="-ml-px flex gap-3 border-l border-transparent py-1.5 pl-4 text-sm text-ink-2 hover:border-teal-600 hover:text-ink"
                                    >
                                        <span className="font-display italic text-ink-3 tabular-nums">
                                            {digits(String(i + 1).padStart(2, "0"), lang)}
                                        </span>
                                        {t(s.heading, lang)}
                                    </a>
                                </li>
                            ))}
                        </ol>
                        {siblings.filter(Boolean).length > 0 && (
                            <ul className="mt-8 space-y-2 text-sm">
                                {siblings.filter(Boolean).map((p) => (
                                    <li key={p.slug}>
                                        <Link
                                            href={href(lang, `/legal/${p.slug}`)}
                                            className="inline-flex items-center gap-2 text-teal-700 link-underline"
                                        >
                                            {t(p.title, lang)}
                                            <Icon name="arrow" size={14} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </nav>
                </aside>

                <article className="lg:col-span-8">
                    {page.isDraft && (
                        <p className="mb-10 rounded-xl border border-dashed border-line bg-card px-4 py-3 text-sm text-ink-2">
                            {l.draft}
                        </p>
                    )}
                    {page.sections.map((s, i) => (
                        <section
                            key={s.id}
                            id={s.id}
                            className="scroll-mt-28 border-t border-line py-8 first:border-t-0 first:pt-0"
                        >
                            <h2 className="flex items-baseline gap-4 text-h3">
                                <span className="font-display text-base italic text-teal-700 tabular-nums">
                                    {digits(String(i + 1).padStart(2, "0"), lang)}
                                </span>
                                {t(s.heading, lang)}
                            </h2>
                            <div className="mt-3 max-w-[65ch] space-y-3 text-ink-2 sm:pl-10">
                                {(s.body[lang] || s.body.en).map((para, j) => (
                                    <p key={j}>{para}</p>
                                ))}
                            </div>
                        </section>
                    ))}

                    <div className="mt-6 rounded-card bg-card p-6 ring-1 ring-line sm:p-8">
                        <p className="font-semibold text-ink">{l.questions}</p>
                        <p className="mt-1 text-sm text-ink-2">{t(settings.address, lang)}</p>
                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                            <a
                                href={telHref(settings.hotline)}
                                className="inline-flex items-center gap-2 text-teal-700 tabular-nums"
                            >
                                <Icon name="phone" size={16} />
                                {digits(formatPhone(settings.hotline), lang)}
                            </a>
                            {settings.email && (
                                <a
                                    href={`mailto:${settings.email}`}
                                    className="inline-flex items-center gap-2 text-teal-700"
                                >
                                    <Icon name="mail" size={16} />
                                    {settings.email}
                                </a>
                            )}
                        </div>
                    </div>
                </article>
            </Container>
        </>
    );
}

// params are URL data → read inside <Suspense> so the shared App Shell stays URL-independent
// (partialPrefetching). generateStaticParams still prerenders every page in full.
export default function LegalPage({ params }) {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <LegalPageContent params={params} />
        </Suspense>
    );
}
