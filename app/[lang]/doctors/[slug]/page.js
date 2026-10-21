import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Container } from "@/components/ui/Layout";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { DoctorStatus } from "@/components/doctor/DoctorStatus";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getDoctors, getDoctorBySlug, getAllDoctors } from "@/lib/api/doctors";
import { href } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/t";
import { WEEK, formatTime } from "@/lib/utils/schedule";
import { whatsappLink, cn } from "@/lib/utils";
import { pageMeta, absUrl, SITE_URL } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, HOSPITAL_ID } from "@/lib/seo/schema";

export async function generateStaticParams() {
    const items = await getAllDoctors();
    return items.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
    const { lang, slug } = await params;
    const [doc, dict] = await Promise.all([getDoctorBySlug(slug), getDictionary(lang)]);
    if (!doc) return {};
    const fill = (s) =>
        (doc.degrees ? s.replace("{degrees}", doc.degrees) : s.replace(/\{degrees\}[.।]\s*/, ""))
            .replace("{name}", t(doc.name, lang))
            .replace("{designation}", t(doc.designation, lang));
    return pageMeta({
        lang,
        path: `/doctors/${doc.slug}`, // canonical = current slug (old slugs redirect)
        title: fill(dict.doctor.metaTitle),
        description: fill(dict.doctor.metaDescription),
        image: doc.photo,
    });
}

