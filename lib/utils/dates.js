// Date helpers that accept both shapes the data layer can return:
//   static mock → "2026-10-20" (date-only)      API (Mongo Date → JSON) → "2026-10-20T00:00:00.000Z"
// Everything is interpreted in Asia/Dhaka, the hospital's calendar. Pure functions (client-safe).

const TZ = "Asia/Dhaka";
const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Any date-ish value → "YYYY-MM-DD" in Dhaka, or "" if invalid/missing. */
export function toDhakaDay(value) {
    if (!value) return "";
    if (typeof value === "string" && DAY.test(value)) return value;
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d); // en-CA = YYYY-MM-DD
}

/** Today in Dhaka as "YYYY-MM-DD". */
export const todayInDhaka = () => toDhakaDay(new Date());

/** Any date-ish value → Date at noon Dhaka of that calendar day (safe to format), or null. */
export function toDhakaDate(value) {
    const day = toDhakaDay(value);
    return day ? new Date(`${day}T12:00:00+06:00`) : null;
}

/** Localised long date ("21 October 2026" / "২১ অক্টোবর ২০২৬"); "" if invalid. */
export function formatDhakaDate(value, lang = "en") {
    const d = toDhakaDate(value);
    if (!d) return "";
    return new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: TZ,
    }).format(d);
}
