import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { Emphasis } from "@/components/ui/Emphasis";
import { ContourLines } from "@/components/ui/Ornaments";
import {
    FadeUp,
    Stagger,
    StaggerItem,
    PhotoReveal,
    Drift,
    DrawRule,
} from "@/components/motion/Motion";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { telHref, whatsappLink, formatPhone, cn } from "@/lib/utils";

/* ───────── Key numbers — sits under the QuickPanel. Static figures (no count-up, per the
   anti-template rules): big serif numeral, the unit (+, /7, days) as an italic teal accent,
   a short teal rule that draws in, hairline-separated columns instead of white stat cards. ───────── */
const splitValue = (v) => {
    const m = /^([\d০-৯]+)(.*)$/.exec(v ?? "");
    return m ? [m[1], m[2]] : [v, ""];
};

export function KeyNumbers({ items, dict, lang }) {
    if (!items?.length) return null;
    return (
        <Container as="section" aria-label={dict.home.numbersLabel} className="pt-12 lg:pt-16">
            <Stagger
                as="dl"
                gap={0.09}
                className="grid grid-cols-2 lg:grid-cols-4 [&>div:nth-child(n+3)]:border-t [&>div:nth-child(n+3)]:border-line-soft lg:[&>div:nth-child(n+3)]:border-t-0"
            >
                {items.map((n, i) => {
                    const [num, unit] = splitValue(t(n.value, lang));
                    return (
                        <StaggerItem
                            key={n._id}
                            className={cn(
                                "flex flex-col-reverse justify-end py-7 pr-3 lg:px-8 lg:py-4",
                                i % 2 === 1 && "border-l border-line-soft pl-5 lg:pl-8",
                                i > 0 && "lg:border-l lg:border-line-soft",
                                i === 0 && "lg:pl-0",
                            )}
                        >
                            <dt className="mt-3 max-w-[22ch] text-[0.9rem] leading-snug text-ink-2">
                                {t(n.label, lang)}
                            </dt>
                            <dd className="font-display leading-none text-teal-900">
                                <DrawRule
                                    className="mb-5 block h-0.5 w-8 rounded-full bg-teal-500"
                                    delay={0.2 + i * 0.09}
                                />
                                <span className="text-[clamp(2.6rem,1.9rem+2.6vw,3.9rem)] tracking-[-0.02em] tabular-nums">
                                    {num}
                                </span>
                                {unit && (
                                    <em className="ml-0.5 text-[clamp(1.6rem,1.3rem+1.2vw,2.3rem)] text-teal-600">
                                        {unit.trim() === unit ? unit : `\u00a0${unit.trim()}`}
                                    </em>
                                )}
                            </dd>
                        </StaggerItem>
                    );
                })}
            </Stagger>
        </Container>
    );
}

/* ───────── Centres of excellence — light hairline grid, each cell leads with its photo
   (client 2026-10-25: photos visible by default, not only on hover). Hover / keyboard focus:
   slow zoom, teal tint, title + arrow chip turn teal. No photo → quiet teal panel, no stock filler. ───────── */
export function Centres({ items, dict, lang }) {
    const h = dict.home;
    return (
        <Section
            animate
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
            {/* tall list on mobile (8 photo cells) → trigger on a sliver, not the default 15% */}
            <Stagger
                as="ul"
                viewport={{ once: true, amount: 0.03 }}
                className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
            >
                {items.map((c, i) => (
                    // cell stays opaque (the hairline grid is the bg showing through gap-px);
                    // only its content rises in
                    <li key={c._id} className="bg-card">
                        <StaggerItem className="h-full">
                            <Link
                                href={href(lang, c.href)}
                                className="group flex h-full flex-col p-3 outline-offset-[-4px] transition-colors duration-500 hover:bg-paper/60 lg:p-3.5"
                            >
                                <span className="relative isolate block aspect-16/10 overflow-hidden rounded-2xl bg-teal-50">
                                    {c.image ? (
                                        <Image
                                            src={c.image}
                                            alt=""
                                            fill
                                            sizes="(min-width: 1024px) 18rem, (min-width: 640px) 50vw, 100vw"
                                            className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
                                        />
                                    ) : (
                                        <Icon
                                            name="pulse"
                                            size={40}
                                            className="absolute inset-0 m-auto text-teal-300"
                                        />
                                    )}
                                    {/* resting: faint bottom shade for the number; hover: teal tint */}
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 bg-linear-to-t from-[rgb(7_38_41/0.45)] via-transparent to-transparent"
                                    />
                                    <span
                                        aria-hidden
                                        className="absolute inset-0 bg-teal-700/25 opacity-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                                    />
                                    <span className="absolute bottom-3 left-3 rounded-pill bg-white/90 px-2.5 py-1 font-display text-xs font-medium tabular-nums text-teal-800">
                                        {digits(String(i + 1).padStart(2, "0"), lang)}
                                    </span>
                                </span>

                                <div className="flex flex-1 flex-col gap-2 px-2.5 pb-2 pt-5 lg:px-3">
                                    <h3 className="text-h3 text-ink transition-colors duration-500 group-hover:text-teal-700">
                                        {t(c.title, lang)}
                                    </h3>
                                    <span className="text-[0.95rem] text-ink-2">
                                        {t(c.summary, lang)}
                                    </span>
                                    <span className="mt-auto pt-4">
                                        <span className="inline-grid size-9 place-items-center rounded-full border border-line text-ink-3 transition-colors duration-500 group-hover:border-teal-700 group-hover:bg-teal-700 group-hover:text-white">
                                            <Icon
                                                name="arrow"
                                                size={16}
                                                className="transition-transform duration-500 group-hover:translate-x-0.5"
                                            />
                                        </span>
                                    </span>
                                </div>
                            </Link>
                        </StaggerItem>
                    </li>
                ))}
            </Stagger>
        </Section>
    );
}

