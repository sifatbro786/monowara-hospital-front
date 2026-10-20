import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa6";
import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMedia } from "@/lib/api/media";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Emphasis } from "@/components/ui/Emphasis";
import { ContactForm } from "@/components/forms/ContactForm";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { telHref, whatsappLink, formatPhone } from "@/lib/utils";

const SOCIAL = {
    facebook: ["Facebook", FaFacebookF],
    instagram: ["Instagram", FaInstagram],
    youtube: ["YouTube", FaYoutube],
    linkedin: ["LinkedIn", FaLinkedinIn],
};

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const c = (await getDictionary(lang)).contact;
    return {
        title: c.eyebrow,
        description: c.metaDescription,
        alternates: { canonical: href(lang, "/contact") },
    };
}

export default async function ContactPage({ params }) {
    const { lang } = await params;
    const media = await getMedia();
    const [dict, s] = await Promise.all([getDictionary(lang), getSettings()]);
    const c = dict.contact;
    const show = (n) => digits(formatPhone(n), lang);
    const socials = Object.entries(s.socials || {}).filter(([k, u]) => u && SOCIAL[k]);
    const tel = (n) => (
        <a href={telHref(n)} className="tabular-nums hover:text-teal-800">
            {show(n)}
        </a>
    );

    return (
        <>
            <PageHeader
                eyebrow={c.eyebrow}
                title=<Emphasis text={c.title} />
                lead={c.lead}
                media={media["header.contact"]}
                lang={lang}
            />

            <Container className="grid gap-10 py-14 lg:grid-cols-12 lg:py-20">
                <aside className="lg:col-span-5">
                    <dl className="divide-y divide-line border-y border-line">
                        <Row k={c.address} v={t(s.address, lang)} />
                        <Row k={c.hotline} v={tel(s.hotline)} />
                        <Row
                            k={c.emergency}
                            v={<span className="text-emergency-ink">{tel(s.emergency)}</span>}
                        />
                        {s.whatsappNumbers.map((w) => (
                            <Row
                                key={w._id}
                                k={t(w.label, lang)}
                                v={
                                    <a
                                        href={whatsappLink(w.number, dict.appointment.message)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-wa-tap={w._id}
                                        className="inline-flex items-center gap-2 tabular-nums hover:text-teal-800"
                                    >
                                        <WhatsAppMark size={16} className="text-wa" />
                                        {show(w.number)}
                                    </a>
                                }
                            />
                        ))}
                        {s.phones.length > 0 && (
                            <Row
                                k={c.phones}
                                v={
                                    <span className="flex flex-col">
                                        {s.phones.map((p) => (
                                            <span key={p.number}>{tel(p.number)}</span>
                                        ))}
                                    </span>
                                }
                            />
                        )}
                        <Row
                            k={c.email}
                            v={
                                <a
                                    href={`mailto:${s.email}`}
                                    className="break-all hover:text-teal-800"
                                >
                                    {s.email}
                                </a>
                            }
                        />
                        <Row k={c.hours} v={t(s.hours.emergency, lang)} />
                    </dl>
                    {socials.length > 0 && (
                        <div className="mt-8">
                            <p className="eyebrow">{c.social}</p>
                            <ul className="mt-3 flex gap-2">
                                {socials.map(([k, url]) => {
                                    const [label, Glyph] = SOCIAL[k];
                                    return (
                                        <li key={k}>
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={label}
                                                className="grid size-11 place-items-center rounded-full border border-line text-ink-2 hover:border-teal-600/50 hover:text-teal-800"
                                            >
                                                <Glyph size={16} />
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </aside>
                <section aria-labelledby="contact-form" className="lg:col-span-7">
                    <h2 id="contact-form" className="text-h2">
                        {c.formTitle}
                    </h2>
                    <div className="mt-6">
                        <ContactForm waNumber={s.primaryWhatsapp?.number} labels={c.form} />
                    </div>
                </section>
            </Container>

            <section className="bg-mint">
                <Container className="py-12 lg:py-16">
                    <div className="relative h-96 overflow-hidden rounded-3xl bg-paper-2">
                        <iframe
                            title={dict.home.mapTitle}
                            src={s.map.embed}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0 size-full border-0 grayscale-35"
                        />
                    </div>
                    <Button href={s.map.directions} variant="ink" className="mt-6">
                        <Icon name="pin" size={17} />
                        {c.directions}
                    </Button>
                </Container>
            </section>
        </>
    );
}

function Row({ k, v }) {
    return (
        <div className="grid grid-cols-[8.5rem_1fr] gap-3 py-4">
            <dt className="text-sm text-ink-3">{k}</dt>
            <dd className="text-ink">{v}</dd>
        </div>
    );
}
