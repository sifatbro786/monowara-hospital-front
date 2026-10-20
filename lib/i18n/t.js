import { defaultLocale } from "./config";

/**
 * Read a translatable field `{ en, bn }` for a locale, falling back to EN.
 * Plain strings pass through, so non-translated fields are safe to call too.
 */
export function t(field, lang = defaultLocale) {
    if (field == null) return "";
    if (typeof field !== "object") return String(field);
    return field[lang] || field[defaultLocale] || "";
}

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Localise digits for display only (never for tel:/wa.me links). */
export function digits(value, lang = defaultLocale) {
    const s = String(value ?? "");
    return lang === "bn" ? s.replace(/[0-9]/g, (d) => BN_DIGITS[d]) : s;
}
