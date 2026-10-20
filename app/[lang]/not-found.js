import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { Container } from "@/components/ui/Layout";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Keystone } from "@/components/ui/Ornaments";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { hasLocale, href } from "@/lib/i18n/config";
import { digits } from "@/lib/i18n/t";
import { telHref, formatPhone } from "@/lib/utils";

export default async function NotFound() {
    let lang = "en";
    try {
        const l = await rootLang();
        if (hasLocale(l)) lang = l;
    } catch {}
    const [dict, settings] = await Promise.all([getDictionary(lang), getSettings()]);
    const c = dict.common;
    const nf = dict.notFound;

    const links = [
        { label: dict.nav.findDoctor, path: "/doctors", icon: "search" },
        { label: dict.nav.departments, path: "/departments", icon: "clipboard" },
        { label: dict.nav.packages, path: "/packages", icon: "calendar" },
        { label: dict.nav.contact, path: "/contact", icon: "pin" },
    ];

    return (
        <Container className="grid items-center gap-14 py-16 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-7">
                <p className="eyebrow">{nf.eyebrow}</p>
                <h1 className="mt-5 max-w-xl text-h1">{c.notFoundTitle}</h1>
                <p className="mt-5 max-w-lg text-lg text-ink-2">{c.notFoundLead}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Button href={href(lang, "/")} size="lg">
                        <Icon name="arrow" size={18} className="rotate-180" />
                        {c.backHome}
                    </Button>
                    <Button href={href(lang, "/appointment")} variant="outline" size="lg">
                        <Icon name="calendar" size={18} />
                        {dict.nav.book}
                    </Button>
                </div>

                <p className="mt-12 text-sm font-semibold text-ink">{nf.helpTitle}</p>
                <ul className="mt-3 grid border-t border-line sm:grid-cols-2">
                    {links.map((l) => (
                        <li
                            key={l.path}
                            className="border-b border-line sm:odd:border-r sm:odd:pr-6 sm:even:pl-6"
                        >
                            <Link
                                href={href(lang, l.path)}
                                className="group flex min-h-14 items-center gap-3 py-3 text-ink hover:text-teal-800"
                            >
                                <Icon name={l.icon} size={18} className="text-teal-700" />
                                <span className="flex-1">{l.label}</span>
                                <Icon
                                    name="arrow"
                                    size={16}
                                    className="text-ink-3 transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                        </li>
                    ))}
                </ul>

                <a
                    href={telHref(settings.emergency)}
                    className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-emergency-soft px-4 py-3 text-emergency-ink"
                >
                    <Icon name="pulse" size={20} />
                    <span className="text-sm">
                        {nf.emergencyLine}:{" "}
                        <span className="font-semibold tabular-nums">
                            {digits(formatPhone(settings.emergency), lang)}
                        </span>
                    </span>
                </a>
            </div>

            {/* The logo's doorway with a flat-lined pulse — "this page isn't here" */}
            <div aria-hidden className="relative mx-auto w-full max-w-sm lg:col-span-5">
                <Keystone className="absolute -top-5 left-1/2 z-10 w-24 -translate-x-1/2" />
                <div className="relative aspect-4/5 overflow-hidden rounded-t-full border border-line bg-card">
                    <span className="absolute inset-x-0 top-[34%] text-center font-display text-[clamp(5rem,12vw,8rem)] leading-none text-teal-700/90">
                        {digits("404", lang)}
                    </span>
                    <svg
                        viewBox="0 0 300 80"
                        className="absolute inset-x-0 bottom-[22%] w-full text-teal-500"
                        fill="none"
                    >
                        <path
                            d="M0 40h96l8-18 10 36 10-26 6 8h170"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="absolute inset-x-0 bottom-0 h-[14%] border-t border-line bg-paper-2" />
                </div>
            </div>
        </Container>
    );
}
