import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Layout";
import { Icon } from "@/components/ui/Icon";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { ListCard } from "@/components/services/Blocks";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getJobs, getJobBySlug } from "@/lib/api/pages";
import { href } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/t";

export async function generateStaticParams() {
    return (await getJobs()).map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }) {
    const { lang, slug } = await params;
    const j = await getJobBySlug(slug);
    if (!j) return {};
    return {
        title: t(j.title, lang),
        description: t(j.summary, lang),
        alternates: { canonical: href(lang, `/careers/${slug}`) },
    };
}

async function JobPageContent({ params }) {
    const { lang, slug } = await params;
    const [job, jobs, dict, settings] = await Promise.all([
        getJobBySlug(slug),
        getJobs(),
        getDictionary(lang),
        getSettings(),
    ]);
    if (!job) notFound();
    const c = dict.careers;
    return (
        <>
            <header className="border-b border-line bg-paper-2">
                <Container className="py-12 lg:py-16">
                    <Link
                        href={href(lang, "/careers")}
                        className="eyebrow inline-flex items-center gap-2 hover:text-teal-900"
                    >
                        <Icon name="arrow" size={14} className="rotate-180" />
                        {c.back}
                    </Link>
                    <h1 className="mt-6 max-w-3xl text-h1">{t(job.title, lang)}</h1>
                    <p className="mt-4 max-w-2xl text-lg text-ink-2">{t(job.summary, lang)}</p>
                    <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm">
                        <div>
                            <dt className="text-ink-3">{c.type}</dt>
                            <dd className="text-ink">{t(job.type, lang)}</dd>
                        </div>
                        <div>
                            <dt className="text-ink-3">{c.location}</dt>
                            <dd className="text-ink">{t(job.location, lang)}</dd>
                        </div>
                        {job.deadline && (
                            <div>
                                <dt className="text-ink-3">{c.deadline}</dt>
                                <dd className="text-ink">{job.deadline}</dd>
                            </div>
                        )}
                    </dl>
                </Container>
            </header>
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
