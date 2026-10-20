import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { href } from "@/lib/i18n/config";
import { t, digits } from "@/lib/i18n/t";
import { telHref, whatsappLink, formatPhone, cn } from "@/lib/utils";

/**
 * Card overlapping the hero: quick doctor search (plain GET form → /doctors?department=&q=,
 * the same params the API will take — works without JS) + four one-tap actions.
 * "Test reports" from the concept is out of scope → Emergency.
 */
export function QuickPanel({ departments, settings, dict, lang }) {
    const s = dict.home.search;
    const q = dict.home.quick;
    const wa = settings.primaryWhatsapp;

    const actions = [
        {
            key: "book",
            title: dict.cta.book,
            sub: q.bookSub,
            href: href(lang, "/appointment"),
            icon: <Icon name="calendar" size={20} />,
        },
        {
            key: "packages",
            title: dict.nav.packages,
            sub: q.packagesSub,
            href: href(lang, "/packages"),
            icon: <Icon name="clipboard" size={20} />,
        },
        {
            key: "emergency",
            title: dict.nav.emergency,
            sub: digits(formatPhone(settings.emergency), lang),
            href: telHref(settings.emergency),
            icon: <Icon name="pulse" size={20} />,
            tone: "emergency",
        },
        wa && {
            key: "wa",
            title: dict.cta.whatsapp,
            sub: q.whatsappSub,
            href: whatsappLink(wa.number, dict.appointment.message),
            icon: <WhatsAppMark size={20} />,
            tone: "wa",
            external: true,
        },
    ].filter(Boolean);

    const field =
        "h-12 w-full rounded-xl border border-line bg-paper/60 px-4 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-teal-600 focus:bg-card";

    return (
        <Container className="relative z-10 -mt-32 sm:-mt-36">
            <div className="rounded-[1.75rem] border border-line bg-card p-4 shadow-[0_30px_70px_-35px_rgb(7_38_41/0.45)] sm:p-6 lg:p-7">
                <form
                    action={href(lang, "/doctors")}
                    method="get"
                    role="search"
                    aria-label={s.label}
                    className="grid gap-3 md:grid-cols-[1fr_1.3fr_auto] md:items-end"
                >
                    <label className="grid gap-1.5">
                        <span className="text-xs font-medium text-ink-2">{s.department}</span>
                        <span className="relative">
                            <select
                                name="department"
                                defaultValue=""
                                className={cn(field, "appearance-none pr-10")}
                            >
                                <option value="">{s.allDepartments}</option>
                                {departments.map((d) => (
                                    <option key={d._id} value={d.slug}>
                                        {t(d.name, lang)}
                                    </option>
                                ))}
                            </select>
                            <Icon
                                name="chevron"
                                size={16}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-3"
                            />
                        </span>
                    </label>
                    <label className="grid gap-1.5">
                        <span className="text-xs font-medium text-ink-2">{s.name}</span>
                        <input
                            type="search"
                            name="q"
                            placeholder={s.placeholder}
                            autoComplete="off"
                            className={field}
                        />
                    </label>
                    <button
                        type="submit"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-ink px-6 text-[0.95rem] font-medium text-paper transition-colors hover:bg-teal-900"
                    >
                        <Icon name="search" size={18} />
                        {s.submit}
                    </button>
                </form>

                <ul className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                    {actions.map((a) => {
                        const inner = (
                            <>
                                <span
                                    className={cn(
                                        "grid size-11 shrink-0 place-items-center rounded-full",
                                        a.tone === "emergency"
                                            ? "bg-emergency-soft text-emergency"
                                            : a.tone === "wa"
                                              ? "bg-[#e7f7ee] text-wa"
                                              : "bg-teal-50 text-teal-700",
                                    )}
                                >
                                    {a.icon}
                                </span>
                                <span className="min-w-0">
                                    <span
                                        className={cn(
                                            "block text-[0.95rem] font-semibold leading-snug sm:truncate",
                                            a.tone === "emergency"
                                                ? "text-emergency-ink"
                                                : "text-ink",
                                        )}
                                    >
                                        {a.title}
                                    </span>
                                    <span className="mt-0.5 block text-xs text-ink-3 tabular-nums sm:truncate">
                                        {a.sub}
                                    </span>
                                </span>
                            </>
                        );
                        const cls =
                            "flex h-full flex-col items-start gap-2.5 rounded-2xl sm:flex-row sm:items-center sm:gap-3 border border-line-soft bg-paper/50 p-3 transition-colors hover:border-line hover:bg-paper sm:p-3.5";
                        return (
                            <li key={a.key}>
                                {a.href.startsWith("/") ? (
                                    <Link href={a.href} className={cls}>
                                        {inner}
                                    </Link>
                                ) : (
                                    <a
                                        href={a.href}
                                        className={cls}
                                        {...(a.external
                                            ? { target: "_blank", rel: "noopener noreferrer" }
                                            : {})}
                                    >
                                        {inner}
                                    </a>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </Container>
    );
}
