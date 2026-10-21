import { Suspense } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMedia } from "@/lib/api/media";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Emphasis } from "@/components/ui/Emphasis";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getDepartments } from "@/lib/api/departments";
import { getDoctors } from "@/lib/api/doctors";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { WEEK } from "@/lib/utils/schedule";
import { whatsappLink, cn } from "@/lib/utils";
import { pageMeta } from "@/lib/seo/metadata";

const PER_PAGE = 24;

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const d = (await getDictionary(lang)).doctors;
    return pageMeta({
        lang,
        path: "/doctors",
        title: d.metaTitle,
        description: d.metaDescription,
    });
}

/**
 * Doctor directory. Header + empty form shell are prerendered; the filtered list reads
 * searchParams (a runtime API) inside <Suspense>. Query params = future API params:
 * GET /doctors?department=<slug>&day=<sat…fri>&q=&page=
 */
export default async function DoctorsPage({ params, searchParams }) {
    const { lang } = await params;
    const media = await getMedia();
    const [dict, departments, { total }] = await Promise.all([
        getDictionary(lang),
        getDepartments(),
        getDoctors({ limit: 1 }),
    ]);
    const d = dict.doctors;
    const lead = d.lead
        .replace("{count}", digits(total, lang))
        .replace("{depts}", digits(departments.length, lang));

    return (
        <>
            <PageHeader
                eyebrow={d.eyebrow}
                title=<Emphasis text={d.title} />
                lead={lead}
                media={media["header.doctors"]}
                lang={lang}
            />
            <Suspense
                fallback={
                    // Card-shaped placeholder at least a screen tall: the footer starts below the
                    // fold, so streaming in the results doesn't shift anything visible (CLS).
                    <Container className="min-h-svh py-10" aria-busy="true">
                        <p className="sr-only">{d.loading}</p>
                        <div aria-hidden className="animate-pulse">
                            <div className="h-28 rounded-3xl bg-ink/[0.05]" />
                            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {Array.from({ length: 4 }, (_, i) => (
                                    <li key={i} className="h-118 rounded-3xl bg-ink/[0.05]" />
                                ))}
                            </ul>
                        </div>
                    </Container>
                }
            >
                <Directory
                    searchParams={searchParams}
                    departments={departments}
                    dict={dict}
                    lang={lang}
                />
            </Suspense>
        </>
    );
}

const one = (v) => (Array.isArray(v) ? v[0] : v)?.toString().trim() || "";

