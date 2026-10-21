"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Container } from "@/components/ui/Layout";
import { buttonClass } from "@/components/ui/Button";
import { href, hasLocale } from "@/lib/i18n/config";
import { errorCopy } from "@/lib/i18n/errorCopy";

// Segment error boundary. The [lang] layout (top bar with the emergency number, header, footer,
// WhatsApp dock) still renders around this, so patients always have a way to reach the desk.
export default function Error({ error, retry }) {
    const params = useParams();
    const lang = hasLocale(params?.lang) ? params.lang : "en";
    const c = errorCopy[lang];
    const digest = error instanceof Error ? error.digest : undefined;

    useEffect(() => {
        // B4: forward to the error reporter (digest matches the server log line).
        console.error(error);
    }, [error]);

    return (
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-7">
                <p className="eyebrow">{c.eyebrow}</p>
                <h1 className="mt-5 max-w-xl text-h1">{c.title}</h1>
                <p className="mt-5 max-w-lg text-lg text-ink-2">{c.lead}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => retry()}
                        className={buttonClass({ variant: "ink", size: "lg" })}
                    >
                        {c.retry}
                    </button>
                    <Link
                        href={href(lang, "/")}
                        className={buttonClass({ variant: "outline", size: "lg" })}
                    >
                        {c.home}
                    </Link>
                </div>
                {digest && (
                    <p className="mt-10 text-xs text-ink-3">
                        {c.ref}: <span className="font-mono">{digest}</span>
                    </p>
                )}
            </div>

            {/* A pulse line that stutters — the same ECG motif as the loader and 404, calm, no bounce */}
            <div aria-hidden className="mx-auto w-full max-w-sm lg:col-span-5">
                <div className="rounded-[1.75rem] border border-line bg-card px-6 py-14">
                    <svg viewBox="0 0 300 80" className="w-full text-teal-500" fill="none">
                        <path
                            d="M0 40h70l8-18 10 36 10-26 6 8h40l6-4 4 4h146"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle cx="150" cy="40" r="4" className="fill-emergency" />
                    </svg>
                </div>
            </div>
        </Container>
    );
}