async function DoctorPageContent({ params }) {
    const { lang, slug } = await params;
    const [doc, dict, settings] = await Promise.all([
        getDoctorBySlug(slug),
        getDictionary(lang),
        getSettings(),
    ]);
    if (!doc) notFound();
    // Admin renamed the slug: the API resolves the old one (previousSlugs) → 308 to the new URL.
    if (doc.slug !== slug) permanentRedirect(href(lang, `/doctors/${doc.slug}`));

    const p = dict.doctor;
    const name = t(doc.name, lang);
    const wa = settings.primaryWhatsapp;
    const msg = dict.appointment.messageWith.replace("{name}", name);
    const related = doc.department
        ? (await getDoctors({ department: doc.department.slug, limit: 5 })).items
              .filter((x) => x.slug !== doc.slug)
              .slice(0, 4)
        : [];

    // Group slots by day in BD week order; days without a slot render as "No chamber".
    const byDay = WEEK.map((day) => ({
        day,
        slots: doc.schedule.filter((s) => s.day === day),
    }));
    const hasTable = doc.schedule.length > 0;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Physician",
        name: doc.name.en,
        url: `${SITE_URL}${href("en", `/doctors/${doc.slug}`)}`,
        ...(doc.photo && { image: absUrl(doc.photo) }),
        ...(doc.department && { medicalSpecialty: doc.department.name.en }),
        description: doc.specialty?.en || undefined,
        hospitalAffiliation: {
            "@type": "Hospital",
            "@id": HOSPITAL_ID,
            name: settings.legalName.en,
            address: settings.address.en,
            telephone: settings.hotline,
        },
        ...(hasTable && {
            openingHoursSpecification: doc.schedule.map((s) => ({
                "@type": "OpeningHoursSpecification",
                dayOfWeek: `https://schema.org/${DAY_SCHEMA[s.day]}`,
                opens: s.from,
                closes: s.to,
            })),
        }),
    };

    return (
        <>
            <JsonLd
                data={[
                    jsonLd,
                    breadcrumbSchema(lang, dict.nav.home, [
                        { name: dict.nav.findDoctor, path: "/doctors" },
                        { name: doc.name, path: `/doctors/${doc.slug}` },
                    ]),
                ]}
            />
            <section className="border-b border-line bg-paper-2">
                <Container className="py-10 lg:py-16">
                    <Link
                        href={href(lang, "/doctors")}
                        className="inline-flex items-center gap-2 text-sm text-teal-700 hover:text-teal-900"
                    >
                        <Icon name="arrow" size={16} className="rotate-180" />
                        {p.back}
                    </Link>
                    <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
                        {/* Portrait: rounded card + offset hairline frame (same motif as the home hero) */}
                        <div className="relative mx-auto w-full max-w-72 lg:col-span-4 lg:mx-0 lg:max-w-80">
                            <div
                                aria-hidden
                                className="absolute inset-0 translate-x-3 translate-y-3 rounded-[1.75rem] border border-teal-300"
                            />
                            <div className="relative aspect-4/5 overflow-hidden rounded-[1.75rem] bg-teal-100 shadow-[0_18px_40px_-24px_rgba(12,42,45,0.45)]">
                                {doc.photo && (
                                    <Image
                                        src={doc.photo}
                                        alt={name}
                                        fill
                                        loading="eager"
                                        fetchPriority="high"
                                        sizes="(min-width: 1024px) 20rem, 18rem"
                                        className="object-cover object-[50%_15%]"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-8 lg:pb-4">
                            {doc.department && (
                                <Link
                                    href={href(lang, `/departments/${doc.department.slug}`)}
                                    className="eyebrow hover:text-teal-900"
                                >
                                    {t(doc.department.name, lang)}
                                </Link>
                            )}
                            <h1 className="mt-4 text-h1">{name}</h1>
                            <DoctorStatus
                                schedule={doc.schedule}
                                leave={doc.leave}
                                labels={{ today: p.today, onLeave: p.onLeave }}
                                lang={lang}
                                className="mt-4"
                            />
                            <p className="mt-3 text-lg text-ink-2">{t(doc.designation, lang)}</p>
                            {doc.specialty && (
                                <p className="mt-4 max-w-2xl text-ink-2">
                                    {t(doc.specialty, lang)}
                                </p>
                            )}
                            <dl className="mt-8 grid gap-x-10 gap-y-5 border-t border-line pt-6 sm:grid-cols-2">
                                {doc.degrees && <Fact label={p.degrees} value={doc.degrees} />}
                                {doc.affiliation && (
                                    <Fact label={p.affiliation} value={t(doc.affiliation, lang)} />
                                )}
                                {doc.bmdc && <Fact label={p.bmdc} value={doc.bmdc} />}
                            </dl>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    data-appt=""
                                    data-appt-context={name}
                                    className={buttonClass({ variant: "ink", size: "lg" })}
                                >
                                    <Icon name="calendar" size={18} />
                                    {p.book}
                                </button>
                                {wa && (
                                    <a
                                        href={whatsappLink(wa.number, msg)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-wa-tap={wa._id}
                                        className={buttonClass({ variant: "outline", size: "lg" })}
                                    >
                                        <WhatsAppMark size={19} className="text-wa" />
                                        {p.whatsapp}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <section aria-labelledby="chamber-title" className="bg-paper py-14 lg:py-20">
                <Container className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <h2 id="chamber-title" className="text-h2">
                            {p.chamber}
                        </h2>
                        <p className="mt-3 text-ink-2">{p.chamberLead}</p>
                    </div>
                    <div className="lg:col-span-8">
                        {hasTable ? (
                            <ul className="divide-y divide-line border-y border-line">
                                {byDay.map(({ day, slots }) => (
                                    <li
                                        key={day}
                                        className={cn(
                                            "flex items-baseline justify-between gap-6 py-4",
                                            !slots.length && "text-ink-3",
                                        )}
                                    >
                                        <span className="font-medium">
                                            {dict.doctors.days[day]}
                                        </span>
                                        <span className="text-right tabular-nums">
                                            {slots.length
                                                ? slots
                                                      .map(
                                                          (s) =>
                                                              `${formatTime(s.from, lang)} – ${formatTime(s.to, lang)}`,
                                                      )
                                                      .join(", ")
                                                : p.closed}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="rounded-3xl border border-line bg-card p-6 text-lg">
                                {doc.scheduleNote ? t(doc.scheduleNote, lang) : p.byAppointment}
                            </p>
                        )}
                    </div>
                </Container>
            </section>

            {related.length > 0 && (
                <section aria-labelledby="related-title" className="bg-paper-2 py-14 lg:py-20">
                    <Container>
                        <h2 id="related-title" className="text-h2">
                            {p.related.replace("{dept}", t(doc.department.name, lang))}
                        </h2>
                        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {related.map((r) => (
                                <li key={r._id}>
                                    <DoctorCard
                                        doctor={r}
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
        </>
    );
}

const DAY_SCHEMA = {
    sat: "Saturday",
    sun: "Sunday",
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
};

function Fact({ label, value }) {
    return (
        <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-3">{label}</dt>
            <dd className="mt-1 text-ink">{value}</dd>
        </div>
    );
}

// params are URL data → read inside <Suspense> so the shared App Shell stays URL-independent
// (partialPrefetching). generateStaticParams still prerenders every page in full.
export default function DoctorPage({ params }) {
    return (
        <Suspense fallback={<PageSkeleton />}>
            <DoctorPageContent params={params} />
        </Suspense>
    );
}
