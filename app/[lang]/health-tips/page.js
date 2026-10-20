import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMedia } from "@/lib/api/media";
import { Emphasis } from "@/components/ui/Emphasis";
import { ArticleCard } from "@/components/content/ArticleCard";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getArticles } from "@/lib/api/content";
import { href } from "@/lib/i18n/config";

const CATS = ["pregnancy", "general"];

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const tp = (await getDictionary(lang)).tips;
    return {
        title: tp.eyebrow,
        description: tp.metaDescription,
        alternates: { canonical: href(lang, "/health-tips") },
    };
}

/** Health Tips & News — lead story, then one section per category (anchor chips, no query). */
export default async function HealthTipsPage({ params }) {
    const { lang } = await params;
    const media = await getMedia();
    const [dict, articles] = await Promise.all([getDictionary(lang), getArticles()]);
    const tp = dict.tips;
    const [lead, ...rest] = articles;

    return (
        <>
            <PageHeader
                eyebrow={tp.eyebrow}
                title=<Emphasis text={tp.title} />
                lead={tp.lead}
                media={media["header.healthTips"]}
                lang={lang}
            >
                <ul className="mt-8 flex flex-wrap gap-2">
                    {CATS.map((c) => (
                        <li key={c}>
                            <a
                                href={`#${c}`}
                                className="inline-flex h-10 items-center rounded-pill border border-line bg-card px-4 text-sm text-ink-2 hover:border-teal-600/50"
                            >
                                {tp.categories[c]}
                            </a>
                        </li>
                    ))}
                </ul>
            </PageHeader>

            {lead && (
                <section className="bg-paper py-14 lg:py-20">
                    <Container>
                        <ArticleCard article={lead} dict={dict} lang={lang} large eager />
                    </Container>
                </section>
            )}

            {CATS.map((c, i) => {
                const items = rest.filter((a) => a.category === c);
                if (!items.length) return null;
                return (
                    <section
                        key={c}
                        id={c}
                        aria-labelledby={`tips-${c}`}
                        className={
                            i % 2
                                ? "scroll-mt-24 bg-paper py-14 lg:py-20"
                                : "scroll-mt-24 bg-paper-2 py-14 lg:py-20"
                        }
                    >
                        <Container>
                            <h2 id={`tips-${c}`} className="text-h2">
                                {tp.categories[c]}
                            </h2>
                            <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                                {items.map((a) => (
                                    <li key={a._id}>
                                        <ArticleCard article={a} dict={dict} lang={lang} />
                                    </li>
                                ))}
                            </ul>
                        </Container>
                    </section>
                );
            })}
        </>
    );
}
