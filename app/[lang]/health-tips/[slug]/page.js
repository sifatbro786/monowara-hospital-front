import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Container } from "@/components/ui/Layout";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { ArticleCard } from "@/components/content/ArticleCard";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getArticles, getArticleBySlug } from "@/lib/api/content";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { formatPhone } from "@/lib/utils";
import { pageMeta, absUrl, SITE_URL } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, HOSPITAL_ID } from "@/lib/seo/schema";
import { formatDhakaDate, toDhakaDay } from "@/lib/utils/dates";

export async function generateStaticParams() {
    return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
    const { lang, slug } = await params;
    const a = await getArticleBySlug(slug);
    if (!a) return {};
    return pageMeta({
        lang,
        path: `/health-tips/${a.slug}`, // canonical = current slug (old slugs redirect)
        title: t(a.title, lang),
        description: t(a.excerpt, lang),
        image: a.image,
        type: "article",
        publishedTime: a.publishedAt,
        modifiedTime: a.updatedAt,
    });
}

async function ArticlePageContent({ params }) {
    const { lang, slug } = await params;
    const [a, dict, settings, all] = await Promise.all([
        getArticleBySlug(slug),
        getDictionary(lang),
        getSettings(),
        getArticles(),
    ]);
    if (!a) notFound();
    // Admin renamed the slug: the API resolves the old one (previousSlugs) → 308 to the new URL.
    if (a.slug !== slug) permanentRedirect(href(lang, `/health-tips/${a.slug}`));
    const tp = dict.tips;
    const related = all.filter((x) => x.slug !== a.slug && x.category === a.category).slice(0, 3);
    // publishedAt may be "YYYY-MM-DD" (static) or an ISO date (API) — both handled.
    const date = formatDhakaDate(a.publishedAt, lang);
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        headline: t(a.title, lang),
        description: t(a.excerpt, lang),
        inLanguage: lang === "bn" ? "bn-BD" : "en",
        datePublished: toDhakaDay(a.publishedAt) || undefined,
        dateModified: toDhakaDay(a.updatedAt) || undefined,
        url: `${SITE_URL}${href(lang, `/health-tips/${a.slug}`)}`,
        ...(a.image && { image: absUrl(a.image) }),
        publisher: { "@type": "Hospital", "@id": HOSPITAL_ID, name: settings.legalName.en },
    };

    return (
        <>
            <JsonLd
                data={[
                    jsonLd,
                    breadcrumbSchema(lang, dict.nav.home, [
                        { name: dict.nav.healthTips, path: "/health-tips" },
                        { name: a.title, path: `/health-tips/${a.slug}` },
                    ]),
                ]}
            />
            <article>
                <header className="border-b border-line bg-paper-2">
                    <Container className="max-w-4xl py-12 lg:py-16">
                        <Link
                            href={href(lang, "/health-tips")}
                            className="eyebrow inline-flex items-center gap-2 hover:text-teal-900"
                        >
                            <Icon name="arrow" size={14} className="rotate-180" />
                            {tp.categories[a.category]}
                        </Link>
                        <h1 className="mt-6 text-h1">{t(a.title, lang)}</h1>
                        <p className="mt-5 text-lg text-ink-2">{t(a.excerpt, lang)}</p>
                        <p className="mt-6 text-sm text-ink-3">
                            <time dateTime={a.publishedAt}>{date}</time> ·{" "}
                            {tp.read.replace("{n}", digits(a.readMinutes, lang))}
                        </p>
                    </Container>
                </header>
                {a.image && (
                    <Container className="max-w-5xl pt-10">
                        <div className="relative aspect-16/9 overflow-hidden rounded-3xl bg-teal-100">
                            <Image
                                src={a.image}
                                alt=""
                                fill
                                loading="eager"
                                fetchPriority="high"
                                sizes="(min-width: 1024px) 64rem, 92vw"
                                className="object-cover"
                            />
                        </div>
                    </Container>
                )}
                <Container className="max-w-3xl py-12 lg:py-16">
                    <div className="space-y-12">
                        {a.sections.map((s, i) => (
                            <section key={i}>
                                <h2 className="text-h3 sm:text-[1.75rem]">{t(s.heading, lang)}</h2>
                                <div className="mt-4 space-y-4 text-lg leading-relaxed text-ink-2">
                                    {t(s.body, lang)
                                        .split(/\n{2,}/)
                                        .map((p, j) => (
                                            <p key={j}>{p}</p>
                                        ))}
                                </div>
                            </section>
                        ))}
                    </div>
                    <p className="mt-14 rounded-2xl border-l-4 border-teal-500 bg-mint p-5 text-sm text-ink-2">
                        {tp.disclaimer.replace(
                            "{phone}",
                            digits(formatPhone(settings.emergency), lang),
                        )}
                    </p>
                    {a.category === "pregnancy" && (
                        <Button href={href(lang, "/bhrpc")} variant="ink" className="mt-8">
                            {tp.bhrpcCta}
                            <Icon name="arrow" size={17} />
                        </Button>
                    )}
                </Container>
            </article>

            {related.length > 0 && (
                <section
                    aria-labelledby="tips-related"
                    className="border-t border-line bg-paper-2 py-14 lg:py-20"
                >
                    <Container>
                        <div className="flex items-baseline justify-between gap-4">
                            <h2 id="tips-related" className="text-h2">
                                {tp.related}
                            </h2>
                            <Link
                                href={href(lang, "/health-tips")}
                                className="link-underline text-sm text-teal-700"
                            >
                                {tp.all}
                            </Link>
                        </div>
                        <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((x) => (
                                <li key={x._id}>
                                    <ArticleCard article={x} dict={dict} lang={lang} />
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}
        </>
    );
}

export default function ArticlePage({ params }) {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <ArticlePageContent params={params} />
        </Suspense>
    );
}
