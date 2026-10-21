"use client";

import { useEffect } from "react";

/**
 * One delegated listener for every WhatsApp (wa.me) and phone (tel:) link on the site.
 * Pushes a GA4-ready event into window.dataLayer — no analytics script is loaded yet;
 * B4 adds GTM/GA4, which reads this queue (and B3 can also POST it to /api/v1/taps for
 * the admin "WhatsApp tap analytics" board). No personal data: only the desk/number tapped,
 * the page and the page section.
 *
 *   { event: "contact_tap", channel: "whatsapp" | "call", desk, number, section, page_path, lang }
 */
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
                a.closest("[data-track]")?.getAttribute("data-track") ||
                a.closest("[id]:not(main)")?.id ||
                a.closest("header, footer, nav, dialog")?.tagName.toLowerCase() ||
                "main";

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: "contact_tap",
                channel,
                desk: a.getAttribute("data-wa-tap") || undefined,
                number,
                section,
                page_path: window.location.pathname,
                lang,
            });
        };
        // capture phase: runs even if a component stops propagation; never blocks navigation
        document.addEventListener("click", onClick, { capture: true, passive: true });
        return () => document.removeEventListener("click", onClick, { capture: true });
    }, [lang]);

    return null;
}
