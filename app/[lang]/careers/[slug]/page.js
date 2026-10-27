import { Suspense } from "react";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMedia } from "@/lib/api/media";
import { Icon } from "@/components/ui/Icon";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { ListCard } from "@/components/services/Blocks";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getJobs, getJobBySlug } from "@/lib/api/pages";
import { href } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/t";
import { formatDhakaDate } from "@/lib/utils/dates";
import { pageMeta } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export async function generateStaticParams() {
    return (await getJobs()).map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }) {
    const { lang, slug } = await params;
    const j = await getJobBySlug(slug);
    if (!j) return {};
    return pageMeta({
        lang,
        path: `/careers/${j.slug}`, // canonical = current slug (old slugs redirect)
        title: t(j.title, lang),
        description: t(j.summary, lang),
    });
}

async function JobPageContent({ params }) {
    const { lang, slug } = await params;
    const [job, jobs, dict, settings, media] = await Promise.all([
        getJobBySlug(slug),
        getJobs(),
        getDictionary(lang),
        getSettings(),
        getMedia(),
    ]);
    if (!job) notFound();
    // Admin renamed the slug: the API resolves the old one (previousSlugs) → 308 to the new URL.
    if (job.slug !== slug) permanentRedirect(href(lang, `/careers/${job.slug}`));
    const c = dict.careers;
    return (
        <>
            <JsonLd
                data={breadcrumbSchema(lang, dict.nav.home, [
                    { name: dict.nav.careers, path: "/careers" },
                    { name: job.title, path: `/careers/${job.slug}` },
                ])}
            />
            <PageHeader
                eyebrow={
                    <Link
                        href={href(lang, "/careers")}
                        className="inline-flex items-center gap-2 hover:text-paper"
                    >
                        <Icon name="arrow" size={14} className="rotate-180" />
                        {c.back}
                    </Link>
                }
                title={t(job.title, lang)}
                lead={t(job.summary, lang)}
                media={media["header.careers"]}
                lang={lang}
            >
                <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm">
                    <div>
                        <dt className="text-paper/60">{c.type}</dt>
                        <dd className="text-paper">{t(job.type, lang)}</dd>
                    </div>
                    <div>
                        <dt className="text-paper/60">{c.location}</dt>
                        <dd className="text-paper">{t(job.location, lang)}</dd>
                    </div>
                    {job.deadline && (
                        <div>
                            <dt className="text-paper/60">{c.deadline}</dt>
                            <dd className="text-paper">{formatDhakaDate(job.deadline, lang)}</dd>
                        </div>
                    )}
                </dl>
            </PageHeader>
            <Container className="grid gap-10 py-14 lg:grid-cols-12 lg:py-20">
                <div className="grid content-start gap-5 lg:col-span-5">
                    <ListCard title={c.responsibilities} items={job.responsibilities} lang={lang} />
                    <ListCard title={c.requirements} items={job.requirements} lang={lang} />
                </div>
                <section aria-labelledby="apply-title" className="lg:col-span-7">
                    <h2 id="apply-title" className="text-h2">
                        {c.apply}
                    </h2>
                    <p className="mt-2 text-ink-2">{c.applyLead}</p>
                    <div className="mt-6">
                        <ApplyForm
                            jobs={jobs.map((j) => ({ slug: j.slug, title: t(j.title, lang) }))}
                            jobSlug={job.slug}
                            email={settings.email}
                            labels={c.form}
                        />
                    </div>
                </section>
            </Container>
        </>
    );
}

export default function JobPage({ params }) {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <JobPageContent params={params} />
        </Suspense>
    );
}
