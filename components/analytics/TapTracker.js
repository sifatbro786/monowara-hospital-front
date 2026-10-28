"use client";

import { useEffect } from "react";
import { PUBLIC_API_URL } from "@/lib/forms";

/**
 * One delegated listener for every WhatsApp (wa.me) and phone (tel:) link on the site.
 * Pushes a GA4-ready event into window.dataLayer (B4 adds GTM/GA4, which reads this queue) and
 * sends a beacon to mh-back POST /api/events/tap for the dashboard's tap board (Overview).
 * No personal data: only the desk/number tapped and the page section.
 *
 *   { event: "contact_tap", channel: "whatsapp" | "call", desk, number, section, page_path, lang }
 */

// Same browser API base as the public forms. Unset (static demo) → no beacon, dataLayer only.
const TAP_URL = PUBLIC_API_URL ? `${PUBLIC_API_URL}/events/tap` : null;

/** Beacon: text/plain = CORS "simple" request (no preflight); never blocks the navigation. */
function sendTap(payload) {
    if (!TAP_URL || typeof navigator.sendBeacon !== "function") return;
    try {
        navigator.sendBeacon(TAP_URL, new Blob([JSON.stringify(payload)], { type: "text/plain" }));
    } catch {
        /* analytics is best-effort */
    }
}

export function TapTracker({ lang }) {
    useEffect(() => {
        const onClick = (e) => {
            const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
            if (!a) return;
            const url = a.getAttribute("href") || "";
            const channel = url.startsWith("https://wa.me/")
                ? "whatsapp"
                : url.startsWith("tel:")
                  ? "call"
                  : null;
            if (!channel) return;

            const number =
                channel === "whatsapp"
                    ? url.slice("https://wa.me/".length).split("?")[0]
                    : url.slice(4).replace(/\D/g, "");
            // stable, non-localised names: data-track > nearest id > landmark tag
            const section =
                (
                    a.closest("[data-track]")?.getAttribute("data-track") ||
                    a.closest("[id]:not(main)")?.id ||
                    a.closest("header, footer, nav, dialog")?.tagName.toLowerCase() ||
                    "main"
                )
                    .replace(/[^\w.-]+/g, "-")
                    .slice(0, 40) || "main";
            const desk = a.getAttribute("data-wa-tap") || undefined;

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: "contact_tap",
                channel,
                desk,
                number,
                section,
                page_path: window.location.pathname,
                lang,
            });
            if (/^\d{5,15}$/.test(number))
                sendTap({ channel, desk: /^[\w.-]{1,40}$/.test(desk ?? "") ? desk : undefined, number, section });
        };
        // capture phase: runs even if a component stops propagation; never blocks navigation
        document.addEventListener("click", onClick, { capture: true, passive: true });
        return () => document.removeEventListener("click", onClick, { capture: true });
    }, [lang]);

    return null;
}
