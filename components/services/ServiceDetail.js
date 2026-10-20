import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { telHref, formatPhone } from "@/lib/utils";
import { Prose, ListCard, VisitSteps } from "./Blocks";

/**
 * Shared detail layout for facilities (/facilities/[slug]) and diagnostics (/diagnostics/[slug]).
 * `item` = facility or diagnostic doc; `siblings` = the rest of the same collection.
 */
export function ServiceDetail({ item, siblings, base, eyebrow, backHref, settings, dict, lang }) {
    const s = dict.services;
    const isEmergency = item.slug === "emergency" || item.slug === "ambulance";
    const phone = isEmergency ? settings.emergency : settings.hotline;
    const description = t(item.description, lang);
    const timing = t(item.timing, lang);
    const preparation = t(item.preparation, lang);
    const isDiagnostic = "timing" in item;

    return (
        <>
            <header className="border-b border-line bg-paper-2">
                <Container className="grid gap-10 py-10 lg:grid-cols-12 lg:items-end lg:py-16">
                    <div className="lg:col-span-7">
                        <Link
                            href={href(lang, backHref)}
                            className="eyebrow inline-flex items-center gap-2 hover:text-teal-900"
                        >
                            <Icon name="arrow" size={14} className="rotate-180" />
                            {eyebrow}
                        </Link>
                        <h1 className="mt-6 text-h1">{t(item.name, lang)}</h1>
                        {item.is24x7 && (
                            <p className="mt-4 inline-flex items-center gap-2 rounded-pill bg-card px-3 py-1 text-sm font-medium text-teal-800">
                                <span className="size-2 rounded-full bg-teal-500" aria-hidden />
                                {s.open247}
                            </p>
                        )}
                        <p className="mt-4 max-w-2xl text-lg text-ink-2">{t(item.summary, lang)}</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button
                                href={telHref(phone)}
                                variant={isEmergency ? "emergency" : "ink"}
                                size="lg"
                            >
                                <Icon name="phone" size={18} />
                                {isEmergency ? s.callEmergency : s.call} ·{" "}
                                <span className="tabular-nums">
                                    {digits(formatPhone(phone), lang)}
                                </span>
                            </Button>
                            {!isEmergency && (
                                <Button
                                    appointment
                                    context={t(item.name, lang)}
                                    variant="outline"
                                    size="lg"
                                >
                                    {dict.cta.book}
                                </Button>
                            )}
                        </div>
                    </div>
                    {item.image && (
                        <div className="relative aspect-5/4 overflow-hidden rounded-3xl bg-teal-100 lg:col-span-5">
                            <Image
                                src={item.image}
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

            <section className="bg-paper py-14 lg:py-20">
                <Container className="grid gap-10 lg:grid-cols-12 lg:gap-14">
                    <Prose text={description} className="lg:col-span-7" />
                    <div className="grid gap-5 self-start lg:col-span-5">
                        <ListCard
                            title={isDiagnostic ? s.tests : s.features}
                            items={isDiagnostic ? item.tests : item.features}
                            lang={lang}
                        />
                        {isDiagnostic && (
                            <dl className="grid gap-5 rounded-3xl bg-mint p-6 sm:p-8">
                                <div>
                                    <dt className="font-semibold text-ink">{s.timing}</dt>
                                    <dd className="mt-1 text-ink-2">{timing || s.askDesk}</dd>
                                </div>
                                {preparation && (
                                    <div>
                                        <dt className="font-semibold text-ink">{s.preparation}</dt>
                                        <dd className="mt-1 text-ink-2">{preparation}</dd>
                                    </div>
                                )}
                            </dl>
                        )}
                    </div>
                </Container>
            </section>

            {item.whenTo && (
                <section className="bg-emergency-soft py-12">
                    <Container className="grid gap-6 lg:grid-cols-12 lg:items-center">
                        <div className="lg:col-span-8">
                            <h2 className="text-h3 text-emergency-ink">{s.whenTo}</h2>
                            <p className="mt-3 max-w-3xl text-ink">{t(item.whenTo, lang)}</p>
                        </div>
                        <div className="lg:col-span-4 lg:text-right">
                            <Button
                                href={telHref(settings.emergency)}
                                variant="emergency"
                                size="lg"
                            >
                                <Icon name="phone" size={18} />
                                <span className="tabular-nums">
                                    {digits(formatPhone(settings.emergency), lang)}
                                </span>
                            </Button>
                        </div>
                    </Container>
                </section>
            )}

            {!isEmergency && (
                <VisitSteps
                    settings={settings}
                    dict={dict}
                    lang={lang}
                    context={t(item.name, lang)}
                />
            )}

            {siblings.length > 0 && (
                <nav aria-label={s.others} className="border-t border-line bg-paper-2 py-12">
                    <Container>
                        <p className="eyebrow">{s.others}</p>
                        <ul className="mt-5 flex flex-wrap gap-2">
                            {siblings.map((x) => (
                                <li key={x._id}>
                                    <Link
                                        href={href(lang, `${base}/${x.slug}`)}
                                        className="inline-flex rounded-pill border border-line bg-card px-3.5 py-1.5 text-sm text-ink-2 hover:border-teal-600/50"
                                    >
                                        {t(x.name, lang)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Container>
                </nav>
            )}
        </>
    );
}