/* ───────── Maternity — the hospital's strongest service ───────── */
export function Maternity({ packages, photo, dict, lang }) {
    const h = dict.home;
    return (
        <Container as="section" aria-labelledby="maternity-title" className="py-6 lg:py-10">
            <div className="grid overflow-hidden rounded-4xl border border-line bg-card lg:grid-cols-2">
                <div className="relative min-h-72 lg:min-h-full">
                    <PhotoReveal className="absolute inset-0 overflow-hidden">
                        <Image
                            src={photo?.src ?? "/uploads/facilities/nicu-care.webp"}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 42rem, 100vw"
                            className="object-cover"
                            style={{ objectPosition: photo?.position ?? "center" }}
                        />
                    </PhotoReveal>
                    <FadeUp
                        as="p"
                        delay={0.45}
                        y={12}
                        lang="bn"
                        aria-hidden
                        className="absolute bottom-5 left-6 font-bn-display text-5xl leading-none text-white/85 drop-shadow-[0_2px_12px_rgb(0_0_0/0.35)] sm:text-6xl"
                    >
                        মাতৃত্ব
                    </FadeUp>
                </div>
                <FadeUp delay={0.1} className="p-7 sm:p-10 lg:p-14">
                    <p className="eyebrow">{h.maternityEyebrow}</p>
                    <h2 id="maternity-title" className="mt-4 text-h2">
                        {h.maternityTitle}
                    </h2>
                    <p className="mt-4 text-ink-2">{h.maternityLead}</p>
                    <Stagger
                        as="ul"
                        delay={0.25}
                        className="mt-7 divide-y divide-line-soft border-y border-line-soft"
                    >
                        {packages.map((p) => (
                            <StaggerItem
                                as="li"
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
                            </StaggerItem>
                        ))}
                    </Stagger>
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
                </FadeUp>
            </div>
        </Container>
    );
}

/* ───────── Health packages — Call for Price, never a number ───────── */
export function Packages({ checkups, surgical, dict, lang }) {
    const h = dict.home;
    return (
        <Section
            animate
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
            <Stagger as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {checkups.map((p) => (
                    <StaggerItem
                        as="li"
                        key={p._id}
                        // hover lift uses the `translate` property (not transform) — motion owns transform
                        className="flex flex-col rounded-card bg-card p-6 shadow-[0_1px_0_rgb(12_42_45/0.04),0_18px_40px_-28px_rgb(7_38_41/0.4)] transition-[translate,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_1px_0_rgb(12_42_45/0.04),0_26px_50px_-30px_rgb(7_38_41/0.5)]"
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
                                            key={x.en}
                                            className="rounded-pill bg-paper px-2.5 py-1 text-xs text-ink-2"
                                        >
                                            {t(x, lang)}
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
                    </StaggerItem>
                ))}
            </Stagger>

            {surgical.length > 0 && (
                <FadeUp
                    delay={0.15}
                    className="mt-8 flex flex-col gap-3 rounded-card bg-mint-2 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6"
                >
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
                </FadeUp>
            )}
        </Section>
    );
}

