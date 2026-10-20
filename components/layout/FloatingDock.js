"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { t, digits } from "@/lib/i18n/t";
import { whatsappLink, formatPhone } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Bottom-right dock on every page: WhatsApp desk picker + FAQ quick answers
 * (fixed question → fixed answer, managed in admin later).
 */
export function FloatingDock({ settings, faqs, dict, lang }) {
    const [panel, setPanel] = useState(null); // "wa" | "faq" | null
    const [active, setActive] = useState(null);
    const d = dict.dock;
    const primary = settings.primaryWhatsapp;
    const close = () => setPanel(null);

    return (
        <>
            <div className="pointer-events-none fixed bottom-4 right-4 z-30 flex flex-col items-end gap-2.5 sm:bottom-6 sm:right-6 print:hidden *:pointer-events-auto">
                {faqs.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setPanel("faq")}
                        aria-haspopup="dialog"
                        className="group flex h-12 items-center gap-2 rounded-pill border border-line bg-card pl-3.5 pr-4 text-sm font-medium text-ink shadow-[0_10px_30px_-10px_rgb(7_38_41/0.45)] transition hover:border-teal-600/50"
                    >
                        <Icon name="chat" size={19} className="text-teal-700" />
                        <span className="hidden sm:inline">{d.faq}</span>
                        <span className="sr-only sm:hidden">{d.faq}</span>
                    </button>
                )}
                {primary && (
                    <button
                        type="button"
                        onClick={() => setPanel("wa")}
                        aria-haspopup="dialog"
                        aria-label={d.whatsapp}
                        className="relative grid size-14 place-items-center rounded-full border border-line bg-card text-wa shadow-[0_10px_30px_-10px_rgb(7_38_41/0.45)] transition hover:scale-[1.04]"
                    >
                        <WhatsAppMark size={28} />
                        <span
                            className="absolute -right-0.5 -top-0.5 size-3.5 rounded-full border-2 border-card bg-wa"
                            aria-hidden
                        />
                    </button>
                )}
            </div>

            <Dialog
                open={panel === "wa"}
                onClose={close}
                variant="bottom"
                labelledBy="dock-wa-title"
                closeLabel={dict.nav.close}
            >
                <div className="p-6">
                    <p className="flex items-center gap-2 text-sm font-medium text-wa">
                        <WhatsAppMark size={18} /> WhatsApp
                    </p>
                    <h2 id="dock-wa-title" className="mt-1 pr-10 text-h3">
                        {d.whatsappTitle}
                    </h2>
                    <ul className="mt-4 divide-y divide-line-soft border-y border-line-soft">
                        {settings.whatsappNumbers.map((w) => (
                            <li key={w._id || w.number}>
                                <a
                                    href={whatsappLink(w.number, dict.appointment.message)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-wa-tap={w._id}
                                    className="flex min-h-15 items-center justify-between gap-3 py-3 hover:text-teal-800"
                                >
                                    <span>
                                        <span className="block font-medium">
                                            {t(w.label, lang)}
                                        </span>
                                        <span className="text-sm text-ink-3 tabular-nums">
                                            {digits(formatPhone(w.number), lang)}
                                        </span>
                                    </span>
                                    <Icon name="arrowUpRight" size={18} className="text-ink-3" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </Dialog>

            <Dialog
                open={panel === "faq"}
                onClose={close}
                variant="bottom"
                labelledBy="dock-faq-title"
                closeLabel={dict.nav.close}
            >
                <div className="p-6">
                    <h2 id="dock-faq-title" className="pr-10 text-h3">
                        {d.faqTitle}
                    </h2>
                    <p className="mt-1 text-sm text-ink-2">{d.faqLead}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {faqs.map((f) => (
                            <li key={f._id}>
                                <button
                                    type="button"
                                    onClick={() => setActive(f._id)}
                                    aria-pressed={active === f._id}
                                    className={cn(
                                        "rounded-2xl border px-3.5 py-2 text-left text-sm transition-colors",
                                        active === f._id
                                            ? "border-teal-700 bg-teal-50 text-teal-900"
                                            : "border-line hover:border-ink/40",
                                    )}
                                >
                                    {t(f.question, lang)}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div aria-live="polite" className="min-h-4">
                        {faqs
                            .filter((f) => f._id === active)
                            .map((f) => (
                                <p
                                    key={f._id}
                                    className="mt-4 rounded-2xl rounded-tl-sm bg-paper p-4 text-[0.95rem] text-ink animate-[mh-rise_.35s_var(--ease-out-expo)]"
                                >
                                    {t(f.answer, lang)}
                                </p>
                            ))}
                    </div>
                    {primary && (
                        <a
                            href={whatsappLink(primary.number, dict.appointment.message)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-5 flex items-center gap-2 text-sm font-medium text-teal-700 link-underline"
                        >
                            <WhatsAppMark size={17} className="text-wa" />
                            {d.faqFallback}
                        </a>
                    )}
                </div>
            </Dialog>
        </>
    );
}
