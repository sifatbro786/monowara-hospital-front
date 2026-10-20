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

function normaliseSettings(s) {
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
