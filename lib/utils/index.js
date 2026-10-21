/** Tiny className joiner (no dependency). Falsy values are dropped. */
export function cn(...parts) {
    return parts.flat(Infinity).filter(Boolean).join(" ");
}

/** Normalise a Bangladeshi number to E.164 digits without "+" (8801XXXXXXXXX / 8809611XXXXXX). */
export function toIntl(number = "") {
    let d = String(number).replace(/\D/g, "");
    if (d.startsWith("880")) return d;
    if (d.startsWith("0")) d = d.slice(1);
    return `880${d}`;
}

export function telHref(number) {
    return `tel:+${toIntl(number)}`;
}

/** wa.me deep link with an optional prefilled message. */
export function whatsappLink(number, message) {
    const base = `https://wa.me/${toIntl(number)}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** "01789446240" -> "01789-446240", "09611622333" -> "09611-622333", "0241030303" -> "02-41030303" (display only) */
export function formatPhone(number = "") {
    const d = String(number).replace(/\D/g, "").replace(/^880/, "0");
    if (d.length === 11) return `${d.slice(0, 5)}-${d.slice(5)}`;
    if (d.length === 10 && d.startsWith("02")) return `02-${d.slice(2)}`; // Dhaka landline
    return number;
}
