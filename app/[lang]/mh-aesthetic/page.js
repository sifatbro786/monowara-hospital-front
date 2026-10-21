import Image from "next/image";
import { Container } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { Prose } from "@/components/services/Blocks";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getAesthetic } from "@/lib/api/aesthetic";
import { getMedia } from "@/lib/api/media";
import { t, digits } from "@/lib/i18n/t";
import { telHref, whatsappLink, formatPhone } from "@/lib/utils";
import { pageMeta } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, clinicSchema } from "@/lib/seo/schema";

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const [dict, a] = await Promise.all([getDictionary(lang), getAesthetic()]);
    return pageMeta({
        lang,
        path: "/mh-aesthetic",
        title: t(a.name, lang),
        description: dict.aesthetic.metaDescription,
        image: a.heroImage,
    });
}

/** MH Aesthetic & Wellness — sub-brand page with its own desk numbers (not the hospital's). */
export default async function AestheticPage({ params }) {
    const { lang } = await params;
    const [dict, a, media] = await Promise.all([getDictionary(lang), getAesthetic(), getMedia()]);
    const x = dict.aesthetic;
    const hero = media["header.mhAesthetic"]?.src || a.heroImage;
    const reception = media["aesthetic.reception"];
    const name = t(a.name, lang);
    const ask = (what) => whatsappLink(a.whatsapp, x.enquiry.replace("{name}", what));

    return (
        <>
            <JsonLd
                data={[
                    clinicSchema({
                        lang,
                        path: "/mh-aesthetic",
                        name,
                        description: t(a.tagline, lang),
                        image: a.heroImage,
                        telephone: a.phone,
                        email: a.email,
                    }),
                    breadcrumbSchema(lang, dict.nav.home, [{ name, path: "/mh-aesthetic" }]),
                ]}
            />
            <header className="relative isolate overflow-hidden bg-ink text-paper">
                {hero && (
                    <Image
                        src={hero}
                        alt=""
                        fill
                        loading="eager"
                        fetchPriority="high"
                        sizes="100vw"
                        className="-z-10 object-cover opacity-55"
                    />
                )}
                <div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-linear-to-r from-ink via-ink/85 to-ink/30"
                />
                <Container className="py-16 lg:py-28">
                    <p className="eyebrow text-teal-300">{x.eyebrow}</p>
                    <h1 className="mt-4 max-w-3xl text-h1 text-paper">{name}</h1>
                    <p className="mt-4 max-w-xl text-lg text-paper/75">{t(a.tagline, lang)}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Button href={ask(name)} variant="light" size="lg">
                            <WhatsAppMark size={19} className="text-wa" />
                            {x.enquire}
                        </Button>
                        <Button href={telHref(a.phone)} variant="onTeal" size="lg">
                            <Icon name="phone" size={18} />
                            <span className="tabular-nums">
                                {digits(formatPhone(a.phone), lang)}
                            </span>
                        </Button>
                    </div>
                </Container>
            </header>

            <section className="bg-paper py-14 lg:py-20">
                <Container className="grid gap-10 lg:grid-cols-12 lg:gap-14">
                    <div className="lg:col-span-7">
                        <Prose text={t(a.about, lang)} />
                        <dl className="mt-10 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
                            <div>
                                <dt className="eyebrow">{x.mission}</dt>
                                <dd className="mt-2 text-ink-2">{t(a.mission, lang)}</dd>
                            </div>
                            <div>
                                <dt className="eyebrow">{x.vision}</dt>
                                <dd className="mt-2 text-ink-2">{t(a.vision, lang)}</dd>
                            </div>
                        </dl>
                    </div>
                    <div className="grid gap-5 self-start lg:col-span-5">
                        {reception?.src && (
                            <div className="relative aspect-16/9 overflow-hidden rounded-3xl bg-teal-100">
                                <Image
                                    src={reception.src}
                                    alt={t(reception.alt, lang)}
                                    fill
                                    sizes="(min-width: 1024px) 30rem, 92vw"
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="rounded-3xl border border-line bg-card p-6 sm:p-8">
                            <h2 className="text-h3">{x.contact}</h2>
                            <dl className="mt-5 divide-y divide-line">
                                {[
                                    [
                                        x.phone,
                                        <a
                                            key="p"
                                            href={telHref(a.phone)}
                                            className="tabular-nums hover:text-teal-800"
                                        >
                                            {digits(formatPhone(a.phone), lang)}
                                        </a>,
                                    ],
                                    [
                                        x.whatsapp,
                                        <a
                                            key="w"
                                            href={ask(name)}
                                            className="tabular-nums hover:text-teal-800"
                                        >
                                            {digits(formatPhone(a.whatsapp), lang)}
                                        </a>,
                                    ],
                                    [
                                        x.email,
                                        <a
                                            key="e"
                                            href={`mailto:${a.email}`}
                                            className="break-all hover:text-teal-800"
                                        >
                                            {a.email}
                                        </a>,
                                    ],
                                    [x.hours, t(a.hours, lang)],
                                    [x.location, t(a.location, lang)],
                                ].map(([k, v]) => (
                                    <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 py-3">
                                        <dt className="text-sm text-ink-3">{k}</dt>
                                        <dd className="text-ink">{v}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </Container>
            </section>

            <section aria-labelledby="aes-treatments" className="bg-paper-2 py-14 lg:py-20">
                <Container>
                    <div className="grid gap-3 lg:grid-cols-12 lg:items-end">
                        <h2 id="aes-treatments" className="text-h2 lg:col-span-6">
                            {x.treatments}
                        </h2>
                        <p className="text-ink-2 lg:col-span-6 lg:text-right">{x.treatmentsLead}</p>
                    </div>
                    <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                        {a.treatments.map((tr) => (
                            <li key={tr._id} className="flex flex-col">
                                <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-teal-100">
                                    {tr.image && (
                                        <Image
                                            src={tr.image}
                                            alt=""
                                            fill
                                            sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 92vw"
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                <h3 className="mt-4 text-[1.25rem] leading-snug">
                                    {t(tr.name, lang)}
                                </h3>
                                <p className="mt-1.5 flex-1 text-sm text-ink-2">
                                    {t(tr.summary, lang)}
                                </p>
                                <a
                                    href={ask(t(tr.name, lang))}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-teal-800 hover:text-teal-900"
                                >
                                    <WhatsAppMark size={16} className="text-wa" />
                                    {x.enquire}
                                </a>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            {a.doctors.length > 0 && (
                <section aria-labelledby="aes-team" className="bg-paper py-14 lg:py-20">
                    <Container>
                        <h2 id="aes-team" className="text-h2">
                            {x.team}
                        </h2>
                        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                            {a.doctors.map((d) => (
                                <li key={d._id}>
                                    <DoctorCard
                                        doctor={d}
                                        dict={dict}
                                        lang={lang}
                                        waNumber={a.whatsapp}
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
