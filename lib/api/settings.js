import { cacheLife, cacheTag } from "next/cache";
import { isStatic, apiGet, clone, byOrder } from "./client";

/** GET /settings — singleton. Admin save → revalidateTag("settings") (phase B3). */
export async function getSettings() {
    "use cache";
    cacheTag("settings");
    cacheLife("hours");

    const doc = isStatic
        ? clone((await import("@/data/settings")).settings)
        : await apiGet("/settings");
    return normaliseSettings(doc);
}

const L = (v) => ({ en: v?.en || "", bn: v?.bn || "" });

/**
 * The admin can leave optional fields empty (or the API can omit them): fill every nested object
 * pages read without `?.`, so a blank field never crashes the layout. Map links fall back to a
 * search for the hospital's name + address.
 */
function normaliseSettings(raw) {
    const s = raw || {};
    const address = L(s.address);
    const place = encodeURIComponent(
        `${s.legalName?.en || "Monowara Hospital"} ${address.en}`.trim(),
    );
    return withLists({
        ...s,
        siteName: L(s.siteName),
        legalName: L(s.legalName),
        address,
        hours: { emergency: L(s.hours?.emergency), opd: L(s.hours?.opd) },
        socials: { ...(s.socials || {}) },
        map: {
            embed: s.map?.embed || `https://maps.google.com/maps?q=${place}&output=embed`,
            directions:
                s.map?.directions || `https://www.google.com/maps/dir/?api=1&destination=${place}`,
        },
        noticeBar: s.noticeBar
            ? { ...s.noticeBar, text: L(s.noticeBar.text) }
            : { isActive: false, text: L(), href: null },
        heroSlider: { intervalSec: clampInterval(s.heroSlider?.intervalSec) },
        bookingMode: ["numbers", "form", "both"].includes(s.bookingMode)
            ? s.bookingMode
            : "numbers",
    });
}

/** Seconds per hero slide; bad / missing admin input → 5, kept within 2–15. */
function clampInterval(v) {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.min(15, Math.max(2, n)) : 5;
}

function withLists(s) {
    const whatsappNumbers = (s.whatsappNumbers || [])
        .filter((n) => n.isActive !== false)
        .sort(byOrder);
    const primary = whatsappNumbers.find((n) => n.isPrimary) || whatsappNumbers[0] || null;
    return {
        ...s,
        whatsappNumbers,
        primaryWhatsapp: primary,
        phones: (s.phones || []).filter((p) => p.isActive !== false).sort(byOrder),
    };
}
