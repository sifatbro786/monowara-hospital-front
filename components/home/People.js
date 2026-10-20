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

export function Talks({ talks, settings, dict, lang }) {
    const h = dict.home;
    if (!talks.length) return null;
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
            <div className="grid gap-8 lg:grid-cols-12">
                <figure className="lg:col-span-7">
                    <LiteYouTube
                        id={first.youtubeId}
                        title={t(first.title, lang)}
                        playLabel={h.play}
                    />
                    <figcaption className="mt-4">
                        <p lang="bn" className="font-display text-xl leading-snug">
                            {first.title.bn}
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
                                <p lang="bn" className="font-display text-lg leading-snug">
                                    {v.title.bn}
                                </p>
                                <p className="mt-1 text-sm text-ink-3">{t(v.speaker, lang)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Section>
    );
}
