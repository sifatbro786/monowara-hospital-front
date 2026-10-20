import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa6";
import { Container } from "@/components/ui/Layout";
import { Icon } from "@/components/ui/Icon";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { telHref, formatPhone } from "@/lib/utils";

const SOCIALS = {
    facebook: { label: "Facebook", Icon: FaFacebookF },
    instagram: { label: "Instagram", Icon: FaInstagram },
    youtube: { label: "YouTube", Icon: FaYoutube },
    linkedin: { label: "LinkedIn", Icon: FaLinkedinIn },
};

const AGENCY = { name: "STR Solutions LTD.", url: "https://strsltd.com/" };

export function Footer({ settings, dict, lang }) {
    const f = dict.footer;
    const n = dict.nav;
    const L = (p) => href(lang, p);
    const show = (num) => digits(formatPhone(num), lang);
    const year = digits(2026, lang);

    const cols = [
        {
            title: f.patients,
            links: [
                [n.findDoctor, "/doctors"],
                [n.book, "/appointment"],
                [n.packages, "/packages"],
                [n.diagnostics, "/diagnostics"],
                [n.visiting, "/patients-visitors#visiting-hours"],
                [n.emergency, "/emergency"],
            ],
        },
        {
            title: f.hospital,
            links: [
                [n.aboutHospital, "/about"],
                [n.departments, "/departments"],
                [n.bhrpc, "/bhrpc"],
                [n.aesthetic, "/mh-aesthetic"],
                [n.healthTips, "/health-tips"],
                [n.careers, "/careers"],
            ],
        },
    ];

    const socials = Object.entries(settings.socials || {}).filter(([k, url]) => url && SOCIALS[k]);
    const colTitle = "text-xs font-semibold uppercase tracking-[0.14em] text-teal-300 [&:lang(bn)]:normal-case [&:lang(bn)]:tracking-normal [&:lang(bn)]:text-[0.85rem]";

    return (
        <footer className="bg-ink text-paper">
            <Container className="pt-16 lg:pt-20">
                <div className="grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <p className="font-display text-2xl">{t(settings.legalName, lang)}</p>
                        <p className="mt-4 max-w-sm text-[0.95rem] text-paper/70">{f.about}</p>
                        <p className="mt-6 flex items-start gap-2 text-sm text-paper/80">
                            <Icon name="pin" size={17} className="mt-0.5 shrink-0 text-teal-300" />
                            {t(settings.address, lang)}
                        </p>
                        {settings.dghsLicence && (
                            <p className="mt-2 text-sm text-paper/60">
                                {f.licence} {digits(settings.dghsLicence, lang)}
                            </p>
                        )}
                        {socials.length > 0 && (
                            <ul className="mt-7 flex gap-2.5" aria-label={f.follow}>
                                {socials.map(([key, url]) => {
                                    const { label, Icon: SocialIcon } = SOCIALS[key];
                                    return (
                                        <li key={key}>
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={label}
                                                title={label}
                                                className="grid size-11 place-items-center rounded-full border border-paper/20 text-paper/80 transition-colors hover:border-teal-300 hover:bg-teal-300 hover:text-ink"
                                            >
                                                <SocialIcon size={17} aria-hidden />
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    {cols.map((c) => (
                        <div key={c.title} className="lg:col-span-2">
                            <p className={colTitle}>{c.title}</p>
                            <ul className="mt-4 space-y-2.5">
                                {c.links.map(([label, p]) => (
                                    <li key={p}>
                                        <Link href={L(p)} className="text-[0.95rem] text-paper/80 hover:text-paper link-underline">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div className="lg:col-span-4">
                        <p className={colTitle}>{f.contact}</p>
                        <a href={telHref(settings.hotline)} className="mt-4 block font-display text-[2rem] leading-tight tabular-nums hover:text-teal-200">
                            {show(settings.hotline)}
                        </a>
                        <p className="mt-1 text-sm text-paper/60">{f.open247}</p>
                        <ul className="mt-5 grid gap-1.5 text-[0.95rem] text-paper/80">
                            <li>
                                <span className="text-[#ff8a7a]">{n.emergency}:</span>{" "}
                                <a href={telHref(settings.emergency)} className="tabular-nums hover:text-paper">
                                    {show(settings.emergency)}
                                </a>
                            </li>
                            {settings.phones.map((p) => (
                                <li key={p.number}>
                                    <a href={telHref(p.number)} className="tabular-nums hover:text-paper">
                                        {show(p.number)}
                                    </a>
                                </li>
                            ))}
                            {settings.email && (
                                <li>
                                    <a href={`mailto:${settings.email}`} className="hover:text-paper link-underline">
                                        {settings.email}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bangla wordmark as a graphic: an SVG scaled to the container, so it is
                    always fully visible at any width (never wider than the page). */}
                <svg viewBox="0 0 1000 150" className="mt-16 block h-auto w-full select-none text-paper/6" aria-hidden>
                    <text
                        x="500"
                        y="118"
                        textAnchor="middle"
                        textLength="990"
                        lengthAdjust="spacingAndGlyphs"
                        fill="currentColor"
                        style={{ fontFamily: "var(--font-bn-display)", fontSize: 150 }}
                    >
                        মনোয়ারা হসপিটাল
                    </text>
                </svg>

                <div className="flex flex-col gap-3 border-t border-paper/15 pb-24 pt-6 text-sm md:pr-24 md:pb-6 text-paper/55 md:flex-row md:items-center md:justify-between">
                    <p>
                        © {year} {t(settings.legalName, lang)} {f.rights}
                        <span className="mx-2 text-paper/25" aria-hidden>
                            ·
                        </span>
                        <span className="whitespace-nowrap">
                            {dict.footer2.websiteBy}{" "}
                            <a href={AGENCY.url} target="_blank" rel="noopener" className="font-medium text-paper/80 hover:text-teal-200 link-underline">
                                {AGENCY.name}
                            </a>
                        </span>
                    </p>
                    <ul className="flex flex-wrap gap-x-5 gap-y-1">
                        <li>
                            <Link href={L("/legal/privacy-policy")} className="hover:text-paper">
                                {f.privacy}
                            </Link>
                        </li>
                        <li>
                            <Link href={L("/legal/patient-rights")} className="hover:text-paper">
                                {f.patientRights}
                            </Link>
                        </li>
                        <li>
                            <Link href={L("/legal/terms")} className="hover:text-paper">
                                {f.terms}
                            </Link>
                        </li>
                    </ul>
                </div>
            </Container>
        </footer>
    );
}
