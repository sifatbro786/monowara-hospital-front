"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { href } from "@/lib/i18n/config";

/**
 * Appointment triggers → the /appointment page (no modal).
 * Any element with [data-appt] (optional data-appt-context="Dr X" / package name)
 * navigates to /appointment?for=<context>, so Server Components can stay server-only
 * and the booking page can prefill the WhatsApp message.
 */
export function AppointmentProvider({ lang, children }) {
    const router = useRouter();

    useEffect(() => {
        function onClick(e) {
            if (
                e.defaultPrevented ||
                e.button !== 0 ||
                e.metaKey ||
                e.ctrlKey ||
                e.shiftKey ||
                e.altKey
            )
                return;
            const el = e.target.closest?.("[data-appt]");
            if (!el) return;
            e.preventDefault();
            const qs = new URLSearchParams();
            const ctx = el.getAttribute("data-appt-context");
            const kind = el.getAttribute("data-appt-kind"); // "package" → price-enquiry message
            if (ctx) qs.set("for", ctx);
            if (kind) qs.set("kind", kind);
            router.push(href(lang, "/appointment") + (qs.size ? `?${qs}` : ""));
        }
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, [router, lang]);

    return children;
}
