import Link from "next/link";
import { Section } from "@/components/ui/Layout";
import { Icon } from "@/components/ui/Icon";
import { Emphasis } from "@/components/ui/Emphasis";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { Rail } from "./Rail";
import { LiteYouTube } from "./LiteYouTube";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";

export function Doctors({ doctors, settings, dict, lang }) {
    const h = dict.home;
    return (
        <Section
            tone="alt"
            number={digits("03", lang)}
            eyebrow={h.doctorsEyebrow}
            title={<Emphasis text={h.doctorsTitle} />}
            action={
                <Link
                    href={href(lang, "/doctors")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 link-underline"
                >
                    {h.doctorsAll}
                    <Icon name="arrow" size={16} />
                </Link>
            }
        >
            <Rail label={h.doctorsTitle.replace(/\*/g, "")} prevLabel={h.prev} nextLabel={h.next}>
                {doctors.map((d) => (
                    <li
                        key={d._id}
                        className="w-[78%] shrink-0 snap-start xs:w-68 lg:w-[calc((100%-3rem)/4)]"
                    >
                        <DoctorCard
                            doctor={d}
                            dict={dict}
                            lang={lang}
                            waNumber={settings.primaryWhatsapp?.number}
                        />
                    </li>
                ))}
            </Rail>
        </Section>
    );
}

export function Talks({ talks, stories = [], settings, dict, lang }) {
    const h = dict.home;
    // Patient stories are published only with written consent (proposal §3, §13).
    const quotes = stories.filter((st) => st.consent?.confirmed && t(st.quote, lang));
    if (!talks.length && !quotes.length) return null;
    const [first, ...rest] = talks;
    return (
        <Section
            number={digits("04", lang)}
            eyebrow={h.talksEyebrow}
            title={<Emphasis text={h.talksTitle} />}
            action={
                settings.socials?.youtube && (
                    <a
                        href={settings.socials.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 link-underline"
                    >
                        {h.talksChannel}
                        <Icon name="arrowUpRight" size={16} />
                    </a>
                )
            }
        >
            {first && (
                <div className="grid gap-8 lg:grid-cols-12">
                    <figure className="lg:col-span-7">
                        <LiteYouTube
                            id={first.youtubeId}
                            title={t(first.title, lang)}
                            playLabel={h.play}
                        />
                        <figcaption className="mt-4">
                            <p
                                lang={first.title?.bn ? "bn" : "en"}
                                className="font-display text-xl leading-snug"
                            >
                                {t(first.title, "bn")}
                            </p>
                            <p className="mt-1 text-sm text-ink-3">{t(first.speaker, lang)}</p>
                        </figcaption>
                    </figure>
                    <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
                        {rest.map((v) => (
                            <li
                                key={v._id}
                                className="grid gap-4 lg:grid-cols-[13rem_1fr] lg:items-start"
                            >
                                <LiteYouTube
                                    id={v.youtubeId}
                                    title={t(v.title, lang)}
                                    playLabel={h.play}
                                    size="sm"
                                    className="rounded-2xl"
                                />
                                <div>
                                    <p
                                        lang={v.title?.bn ? "bn" : "en"}
                                        className="font-display text-lg leading-snug"
                                    >
                                        {t(v.title, "bn")}
                                    </p>
                                    <p className="mt-1 text-sm text-ink-3">{t(v.speaker, lang)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {quotes.length > 0 && (
                <div className={first ? "mt-16 border-t border-line pt-10" : undefined}>
                    <h3 className="eyebrow">{h.storiesTitle}</h3>
                    <ul className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {quotes.map((st) => (
                            <li key={st._id}>
                                <figure>
                                    <blockquote className="font-display text-xl leading-snug text-ink [&:lang(bn)]:leading-relaxed">
                                        “{t(st.quote, lang)}”
                                    </blockquote>
                                    <figcaption className="mt-4 text-sm text-ink-3">
                                        {t(st.name, lang)}
                                        {st.context && ` · ${t(st.context, lang)}`}
                                    </figcaption>
                                </figure>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Section>
    );
}
