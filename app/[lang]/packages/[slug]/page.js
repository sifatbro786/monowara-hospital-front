import { Suspense } from "react";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMedia } from "@/lib/api/media";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { PackageCard } from "@/components/packages/PackageCard";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { ListCard } from "@/components/services/Blocks";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getPackages, getPackageBySlug } from "@/lib/api/packages";
import { getDoctors } from "@/lib/api/doctors";
import { getDepartments } from "@/lib/api/departments";
import { href } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/t";
import { whatsappLink } from "@/lib/utils";
import { pageMeta } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";

// Header photo per package category (media slots; Admin → Media management).
const PKG_MEDIA = {
    maternity: "header.bhrpc",
    surgical: "header.careers",
    checkup: "header.packages",
};

// B3: a save in the dashboard → the next request waits for the fresh page (no stale App Shell); new
// slugs are served complete on first visit. See app/[lang]/doctors/[slug]/page.js.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
    return (await getPackages()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
    const { lang, slug } = await params;
    const pkg = await getPackageBySlug(slug);
    if (!pkg) return {};
    return pageMeta({
        lang,
        path: `/packages/${pkg.slug}`, // canonical = current slug (old slugs redirect)
        title: t(pkg.name, lang),
        description: t(pkg.summary, lang),
    });
}

async function PackagePageContent({ params }) {
    const { lang, slug } = await params;
    const [pkg, dict, settings, all, departments, media] = await Promise.all([
        getPackageBySlug(slug),
        getDictionary(lang),
        getSettings(),
        getPackages(),
        getDepartments(),
        getMedia(),
    ]);
    if (!pkg) notFound();
    // Admin renamed the slug: the API resolves the old one (previousSlugs) → 308 to the new URL.
    if (pkg.slug !== slug) permanentRedirect(href(lang, `/packages/${pkg.slug}`));

    const p = dict.packages;
    const name = t(pkg.name, lang);
    const cat = p.categories[pkg.category];
    const wa = settings.primaryWhatsapp;
    const related = all.filter((x) => x.category === pkg.category && x.slug !== pkg.slug);
    const dept = departments.find((d) => d._id === pkg.departments?.[0]);
    const doctors = dept
        ? (await getDoctors({ department: dept.slug, featured: true, limit: 4 })).items
        : [];
    const inclusions = pkg.inclusions || [];

    return (
        <>
            <JsonLd
                data={breadcrumbSchema(lang, dict.nav.home, [
                    { name: dict.nav.packages, path: "/packages" },
                    { name: pkg.name, path: `/packages/${pkg.slug}` },
                ])}
            />
            <PageHeader
                eyebrow={
                    <Link
                        href={href(lang, `/packages?category=${pkg.category}`)}
                        className="inline-flex items-center gap-2 hover:text-paper"
                    >
                        <Icon name="arrow" size={14} className="rotate-180" />
                        {cat}
                    </Link>
                }
                title={name}
                lead={t(pkg.summary, lang)}
                media={media[PKG_MEDIA[pkg.category] || "header.packages"]}
                lang={lang}
            >
                <div className="mt-8 flex flex-wrap gap-3">
                    <Button appointment kind="package" context={name} variant="bright" size="lg">
                        {dict.cta.callForPrice}
                    </Button>
                    {wa && (
                        <Button
                            href={whatsappLink(
                                wa.number,
                                dict.appointment.messagePackage.replace("{name}", name),
                            )}
                            variant="light"
                            size="lg"
                        >
                            <WhatsAppMark size={19} className="text-wa" />
                            WhatsApp
                        </Button>
                    )}
                </div>
            </PageHeader>

            <section className="bg-paper py-14 lg:py-20">
                <Container className="grid gap-10 lg:grid-cols-12 lg:gap-14">
                    <div className="lg:col-span-7">
                        {t(pkg.description, lang) && (
                            <p className="font-display text-[1.45rem] leading-[1.45] text-ink sm:text-[1.6rem]">
                                {t(pkg.description, lang)}
                            </p>
                        )}
                        <dl className="mt-10 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
                            {pkg.whoFor && (
                                <div>
                                    <dt className="text-xs font-medium uppercase tracking-wide text-ink-3">
                                        {p.whoFor}
                                    </dt>
                                    <dd className="mt-1 text-ink">{t(pkg.whoFor, lang)}</dd>
                                </div>
                            )}
                            {pkg.typicalStay && (
                                <div>
                                    <dt className="text-xs font-medium uppercase tracking-wide text-ink-3">
                                        {p.stay}
                                    </dt>
                                    <dd className="mt-1 text-ink">{t(pkg.typicalStay, lang)}</dd>
                                </div>
                            )}
                        </dl>
                        <p className="mt-8 text-sm text-ink-3">{p.priceNote}</p>
                    </div>
                    <div className="self-start lg:col-span-5">
                        {inclusions.length > 0 ? (
                            <ListCard title={p.includes} items={inclusions} lang={lang} />
                        ) : (
                            <div className="rounded-3xl border border-line bg-card p-6 sm:p-8">
                                <h2 className="text-h3">{p.includes}</h2>
                                <p className="mt-3 text-ink-2">{p.includesPending}</p>
                            </div>
                        )}
                    </div>
                </Container>
            </section>

            {doctors.length > 0 && (
                <section aria-labelledby="pkg-doctors" className="bg-paper-2 py-14 lg:py-20">
                    <Container>
                        <div className="flex items-baseline justify-between gap-4">
                            <h2 id="pkg-doctors" className="text-h2">
                                {p.doctors}
                            </h2>
                            <Link
                                href={href(lang, `/departments/${dept.slug}`)}
                                className="link-underline text-sm text-teal-700"
                            >
                                {t(dept.name, lang)}
                            </Link>
                        </div>
                        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {doctors.map((d) => (
                                <li key={d._id}>
                                    <DoctorCard
                                        doctor={d}
                                        dict={dict}
                                        lang={lang}
                                        waNumber={wa?.number}
                                    />
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}

            {related.length > 0 && (
                <section aria-labelledby="pkg-related" className="bg-mint py-14 lg:py-20">
                    <Container>
                        <h2 id="pkg-related" className="text-h2">
                            {p.related.replace("{cat}", cat.toLowerCase())}
                        </h2>
                        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((x) => (
                                <li key={x._id}>
                                    <PackageCard pkg={x} dict={dict} lang={lang} />
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}
        </>
    );
}

export default function PackagePage({ params }) {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <PackagePageContent params={params} />
        </Suspense>
    );
}