/* ───────── Visit us ───────── */
export function VisitUs({ settings, dict, lang }) {
    const h = dict.home;
    const show = (n) => digits(formatPhone(n), lang);
    const phoneLine = (label, number) => (
        <>
            {label}:{" "}
            <a
                href={telHref(number)}
                className="font-medium tabular-nums text-ink underline decoration-teal-500/50 underline-offset-4 hover:text-teal-700"
            >
                {show(number)}
            </a>
        </>
    );
    // Landline / ambulance appear once the admin sets them (and only if they differ from emergency).
    const extraPhones = [
        settings.ambulance && settings.ambulance !== settings.emergency
            ? phoneLine(h.ambulance, settings.ambulance)
            : null,
        settings.landline ? phoneLine(h.landline, settings.landline) : null,
    ].filter(Boolean);
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
                        className="font-medium tabular-nums text-ink underline decoration-teal-500/50 underline-offset-4 hover:text-teal-700"
                    >
                        {show(settings.hotline)}
                    </a>
                </>,
                <>
                    {h.emergencyAppointments}:{" "}
                    <a
                        href={telHref(settings.emergency)}
                        className="font-medium tabular-nums text-ink underline decoration-teal-500/50 underline-offset-4 hover:text-teal-700"
                    >
                        {show(settings.emergency)}
                    </a>
                </>,
                ...extraPhones,
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
                <FadeUp
                    y={24}
                    className="grid overflow-hidden rounded-4xl bg-card shadow-[0_24px_60px_-40px_rgb(7_38_41/0.5)] lg:grid-cols-12"
                >
                    <div className="p-7 sm:p-10 lg:col-span-5 lg:p-12">
                        <p className="eyebrow">{h.visitEyebrow}</p>
                        <h2 id="visit-title" className="mt-4 text-h2">
                            <Emphasis text={h.visitTitle} />
                        </h2>
                        <Stagger as="ul" delay={0.2} gap={0.09} className="mt-8 space-y-6">
                            {rows.map((r) => (
                                <StaggerItem as="li" key={r.title} className="flex gap-4">
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
                                </StaggerItem>
                            ))}
                        </Stagger>
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
                </FadeUp>
            </Container>
        </section>
    );
}

/* ───────── Closing CTA band — every WhatsApp desk listed (proposal §3) ───────── */
export function CtaBand({ settings, dict, lang }) {
    const h = dict.home;
    const desks = settings.whatsappNumbers;
    return (
        <Container as="section" aria-labelledby="cta-title" className="py-20 lg:py-28">
            <FadeUp
                y={28}
                duration={1.1}
                className="relative isolate grid gap-10 overflow-hidden rounded-4xl bg-teal-900 px-7 py-10 text-paper sm:px-10 lg:grid-cols-12 lg:items-center lg:gap-14 lg:px-14 lg:py-14"
            >
                <Drift range={[-40, 40]} className="absolute -right-20 -top-10 -z-10">
                    <ContourLines className="h-104 w-176 text-teal-300/[0.14]" count={10} />
                </Drift>
                <div className="lg:col-span-6">
                    <h2 id="cta-title" className="text-h2 text-paper">
                        {h.ctaTitle}
                    </h2>
                    <p className="mt-3 max-w-xl text-paper/75">{h.ctaLead}</p>
                    <Button
                        href={href(lang, "/appointment")}
                        variant="bright"
                        size="lg"
                        className="mt-8"
                    >
                        {h.ctaBook}
                        <Icon name="arrow" size={18} />
                    </Button>
                </div>
                {desks.length > 0 && (
                    <div className="lg:col-span-6">
                        <p className="text-sm font-medium text-paper/60">{h.desksTitle}</p>
                        <Stagger
                            as="ul"
                            delay={0.25}
                            className="mt-3 divide-y divide-paper/15 border-y border-paper/15"
                        >
                            {desks.map((w) => (
                                <StaggerItem as="li" key={w._id}>
                                    <a
                                        href={whatsappLink(w.number, dict.appointment.message)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-wa-tap={w._id}
                                        className="group flex items-center gap-4 py-4 outline-offset-4"
                                    >
                                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-paper text-wa">
                                            <WhatsAppMark size={21} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-paper/70">
                                                {t(w.label, lang)}
                                                {w.isPrimary && (
                                                    <span className="whitespace-nowrap rounded-pill bg-teal-300/20 px-2 py-0.5 text-[0.7rem] font-semibold text-teal-100">
                                                        {h.desksPrimary}
                                                    </span>
                                                )}
                                            </span>
                                            <span className="mt-0.5 block font-display text-[1.45rem] leading-tight tabular-nums text-paper">
                                                {digits(formatPhone(w.number), lang)}
                                            </span>
                                        </span>
                                        <Icon
                                            name="arrow"
                                            size={18}
                                            className="shrink-0 text-paper/50 transition-transform group-hover:translate-x-1 group-hover:text-paper"
                                        />
                                    </a>
                                </StaggerItem>
                            ))}
                        </Stagger>
                    </div>
                )}
            </FadeUp>
        </Container>
    );
}
