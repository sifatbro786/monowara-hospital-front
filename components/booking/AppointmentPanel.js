import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { t, digits } from "@/lib/i18n/t";
import { telHref, whatsappLink, formatPhone } from "@/lib/utils";

const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

/**
 * Hook-free so it renders on the server (static shell) and inside the client
 * AppointmentFromQuery wrapper. `context` = doctor / package name for the
 * prefilled WhatsApp message.
 */
export function AppointmentPanel({
    settings,
    dict,
    lang,
    context,
    kind = "doctor",
    headingId = "appt-title",
    as: Heading = "h2",
}) {
    const a = dict.appointment;
    const message = context
        ? fill(kind === "package" ? a.messagePackage : a.messageWith, { name: context })
        : a.message;
    const show = (n) => digits(formatPhone(n), lang);

    return (
        <div className="p-6 pt-7 sm:p-8">
            <p className="eyebrow">{dict.meta.siteName}</p>
            <Heading id={headingId} className="mt-2 pr-10 text-h3 sm:text-[1.8rem]">
                {a.title}
            </Heading>
            {context && (
                <p className="mt-3 inline-flex max-w-full items-center gap-2 rounded-pill bg-teal-50 px-3 py-1 text-sm text-teal-800">
                    <span className="text-teal-700/80">{a.for}:</span>
                    <span className="truncate font-medium">{context}</span>
                </p>
            )}
            <p className="mt-3 text-[0.95rem] text-ink-2">{a.lead}</p>

            {/* Hotline */}
            <a
                href={telHref(settings.hotline)}
                className="group mt-6 flex items-center justify-between gap-4 rounded-[1.1rem] bg-ink px-5 py-4 text-paper transition-colors hover:bg-teal-900"
            >
                <span>
                    <span className="block text-xs uppercase tracking-[0.14em] [&:lang(bn)]:tracking-normal [&:lang(bn)]:text-[0.85rem] text-teal-200">
                        {a.hotline}
                    </span>
                    <span className="mt-0.5 block font-display text-[1.65rem] leading-tight tabular-nums">
                        {show(settings.hotline)}
                    </span>
                </span>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-500 text-white transition-transform group-hover:scale-105">
                    <Icon name="phone" size={22} />
                </span>
            </a>

            {/* WhatsApp desks */}
            {settings.whatsappNumbers.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-sans text-sm font-semibold text-ink">{a.whatsappTitle}</h3>
                    <ul className="mt-2 divide-y divide-line-soft border-y border-line-soft">
                        {settings.whatsappNumbers.map((w) => (
                            <li key={w._id || w.number}>
                                <a
                                    href={whatsappLink(w.number, message)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-wa-tap={w._id}
                                    className="flex min-h-14 items-center justify-between gap-3 py-3 hover:text-teal-800"
                                >
                                    <span className="min-w-0">
                                        <span className="block truncate font-medium">
                                            {t(w.label, lang)}
                                        </span>
                                        <span className="block text-sm text-ink-3 tabular-nums">
                                            {show(w.number)}
                                        </span>
                                    </span>
                                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-pill border border-line bg-card px-3 py-1.5 text-sm font-medium">
                                        <WhatsAppMark size={18} className="text-wa" />
                                        WhatsApp
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Other numbers */}
            {settings.phones.length > 0 && (
                <div className="mt-5">
                    <h3 className="font-sans text-sm font-semibold text-ink">{a.phonesTitle}</h3>
                    <ul className="mt-2 flex flex-wrap gap-2">
                        {settings.phones.map((p) => (
                            <li key={p.number}>
                                <a
                                    href={telHref(p.number)}
                                    className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-line px-3.5 text-sm tabular-nums hover:border-ink/40"
                                >
                                    <Icon name="phone" size={16} className="text-teal-700" />
                                    {show(p.number)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <p className="mt-6 flex gap-3 rounded-xl bg-emergency-soft p-3.5 text-sm text-emergency-ink">
                <Icon name="pulse" size={18} className="mt-0.5 shrink-0" />
                <span>
                    {a.emergencyNote}{" "}
                    <a
                        href={telHref(settings.emergency)}
                        className="font-semibold underline underline-offset-2 tabular-nums"
                    >
                        {show(settings.emergency)}
                    </a>
                </span>
            </p>
            <p className="mt-4 flex items-center gap-2 text-xs text-ink-3">
                <Icon name="clock" size={14} />
                {a.hours}
            </p>
        </div>
    );
}
