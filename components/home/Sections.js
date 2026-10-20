import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { Emphasis } from "@/components/ui/Emphasis";
import { ContourLines } from "@/components/ui/Ornaments";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { telHref, whatsappLink, formatPhone } from "@/lib/utils";

/* ───────── Key numbers — static figures (no count-up), hairline separated ───────── */
export function KeyNumbers({ items, dict, lang }) {
    return (
        <Container as="section" aria-label={dict.home.numbersLabel} className="pt-14 lg:pt-20">
            <dl className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
                {items.map((n, i) => (
                    <div
                        key={n._id}
                        data-reveal
                        style={{ "--reveal-delay": `${i * 70}ms` }}
                        className="flex flex-col-reverse gap-1 border-line px-2 py-7 odd:border-r sm:px-6 lg:border-r lg:py-9 lg:last:border-r-0"
                    >
                        <dt className="text-sm text-ink-2">{t(n.label, lang)}</dt>
                        <dd className="font-display text-[clamp(2.25rem,1.6rem+2.4vw,3.4rem)] leading-none text-teal-800">
                            {t(n.value, lang)}
                        </dd>
                    </div>
                ))}
            </dl>
        </Container>
    );
}

/* ───────── Centres of excellence — light hairline grid; the centre's photo fades in on hover ───────── */
const CENTRE_FALLBACK = "/uploads/hero/hospital-building-card.webp";

