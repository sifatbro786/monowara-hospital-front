import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Layout";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { Prose, ListCard, NumberedList, VisitSteps } from "@/components/services/Blocks";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getDepartments, getDepartmentBySlug } from "@/lib/api/departments";
import { getDoctors } from "@/lib/api/doctors";
import { getPackages } from "@/lib/api/packages";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { cn } from "@/lib/utils";
import { pageMeta } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

export async function generateStaticParams() {
    return (await getDepartments()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
    const { lang, slug } = await params;
    const dept = await getDepartmentBySlug(slug);
    if (!dept) return {};
    return pageMeta({
        lang,
        path: `/departments/${slug}`,
        title: t(dept.seo?.title, lang) || t(dept.name, lang),
        description: t(dept.seo?.description, lang) || t(dept.summary, lang),
        image: dept.image,
    });
}

async function DepartmentPageContent({ params }) {
    const { lang, slug } = await params;
    const [dept, dict, settings, departments] = await Promise.all([
        getDepartmentBySlug(slug),
        getDictionary(lang),
        getSettings(),
        getDepartments(),
    ]);
    if (!dept) notFound();

    const [{ items: doctors, total }, packages] = await Promise.all([
        getDoctors({ department: dept.slug, limit: 100 }),
        getPackages({ department: dept._id }),
    ]);
    const d = dict.departments;
    const wa = settings.primaryWhatsapp?.number;
    const description = t(dept.description, lang);

    return (
        <>
            <JsonLd
                data={breadcrumbSchema(lang, dict.nav.home, [
                    { name: dict.nav.departments, path: "/departments" },
                    { name: dept.name, path: `/departments/${dept.slug}` },
                ])}
            />
            <header className="border-b border-line bg-paper-2">
                <Container className="grid gap-10 py-10 lg:grid-cols-12 lg:items-end lg:py-16">
                    <div className="lg:col-span-7">
                        <Link
                            href={href(lang, "/departments")}
                            className="inline-flex items-center gap-2 text-sm text-teal-700 hover:text-teal-900"
                        >
                            <Icon name="arrow" size={16} className="rotate-180" />
                            {d.all}
                        </Link>
                        <h1 className="mt-8 text-h1">{t(dept.name, lang)}</h1>
                        <p className="mt-4 max-w-2xl text-lg text-ink-2">{t(dept.summary, lang)}</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button
                                appointment
                                context={t(dept.name, lang)}
                                variant="ink"
                                size="lg"
                            >
                                <Icon name="calendar" size={18} />
                                {dict.cta.book}
                            </Button>
                        </div>
                    </div>
                    {dept.image && (
                        <div className="relative aspect-5/4 overflow-hidden rounded-3xl bg-teal-100 lg:col-span-5">
                            <Image
                                src={dept.image}
                                alt=""
                                fill
                                loading="eager"
                                fetchPriority="high"
                                sizes="(min-width: 1024px) 34rem, 92vw"
                                className="object-cover"
                            />
                        </div>
                    )}
                </Container>
            </header>

            {(description || dept.conditions?.length > 0) && (
                <section aria-label={d.overview} className="bg-paper py-14 lg:py-20">
                    <Container className="grid gap-10 lg:grid-cols-12 lg:gap-14">
                        <Prose text={description} className="lg:col-span-7" />
                        <ListCard
                            title={d.conditionsTitle}
                            items={dept.conditions}
                            lang={lang}
                            className="self-start lg:col-span-5"
                        />
                    </Container>
                </section>
            )}

            <NumberedList
                id="dept-services"
                title={d.servicesTitle}
                items={dept.services}
                lang={lang}
            />

            <section aria-labelledby="dept-doctors" className="bg-paper py-12 lg:py-16">
                <Container>
                    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
                        <h2 id="dept-doctors" className="text-h2">
                            {d.doctorsTitle}
                        </h2>
                        {total > 0 && (
                            <span className="text-sm tabular-nums text-ink-3">
                                {total === 1
                                    ? d.doctorsOne
                                    : d.doctorsCount.replace("{count}", digits(total, lang))}
                            </span>
                        )}
                    </div>
                    {doctors.length > 0 ? (
                        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {doctors.map((doc) => (
                                <li key={doc._id}>
                                    <DoctorCard
                                        doctor={doc}
                                        dict={dict}
                                        lang={lang}
                                        waNumber={wa}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-8 max-w-xl text-ink-2">{d.noDoctors}</p>
                    )}
                </Container>
            </section>

            <VisitSteps settings={settings} dict={dict} lang={lang} context={t(dept.name, lang)} />

            {packages.length > 0 && (
                <section aria-labelledby="dept-packages" className="bg-mint py-12 lg:py-16">
                    <Container>
                        <h2 id="dept-packages" className="text-h2">
                            {d.packagesTitle}
                        </h2>
                        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {packages.map((p) => (
                                <li key={p._id} className="flex flex-col rounded-card bg-card p-6">
                                    <h3 className="text-[1.25rem] leading-snug">
                                        {t(p.name, lang)}
                                    </h3>
                                    <p className="mt-2 text-sm text-ink-2">{t(p.summary, lang)}</p>
                                    <div className="mt-auto pt-6">
                                        <Button
                                            appointment
                                            kind="package"
                                            context={t(p.name, lang)}
                                            variant="price"
                                            className="w-full"
                                        >
                                            {dict.cta.callForPrice}
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}

            <nav aria-label={d.eyebrow} className="border-t border-line bg-paper-2 py-12">
                <Container>
                    <p className="eyebrow">{d.all}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                        {departments.map((x) => (
                            <li key={x._id}>
                                <Link
                                    href={href(lang, `/departments/${x.slug}`)}
                                    aria-current={x.slug === dept.slug ? "page" : undefined}
                                    className={cn(
                                        "inline-flex rounded-pill border px-3.5 py-1.5 text-sm",
                                        x.slug === dept.slug
                                            ? "border-ink bg-ink text-paper"
                                            : "border-line bg-card text-ink-2 hover:border-teal-600/50",
                                    )}
                                >
                                    {t(x.name, lang)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Container>
            </nav>
        </>
    );
}

// params are URL data → read inside <Suspense> so the shared App Shell stays URL-independent
// (partialPrefetching). generateStaticParams still prerenders every page in full.
export default function DepartmentPage({ params }) {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <DepartmentPageContent params={params} />
        </Suspense>
    );
}
