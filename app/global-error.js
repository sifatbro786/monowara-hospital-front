"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { errorCopy, FALLBACK_HOTLINE, FALLBACK_EMERGENCY } from "@/lib/i18n/errorCopy";
import { telHref, formatPhone } from "@/lib/utils";

// Last-resort boundary: replaces the root layout when it fails (settings/API down, etc.).
// Own <html>/<body>, no data fetching, bilingual (the URL tells us the language), and the
// hotline + emergency numbers come from env fallbacks so a patient can always call.
export default function GlobalError({ error, retry }) {
    const pathname = usePathname() || "/";
    const isBn = pathname === "/bn" || pathname.startsWith("/bn/");
    const lang = isBn ? "bn" : "en";
    const c = errorCopy[lang];

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang={lang} className={fontVariables}>
            <body className="min-h-dvh bg-paper text-ink antialiased">
                <title>{c.title}</title>
                <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-5 py-16">
                    {/* Plain <img>: this page must not depend on the image optimizer being up */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="Monowara Hospital" width={225} height={48} />
                    <p className="eyebrow mt-12">{c.eyebrow}</p>
                    <h1 className="mt-4 text-h1">{c.title}</h1>
                    <p className="mt-4 text-lg text-ink-2">{c.lead}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => retry()}
                            className="inline-flex h-13 items-center rounded-pill bg-ink px-6 text-paper hover:bg-teal-900"
                        >
                            {c.retry}
                        </button>
                        <a
                            href={isBn ? "/bn" : "/"}
                            className="inline-flex h-13 items-center rounded-pill border border-ink/20 px-6 hover:border-ink/60"
                        >
                            {c.home}
                        </a>
                    </div>
                    <div className="mt-10 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
                        <a
                            href={telHref(FALLBACK_HOTLINE)}
                            className="rounded-2xl border border-line bg-card px-4 py-3"
                        >
                            <span className="block text-xs text-ink-3">{c.call}</span>
                            <span className="font-semibold tabular-nums">
                                {formatPhone(FALLBACK_HOTLINE)}
                            </span>
                        </a>
                        <a
                            href={telHref(FALLBACK_EMERGENCY)}
                            className="rounded-2xl bg-emergency-soft px-4 py-3 text-emergency-ink"
                        >
                            <span className="block text-xs">{c.emergency} · 24/7</span>
                            <span className="font-semibold tabular-nums">
                                {formatPhone(FALLBACK_EMERGENCY)}
                            </span>
                        </a>
                    </div>
                </main>
            </body>
        </html>
    );
}