export function Centres({ items, dict, lang }) {
    const h = dict.home;
    return (
        <Section
            number={digits("01", lang)}
            eyebrow={h.servicesEyebrow}
            title={<Emphasis text={h.servicesTitle} />}
            action={
                <Link
                    href={href(lang, "/departments")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 link-underline"
                >
                    {h.servicesAll}
                    <Icon name="arrow" size={16} />
                </Link>
            }
        >
            <ul className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                {items.map((c, i) => (
                    <li
                        key={c._id}
                        data-reveal
                        style={{ "--reveal-delay": `${(i % 4) * 60}ms` }}
                        className="bg-card"
                    >
                        <Link
                            href={href(lang, c.href)}
                            className="group relative isolate flex h-full min-h-60 flex-col gap-3 overflow-hidden p-6 lg:min-h-72 lg:p-7"
                        >
                            {/* photo layer — hover / keyboard focus only, so the grid stays calm at rest */}
                            <Image
                                src={c.image || CENTRE_FALLBACK}
                                alt=""
                                fill
                                sizes="(min-width: 1024px) 20rem, 50vw"
                                className="-z-20 scale-[1.06] object-cover opacity-0 transition-[opacity,transform] duration-700 ease-out-expo group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
                            />
                            <span
                                aria-hidden
                                className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(7_38_41/0.92)_0%,rgb(7_38_41/0.55)_50%,rgb(7_38_41/0.12)_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                            />

                            <span className="font-display text-sm italic text-teal-700/80 tabular-nums transition-colors duration-500 group-hover:text-teal-200">
                                {digits(String(i + 1).padStart(2, "0"), lang)}
                            </span>
                            <h3 className="text-h3 text-ink transition-colors duration-500 group-hover:text-white">
                                {t(c.title, lang)}
                            </h3>
                            <p className="text-[0.95rem] text-ink-2 transition-colors duration-500 group-hover:text-white/85">
                                {t(c.summary, lang)}
                            </p>
                            <span className="mt-auto pt-3">
                                <span className="inline-grid size-9 place-items-center rounded-full border border-line text-ink-3 transition-colors duration-500 group-hover:border-white group-hover:bg-white group-hover:text-teal-800">
                                    <Icon
                                        name="arrow"
                                        size={16}
                                        className="transition-transform duration-500 group-hover:translate-x-0.5"
                                    />
                                </span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </Section>
    );
}

/* ───────── Maternity — the hospital's strongest service ───────── */
export function Maternity({ packages, dict, lang }) {
    const h = dict.home;
    return (
        <Container as="section" aria-labelledby="maternity-title" className="py-6 lg:py-10">
            <div className="grid overflow-hidden rounded-4xl border border-line bg-card lg:grid-cols-2">
                <div className="relative min-h-72 lg:min-h-full">
                    <Image
                        src="/uploads/facilities/nicu-care.webp"
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 42rem, 100vw"
                        className="object-cover"
                    />
                    <p
                        lang="bn"
                        aria-hidden
                        className="absolute bottom-5 left-6 font-bn-display text-5xl leading-none text-white/85 drop-shadow-[0_2px_12px_rgb(0_0_0/0.35)] sm:text-6xl"
                    >
                        মাতৃত্ব
                    </p>
                </div>
                <div className="p-7 sm:p-10 lg:p-14">
                    <p className="eyebrow">{h.maternityEyebrow}</p>
                    <h2 id="maternity-title" className="mt-4 text-h2">
                        {h.maternityTitle}
                    </h2>
                    <p className="mt-4 text-ink-2">{h.maternityLead}</p>
                    <ul className="mt-7 divide-y divide-line-soft border-y border-line-soft">
                        {packages.map((p) => (
                            <li
                                key={p._id}
                                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                            >
                                <span className="min-w-0 flex-1">
                                    <span className="block font-medium">{t(p.name, lang)}</span>
                                    <span className="block text-sm text-ink-3">
                                        {t(p.summary, lang)}
                                    </span>
                                </span>
                                <Button
                                    appointment
                                    kind="package"
                                    context={t(p.name, lang)}
                                    variant="price"
                                    size="sm"
                                    className="self-start sm:self-auto"
                                >
                                    <Icon name="phone" size={15} />
                                    {dict.cta.callForPrice}
                                </Button>
                            </li>
                        ))}
                    </ul>
                    <Button
                        appointment
                        kind="package"
                        context={h.maternityContext}
                        size="lg"
                        className="mt-8"
                    >
                        {h.maternityCta}
                        <Icon name="arrow" size={18} />
                    </Button>
                </div>
            </div>
        </Container>
    );
}

/* ───────── Health packages — Call for Price, never a number ───────── */
export function Packages({ checkups, surgical, dict, lang }) {
    const h = dict.home;
    return (
        <Section
            tone="mint"
            number={digits("02", lang)}
            eyebrow={h.packagesEyebrow}
            title={<Emphasis text={h.packagesTitle} />}
            lead={h.packagesLead}
            action={
                <Link
                    href={href(lang, "/packages")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 link-underline"
                >
                    {h.packagesAll}
                    <Icon name="arrow" size={16} />
                </Link>
            }
        >
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {checkups.map((p, i) => (
                    <li
                        key={p._id}
                        data-reveal
                        style={{ "--reveal-delay": `${i * 70}ms` }}
                        className="flex flex-col rounded-card bg-card p-6 shadow-[0_1px_0_rgb(12_42_45/0.04),0_18px_40px_-28px_rgb(7_38_41/0.4)] transition-transform duration-500 hover:-translate-y-1"
                    >
                        <h3 className="text-[1.3rem] leading-snug">{t(p.name, lang)}</h3>
                        <p className="mt-2 text-sm text-ink-2">{t(p.summary, lang)}</p>
                        {p.inclusions.length > 0 && (
                            <>
                                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-3 [&:lang(bn)]:normal-case [&:lang(bn)]:tracking-normal">
                                    {h.includes}
                                </p>
                                <ul className="mt-2 flex flex-wrap gap-1.5">
                                    {p.inclusions.map((x) => (
                                        <li
                                            key={x}
                                            className="rounded-pill bg-paper px-2.5 py-1 text-xs text-ink-2"
                                        >
                                            {x}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        <div className="mt-auto pt-6">
                            <Button
                                appointment
                                kind="package"
                                context={t(p.name, lang)}
                                variant="price"
                                className="w-full"
                            >
                                <Icon name="phone" size={16} />
                                {dict.cta.callForPrice}
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>

            {surgical.length > 0 && (
                <div className="mt-8 flex flex-col gap-3 rounded-card bg-mint-2 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6">
                    <p className="shrink-0 text-sm">
                        <span className="font-semibold text-ink">{h.surgicalTitle}</span>{" "}
                        <span className="text-ink-2">· {h.surgicalLead}</span>
                    </p>
                    <ul className="flex flex-wrap gap-2">
                        {surgical.map((p) => (
                            <li key={p._id}>
                                <button
                                    type="button"
                                    data-appt=""
                                    data-appt-kind="package"
                                    data-appt-context={t(p.name, lang)}
                                    className="inline-flex min-h-10 items-center gap-1.5 rounded-pill border border-line bg-card px-3.5 text-sm text-ink transition-colors hover:border-teal-700/50 hover:text-teal-800"
                                >
                                    {t(p.name, lang)}
                                    <Icon name="arrowUpRight" size={14} className="text-ink-3" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Section>
    );
}

/* ───────── Visit us ───────── */
export function VisitUs({ settings, dict, lang }) {
    const h = dict.home;
    const show = (n) => digits(formatPhone(n), lang);
    const rows = [
        { icon: "pin", title: h.address, body: [t(settings.address, lang)] },
        {
            icon: "phone",
            title: h.phone,
            body: [
                <>
                    {h.hotline}:{" "}
                    <a
                        href={telHref(settings.hotline)}
                        className="tabular-nums text-ink hover:text-teal-700"
                    >
                        {show(settings.hotline)}
                    </a>
                </>,
                <>
                    {h.emergencyAppointments}:{" "}
                    <a
                        href={telHref(settings.emergency)}
                        className="tabular-nums text-ink hover:text-teal-700"
                    >
                        {show(settings.emergency)}
                    </a>
                </>,
            ],
        },
        {
            icon: "clock",
            title: h.hours,
            body: [
                `${dict.nav.emergency}: ${t(settings.hours.emergency, lang)}`,
                `${h.opd}: ${t(settings.hours.opd, lang)}`,
            ],
        },
    ];

    return (
        <section aria-labelledby="visit-title" className="bg-mint">
            <Container className="py-16 lg:py-24">
                <div className="grid overflow-hidden rounded-4xl bg-card shadow-[0_24px_60px_-40px_rgb(7_38_41/0.5)] lg:grid-cols-12">
                    <div className="p-7 sm:p-10 lg:col-span-5 lg:p-12">
                        <p className="eyebrow">{h.visitEyebrow}</p>
                        <h2 id="visit-title" className="mt-4 text-h2">
                            <Emphasis text={h.visitTitle} />
                        </h2>
                        <ul className="mt-8 space-y-6">
                            {rows.map((r) => (
                                <li key={r.title} className="flex gap-4">
                                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-700">
                                        <Icon name={r.icon} size={19} />
                                    </span>
                                    <div>
                                        <p className="font-semibold text-ink">{r.title}</p>
                                        {r.body.map((b, i) => (
                                            <p key={i} className="text-[0.95rem] text-ink-2">
                                                {b}
                                            </p>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-9 flex flex-wrap gap-3">
                            <Button href={settings.map.directions} variant="ink">
                                <Icon name="pin" size={17} />
                                {dict.cta.directions}
                            </Button>
                            <Button href={telHref(settings.hotline)} variant="outline">
                                <Icon name="phone" size={17} />
                                {dict.cta.callNow}
                            </Button>
                        </div>
                    </div>
                    <div className="relative min-h-80 bg-paper-2 lg:col-span-7">
                        <iframe
                            title={h.mapTitle}
                            src={settings.map.embed}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0 size-full border-0 grayscale-35"
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
}

/* ───────── Closing CTA band ───────── */
export function CtaBand({ settings, dict, lang }) {
    const h = dict.home;
    const wa = settings.primaryWhatsapp;
    return (
        <Container as="section" aria-labelledby="cta-title" className="py-20 lg:py-28">
            <div className="relative isolate overflow-hidden rounded-4xl bg-teal-900 px-7 py-10 text-paper sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-14 lg:py-14">
                <ContourLines
                    className="absolute -right-20 -top-10 -z-10 h-104 w-176 text-teal-300/[0.14]"
                    count={10}
                />
                <div className="max-w-xl">
                    <h2 id="cta-title" className="text-h2 text-paper">
                        {h.ctaTitle}
                    </h2>
                    <p className="mt-3 text-paper/75">{h.ctaLead}</p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
                    {wa && (
                        <Button
                            href={whatsappLink(wa.number, dict.appointment.message)}
                            variant="light"
                            size="lg"
                        >
                            <WhatsAppMark size={20} className="text-wa" />
                            WhatsApp
                        </Button>
                    )}
                    <Button href={href(lang, "/appointment")} variant="bright" size="lg">
                        {h.ctaBook}
                        <Icon name="arrow" size={18} />
                    </Button>
                </div>
            </div>
        </Container>
    );
}
