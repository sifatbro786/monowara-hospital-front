import { Container } from "@/components/ui/Layout";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { t, digits } from "@/lib/i18n/t";
import { telHref, whatsappLink, formatPhone, cn } from "@/lib/utils";

/** First paragraph as a serif lede, the rest as body copy. Text split on blank lines. */
export function Prose({ text, className }) {
    const paras = (text || "").split(/\n{2,}/).filter(Boolean);
    if (!paras.length) return null;
    return (
        <div className={cn("space-y-5", className)}>
            <p className="font-display text-[1.45rem] leading-[1.45] text-ink sm:text-[1.6rem]">
                {paras[0]}
            </p>
            {paras.slice(1).map((p, i) => (
                <p key={i} className="text-lg leading-relaxed text-ink-2">
                    {p}
                </p>
            ))}
        </div>
    );
}

/** Hairline list inside a card — conditions, facility features, tests. */
export function ListCard({ title, items, lang, className }) {
    if (!items?.length) return null;
    return (
        <div className={cn("rounded-3xl border border-line bg-card p-6 sm:p-8", className)}>
            <h2 className="text-h3">{title}</h2>
            <ul className="mt-5 divide-y divide-line">
                {items.map((x, i) => (
                    <li key={i} className="flex gap-3 py-3 text-ink-2">
                        <span
                            className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal-500"
                            aria-hidden
                        />
                        {t(x, lang)}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** Numbered two-column service list with hairlines (no icon cards). */
export function NumberedList({ title, items, lang, id }) {
    if (!items?.length) return null;
    return (
        <section aria-labelledby={id} className="bg-paper-2 py-14 lg:py-20">
            <Container>
                <h2 id={id} className="text-h2">
                    {title}
                </h2>
                <ol className="mt-10 grid border-t border-ink/10 sm:grid-cols-2 sm:gap-x-12">
                    {items.map((x, i) => (
                        <li
                            key={i}
                            className="flex items-baseline gap-5 border-b border-ink/10 py-5"
                        >
                            <span className="w-7 shrink-0 font-display text-sm italic tabular-nums text-teal-700">
                                {digits(String(i + 1).padStart(2, "0"), lang)}
                            </span>
                            <span className="text-[1.05rem] text-ink">{t(x, lang)}</span>
                        </li>
                    ))}
                </ol>
            </Container>
        </section>
    );
}

/** "Your visit" — three steps + hotline/WhatsApp. Copy from dict.visit. */
export function VisitSteps({ settings, dict, lang, context }) {
    const v = dict.visit;
    const wa = settings.primaryWhatsapp;
    const msg = context
        ? dict.appointment.messageWith.replace("{name}", context)
        : dict.appointment.message;
    return (
        <section aria-labelledby="visit-steps" className="bg-teal-950 py-14 text-paper lg:py-20">
            <Container>
                <div className="grid gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <p className="eyebrow text-teal-300">{v.eyebrow}</p>
                        <h2 id="visit-steps" className="mt-4 text-h2 text-paper">
                            {v.title}
                        </h2>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button href={telHref(settings.hotline)} variant="onTeal">
                                <Icon name="phone" size={17} />
                                <span className="tabular-nums">
                                    {digits(formatPhone(settings.hotline), lang)}
                                </span>
                            </Button>
                            {wa && (
                                <Button href={whatsappLink(wa.number, msg)} variant="light">
                                    <WhatsAppMark size={18} className="text-wa" />
                                    WhatsApp
                                </Button>
                            )}
                        </div>
                    </div>
                    <ol className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
                        {v.steps.map((s, i) => (
                            <li key={i} className="border-t border-paper/20 pt-5">
                                <span className="font-display text-3xl italic text-teal-300 tabular-nums">
                                    {digits(i + 1, lang)}
                                </span>
                                <h3 className="mt-3 text-[1.2rem] text-paper">{s.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-paper/70">
                                    {s.body}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            </Container>
        </section>
    );
}