async function Directory({ searchParams, departments, dict, lang }) {
    const sp = await searchParams;
    // Whitelist inputs exactly like the API's validator will (zod in mh-api).
    const department = departments.some((x) => x.slug === one(sp.department))
        ? one(sp.department)
        : "";
    const day = WEEK.includes(one(sp.day)) ? one(sp.day) : "";
    const q = one(sp.q).slice(0, 60);
    const page = Math.max(1, Math.min(50, parseInt(one(sp.page), 10) || 1));

    const [{ items, total }, settings] = await Promise.all([
        getDoctors({ department, day, q, page, limit: PER_PAGE }),
        getSettings(),
    ]);
    const d = dict.doctors;
    const pages = Math.max(1, Math.ceil(total / PER_PAGE));
    const filtered = Boolean(department || day || q);
    const qs = (p) => {
        const u = new URLSearchParams();
        if (department) u.set("department", department);
        if (day) u.set("day", day);
        if (q) u.set("q", q);
        if (p > 1) u.set("page", String(p));
        const s = u.toString();
        return href(lang, `/doctors${s ? `?${s}` : ""}`);
    };
    const wa = settings.primaryWhatsapp;
    const field =
        "h-12 w-full rounded-xl border border-line bg-card px-4 text-[0.95rem] text-ink outline-none transition-[border-color,background-color,box-shadow] placeholder:text-ink-3 focus:border-teal-600 focus:ring-3 focus:ring-teal-500/25";

    return (
        <section className="bg-paper py-10 lg:py-14">
            <Container>
                <form
                    action={href(lang, "/doctors")}
                    method="get"
                    role="search"
                    aria-label={d.eyebrow}
                    className="grid gap-3 rounded-[1.75rem] border border-line bg-paper-2 p-4 sm:p-5 md:grid-cols-[1.2fr_0.9fr_1.3fr_auto] md:items-end"
                >
                    <Select
                        label={d.department}
                        name="department"
                        value={department}
                        className={field}
                    >
                        <option value="">{d.allDepartments}</option>
                        {departments.map((x) => (
                            <option key={x._id} value={x.slug}>
                                {t(x.name, lang)}
                            </option>
                        ))}
                    </Select>
                    <Select label={d.day} name="day" value={day} className={field}>
                        <option value="">{d.anyDay}</option>
                        {WEEK.map((w) => (
                            <option key={w} value={w}>
                                {d.days[w]}
                            </option>
                        ))}
                    </Select>
                    <label className="grid gap-1.5">
                        <span className="text-xs font-medium text-ink-2">{d.name}</span>
                        <input
                            type="search"
                            name="q"
                            defaultValue={q}
                            maxLength={60}
                            placeholder={d.namePlaceholder}
                            autoComplete="off"
                            className={field}
                        />
                    </label>
                    <button
                        type="submit"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-ink px-6 text-[0.95rem] font-medium text-paper transition-colors hover:bg-teal-900"
                    >
                        <Icon name="search" size={18} />
                        {d.apply}
                    </button>
                </form>

                <div className="mt-8 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-4">
                    <h2 className="font-display text-xl text-ink" aria-live="polite">
                        {total === 1
                            ? d.resultsOne
                            : d.results.replace("{count}", digits(total, lang))}
                    </h2>
                    {filtered && (
                        <Link
                            href={href(lang, "/doctors")}
                            className="link-underline text-sm text-teal-700"
                        >
                            {d.clear}
                        </Link>
                    )}
                </div>

                {items.length > 0 ? (
                    <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {items.map((doc) => (
                            <li key={doc._id}>
                                <DoctorCard
                                    doctor={doc}
                                    dict={dict}
                                    lang={lang}
                                    waNumber={wa?.number}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="mt-10 max-w-xl rounded-3xl border border-dashed border-line p-8">
                        <h2 className="text-h3">{d.emptyTitle}</h2>
                        <p className="mt-3 text-ink-2">{d.emptyLead}</p>
                        {wa && (
                            <Button
                                href={whatsappLink(wa.number, dict.appointment.message)}
                                variant="ink"
                                className="mt-6"
                            >
                                <WhatsAppMark size={18} className="text-wa" />
                                {dict.cta.whatsapp}
                            </Button>
                        )}
                    </div>
                )}

                {pages > 1 && (
                    <nav
                        aria-label={d.pagination}
                        className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-6 text-sm"
                    >
                        <PageLink href={page > 1 ? qs(page - 1) : null} label={d.prev} dir="prev" />
                        <span className="tabular-nums text-ink-3">
                            {d.page
                                .replace("{n}", digits(page, lang))
                                .replace("{total}", digits(pages, lang))}
                        </span>
                        <PageLink
                            href={page < pages ? qs(page + 1) : null}
                            label={d.next}
                            dir="next"
                        />
                    </nav>
                )}
            </Container>
        </section>
    );
}

function Select({ label, name, value, className, children }) {
    return (
        <label className="grid gap-1.5">
            <span className="text-xs font-medium text-ink-2">{label}</span>
            <span className="relative">
                <select
                    name={name}
                    defaultValue={value}
                    className={cn(className, "appearance-none pr-10")}
                >
                    {children}
                </select>
                <Icon
                    name="chevron"
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-3"
                />
            </span>
        </label>
    );
}

function PageLink({ href: to, label, dir }) {
    const cls = "inline-flex h-11 items-center gap-2 rounded-pill border px-5";
    if (!to)
        return (
            <span className={cn(cls, "border-line text-ink-3")} aria-disabled>
                {label}
            </span>
        );
    return (
        <Link href={to} rel={dir} className={cn(cls, "border-ink/20 text-ink hover:border-ink/60")}>
            {label}
        </Link>
    );
}
