import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMedia } from "@/lib/api/media";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { PackageCard } from "@/components/packages/PackageCard";
import { Prose, ListCard, NumberedList, VisitSteps } from "@/components/services/Blocks";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getBhrpc } from "@/lib/api/programs";
import { getPackages } from "@/lib/api/packages";
import { getArticles } from "@/lib/api/content";
import { ArticleCard } from "@/components/content/ArticleCard";
import { href } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/t";
import { pageMeta } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, clinicSchema } from "@/lib/seo/schema";

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const [dict, b] = await Promise.all([getDictionary(lang), getBhrpc()]);
    return pageMeta({
        lang,
        path: "/bhrpc",
        title: `${b.short} — ${t(b.name, lang)}`,
        description: dict.bhrpc.metaDescription,
    });
}

/** BHRPC — high-risk pregnancy programme (old /pregnancy-care). */
export default async function BhrpcPage({ params }) {
    const { lang } = await params;
    const [dict, settings, b, packages, allArticles, media] = await Promise.all([
        getDictionary(lang),
        getSettings(),
        getBhrpc(),
        getPackages({ category: "maternity" }),
        getArticles(),
        getMedia(),
    ]);
    // Reading list = the articles picked in Admin → BHRPC, in that order (hidden/scheduled ones drop out).
    const bySlug = new Map(allArticles.map((a) => [a.slug, a]));
    const articles = (b.topics || []).map((slug) => bySlug.get(slug)).filter(Boolean);
    const x = dict.bhrpc;
    const wa = settings.primaryWhatsapp?.number;

    return (
        <>
            <JsonLd
                data={[
                    {
                        ...clinicSchema({
                            lang,
                            path: "/bhrpc",
                            name: t(b.name, lang),
                            description: t(b.tagline, lang),
                            telephone: settings.hotline,
                        }),
                        medicalSpecialty: "Obstetric",
                    },
                    breadcrumbSchema(lang, dict.nav.home, [
                        { name: dict.nav.bhrpc, path: "/bhrpc" },
                    ]),
                ]}
            />
            <PageHeader
                eyebrow={x.eyebrow}
                title={t(b.name, lang)}
                lead={t(b.tagline, lang)}
                media={media["header.bhrpc"]}
                lang={lang}
            >
                <div className="mt-8 flex flex-wrap gap-3">
                    <Button appointment context={b.short} variant="bright" size="lg">
                        <Icon name="calendar" size={18} />
                        {dict.cta.book}
                    </Button>
                    <Button
                        href={href(lang, "/packages?category=maternity")}
                        variant="light"
                        size="lg"
                    >
                        {x.packages}
                    </Button>
                </div>
            </PageHeader>

            <section className="bg-paper py-14 lg:py-20">
                <Container className="grid gap-10 lg:grid-cols-12 lg:gap-14">
                    <Prose text={t(b.about, lang)} className="lg:col-span-7" />
                    <ListCard
                        title={x.whoFor}
                        items={b.whoFor}
                        lang={lang}
                        className="self-start lg:col-span-5"
                    />
                </Container>
            </section>

            <NumberedList id="bhrpc-services" title={x.services} items={b.services} lang={lang} />

            {b.doctors.length > 0 && (
                <section aria-labelledby="bhrpc-team" className="bg-paper py-14 lg:py-20">
                    <Container>
                        <h2 id="bhrpc-team" className="text-h2">
                            {x.team}
                        </h2>
                        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {b.doctors.map((d) => (
                                <li key={d._id}>
                                    <DoctorCard doctor={d} dict={dict} lang={lang} waNumber={wa} />
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}

            {articles.length > 0 && (
                <section aria-labelledby="bhrpc-topics" className="bg-paper-2 py-14 lg:py-20">
                    <Container>
                        <div className="grid gap-3 lg:grid-cols-12 lg:items-end">
                            <h2 id="bhrpc-topics" className="text-h2 lg:col-span-6">
                                {x.topics}
                            </h2>
                            <p className="text-ink-2 lg:col-span-6 lg:text-right">{x.topicsLead}</p>
                        </div>
                        <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                            {articles.map((a) => (
                                <li key={a._id}>
                                    <ArticleCard article={a} dict={dict} lang={lang} />
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}

            <VisitSteps settings={settings} dict={dict} lang={lang} context={b.short} />

            {packages.length > 0 && (
                <section aria-labelledby="bhrpc-packages" className="bg-mint py-14 lg:py-20">
                    <Container>
                        <h2 id="bhrpc-packages" className="text-h2">
                            {x.packages}
                        </h2>
                        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {packages.map((p) => (
                                <li key={p._id}>
                                    <PackageCard pkg={p} dict={dict} lang={lang} />
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}
        </>
    );
}
