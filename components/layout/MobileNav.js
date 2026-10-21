"use client";

import Link from "next/link";
import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { LangSwitch } from "./LangSwitch";
import { href } from "@/lib/i18n/config";
import { digits } from "@/lib/i18n/t";
import { telHref, whatsappLink, formatPhone } from "@/lib/utils";

/** < xl: side sheet with <details> accordions (no extra JS for the accordion). */
export function MobileNav({ items, dict, settings, lang }) {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);
    const wa = settings.primaryWhatsapp;

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={dict.nav.menu}
                aria-haspopup="dialog"
                className="grid size-11 place-items-center rounded-full border border-line text-ink hover:border-ink/40 xl:hidden"
            >
                <Icon name="menu" size={22} />
            </button>

            <Dialog
                open={open}
                onClose={close}
                variant="right"
                labelledBy="mobile-nav-title"
                closeLabel={dict.nav.close}
            >
                <div data-track="mobile-menu" className="flex min-h-full flex-col">
                    <div className="flex items-center gap-4 border-b border-line-soft px-5 py-4 pr-16">
                        <h2
                            id="mobile-nav-title"
                            className="font-sans text-sm font-semibold uppercase tracking-[0.14em] [&:lang(bn)]:tracking-normal [&:lang(bn)]:text-[0.85rem] text-teal-700"
                        >
                            {dict.nav.menu}
                        </h2>
                        <LangSwitch tone="light" label={dict.topbar.language} />
                    </div>

                    <nav aria-label="Mobile" className="flex-1 px-5 py-2">
                        <ul>
                            {items.map((item) => {
                                const sub = item.mega
                                    ? [...item.mega.columns.flatMap((c) => c.items), item.mega.all]
                                    : item.menu;
                                if (!sub) {
                                    return (
                                        <li key={item.key} className="border-b border-line-soft">
                                            <Link
                                                href={item.href}
                                                onClick={close}
                                                className="flex min-h-14 items-center font-display text-xl"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    );
                                }
                                return (
                                    <li key={item.key} className="border-b border-line-soft">
                                        <details className="group">
                                            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between font-display text-xl [&::-webkit-details-marker]:hidden">
                                                {item.label}
                                                <Icon
                                                    name="chevron"
                                                    size={18}
                                                    className="text-ink-3 transition-transform group-open:rotate-180"
                                                />
                                            </summary>
                                            <ul className="pb-3">
                                                {sub.map((s) => (
                                                    <li key={s.href}>
                                                        <Link
                                                            href={s.href}
                                                            onClick={close}
                                                            className={
                                                                "flex min-h-11 items-center justify-between py-1.5 pl-3 text-[0.97rem] " +
                                                                (s.tone === "emergency"
                                                                    ? "text-emergency-ink"
                                                                    : "text-ink-2")
                                                            }
                                                        >
                                                            {s.label}
                                                            {s.badge && (
                                                                <span className="text-xs font-semibold text-teal-700">
                                                                    {s.badge}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="sticky bottom-0 grid gap-2 border-t border-line-soft bg-card p-5">
                        <Link
                            href={href(lang, "/appointment")}
                            onClick={close}
                            className={buttonClass({ size: "lg", className: "w-full" })}
                        >
                            <Icon name="calendar" size={18} />
                            {dict.nav.book}
                        </Link>
                        <div className="grid grid-cols-2 gap-2">
                            <a
                                href={telHref(settings.hotline)}
                                className={buttonClass({ variant: "outline", className: "w-full" })}
                            >
                                <Icon name="phone" size={17} />
                                <span className="tabular-nums">
                                    {digits(formatPhone(settings.hotline), lang)}
                                </span>
                            </a>
                            {wa && (
                                <a
                                    href={whatsappLink(wa.number, dict.appointment.message)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={buttonClass({
                                        variant: "whatsapp",
                                        className: "w-full",
                                    })}
                                >
                                    <WhatsAppMark size={18} className="wa" />
                                    WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
