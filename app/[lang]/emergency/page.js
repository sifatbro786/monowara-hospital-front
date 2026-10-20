import Image from "next/image";
import Link from "next/link";
import { getMedia } from "@/lib/api/media";
import { Container } from "@/components/ui/Layout";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getFacilityBySlug } from "@/lib/api/services";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { telHref, formatPhone } from "@/lib/utils";

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const e = (await getDictionary(lang)).emergency;
    return {
        title: e.eyebrow,
        description: e.metaDescription,
        alternates: { canonical: href(lang, "/emergency") },
    };
}

/** Emergency — call-first page. The loader never plays here (layout gate script). */
export default async function EmergencyPage({ params }) {
    const { lang } = await params;
    const [dict, settings, unit, media] = await Promise.all([
        getDictionary(lang),
        getSettings(),
        getFacilityBySlug("emergency"),
        getMedia(),
    ]);
    const bg = media["header.emergency"];
    const e = dict.emergency;
    const show = (n) => digits(formatPhone(n), lang);
    const sameAmbulance = settings.ambulance === settings.emergency;

    return (
        <>
            <header className="relative isolate overflow-hidden bg-ink text-paper">
                {bg?.src && (
                    <>
                        <Image
                            src={bg.src}
                            alt={t(bg.alt, lang)}
                            fill
                            loading="eager"
                            fetchPriority="high"
                            sizes="100vw"
                            className="-z-20 object-cover"
                            style={{ objectPosition: bg.position || "center" }}
                        />
                        <div
                            aria-hidden
                            className="absolute inset-0 -z-10 bg-linear-to-r from-ink via-ink/90 to-ink/50"
                            style={{ opacity: bg.overlay ?? 0.9 }}
                        />
                    </>
                )}
                <Container className="py-14 lg:py-20">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff6a5c]">
                        <span
                            className="size-2 animate-pulse rounded-full bg-[#ff2d20]"
                            aria-hidden
                        />
                        {e.eyebrow}
                    </p>
                    <h1 className="mt-5 max-w-3xl text-h1 text-paper">{e.title}</h1>
                    <p className="mt-4 max-w-2xl text-lg text-paper/75">{e.lead}</p>
                    <a
                        href={telHref(settings.emergency)}
                        className="mt-10 flex max-w-xl items-center justify-between gap-6 rounded-[1.5rem] bg-emergency px-6 py-5 text-white transition-colors hover:bg-emergency-ink sm:px-8 sm:py-6"
                    >
                        <span className="font-display text-[2.2rem] leading-none tabular-nums sm:text-[2.8rem]">
                            {show(settings.emergency)}
                        </span>
                        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white/15">
                            <Icon name="phone" size={26} />
                        </span>
                    </a>
                    <div className="mt-6 flex flex-wrap gap-3 text-sm">
                        {!sameAmbulance && settings.ambulance && (
                            <Button href={telHref(settings.ambulance)} variant="light">
                                {e.ambulance} ·{" "}
                                <span className="tabular-nums">{show(settings.ambulance)}</span>
                            </Button>
                        )}
                        <Button href={telHref(settings.hotline)} variant="light">
                            {dict.appointment.hotline} ·{" "}
                            <span className="tabular-nums">{show(settings.hotline)}</span>
                        </Button>
                        <Button href={settings.map.directions} variant="onTeal">
                            <Icon name="pin" size={17} />
                            {e.directions}
                        </Button>
                    </div>
                </Container>
            </header>

            <Container className="grid gap-10 py-14 lg:grid-cols-12 lg:py-20">
                {unit?.whenTo && (
                    <section className="rounded-3xl bg-emergency-soft p-6 sm:p-8 lg:col-span-7">
                        <h2 className="text-h3 text-emergency-ink">{dict.services.whenTo}</h2>
                        <p className="mt-3 text-lg leading-relaxed text-ink">
                            {t(unit.whenTo, lang)}
                        </p>
                    </section>
                )}
                <section className="rounded-3xl border border-line bg-card p-6 sm:p-8 lg:col-span-5">
                    <h2 className="text-h3">{e.bring}</h2>
                    <ul className="mt-4 divide-y divide-line">
                        {e.bringList.map((x) => (
                            <li key={x} className="flex gap-3 py-3 text-ink-2">
                                <Icon
                                    name="check"
                                    size={18}
                                    className="mt-0.5 shrink-0 text-teal-700"
                                />
                                {x}
                            </li>
                        ))}
                    </ul>
                </section>
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8 lg:col-span-12">
                    <Link
                        href={href(lang, "/facilities/emergency")}
                        className="link-underline text-teal-700"
                    >
                        {t(unit?.name, lang)}
                    </Link>
                    <Link
                        href={href(lang, "/doctors")}
                        className="text-sm text-ink-2 hover:text-teal-800"
                    >
                        {e.notEmergency} →
                    </Link>
                </div>
            </Container>
        </>
    );
}
